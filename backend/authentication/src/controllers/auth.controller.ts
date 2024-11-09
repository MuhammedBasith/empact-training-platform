import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, saveUser, findUserByCognitoId } from '../services/auth.service';
import { isUserConfirmed, confirmNewPassword, saveUserToDatabase  } from "../services/auth.service";
import  User , { IUser } from '../models/user.model';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import generateTemporaryPassword from '../utils/passwordGenerator';


const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

// Verify controller
export const verifyController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = await verifyToken(token);
    const { sub: cognitoId } = decoded;
    const email: string = decoded.email as string;
    const name: string = decoded.name as string;

    if (typeof decoded['custom:role'] !== 'string') {
      throw new Error('Role is not a valid string');
    }
    const role: string = decoded['custom:role'];

    // Check if user already exists
    let user = await findUserByCognitoId(cognitoId);
    
    // Save user to MongoDB if not already present
    if (!user) {
      res.status(403).json({ message: "User does not exist" });
    }

    res.status(200).json({ message: 'Token is valid', user });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: error.message || 'Token is invalid' });
  }
};


export const checkUserStatus = async (req, res) => {
    const { username } = req.query;

    try {
        const isConfirmed = await isUserConfirmed(username);
        res.status(200).json({ isConfirmed });
    } catch (error) {
        res.status(500).json({ message: "Error checking user status", error: error.message });
    }
};


export const confirmNewPasswordController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, verificationCode, newPassword } = req.body;

  try {
      await confirmNewPassword(username, newPassword);
      res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
      console.error("Error confirming new password:", error);
      res.status(500).json({ message: error.message || 'Failed to change password.' });
  }
};

export const signUpController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cognitoId, email, name, role } = req.body;

  try {
      // Call the service to save the user data to the database
      const user = await saveUserToDatabase(cognitoId, email, name, role);
      res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: error.message || 'Failed to create user.' });
  }
};

export async function getUserDetails(
    request: Request<{ cognitoId: string }, {}, {}>,
    response: Response<{  name: string } | { message: string }>
): Promise<any> {
    const { cognitoId } = request.params;

    try {
        const user = await User.findOne({ cognitoId });

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        return response.status(200).json({
            
            name: user.name,
            // Include other user details as necessary
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}


export async function getUserCognitoId(
  request: Request<{ email: string }, {}, {}>, 
  response: Response<{ cognitoId: string } | { message: string }>
): Promise<any> {
  try {
    const { email } = request.params;

    // Check if email is provided
    if (!email) {
      return response.status(400).json({ message: 'Email is required' });
    }

    console.log('Email received:', email); // Debugging log

    // Query the User model to find the user by email
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    // Log the user object to check if it's found
    console.log('User found:', user);

    // If no user is found, return a 404 response
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    // Return the cognitoId of the found user
    return response.status(200).json({ cognitoId: user.cognitoId });
  } catch (error) {
    console.error('Error fetching user cognitoId:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}



export const createAccountByAdmin = async (req: Request<{}, {}, {name: string, email: string, account: string, skills: string, department: string}>,
  res: Response<{message: string} | {cognitoId: string, email: string, name: string, role: string}>): Promise<any> => {

 const { name, email, account, skills, department } = req.body;

 // Validate required fields
 if (!name || !email) {
   return res.status(400).json({ message: 'Name and email are required.' });
 }

 // Check if the user already exists in the database by email
 const existingUser = await User.findOne({ email });

 if (existingUser) {
   // If the user already exists, return the user details from the DB
   return res.status(200).json({
     message: 'User already exists.',
     cognitoId: existingUser.cognitoId,
     email: existingUser.email,
     name: existingUser.name,
     role: existingUser.role,
   });
 }

 // Generate a temporary password
 const temporaryPassword = generateTemporaryPassword();

 try {
   const createUserParams = {
     UserPoolId: process.env.USER_POOL_ID!, 
     Username: email, // Use email as the username
     TemporaryPassword: temporaryPassword, 
     UserAttributes: [
       { Name: 'email', Value: email },
       { Name: 'name', Value: name },
       { Name: 'custom:role', Value: 'employee' }, 
     ],
   };

   // Create the user in Cognito
   const cognitoResponse = await cognito.adminCreateUser(createUserParams).promise();

   // Save the user to the database
   const newUser = new User({
     cognitoId: cognitoResponse.User?.Username,
     email,
     name,
     role: 'Employee',
   });

   // Save the new user in the database
   await newUser.save();

   console.log(`Cognito invitation email sent to ${email} with temporary password: ${temporaryPassword}`);

   // Respond with the Cognito user details and the newly created user
   return res.status(201).json({
     message: 'Account created successfully in Cognito. An invitation email has been sent.',
     cognitoId: cognitoResponse.User?.Username,
     email,
     name,
     role: 'employee', // Default role
   });

 } catch (error) {
   console.error('Error creating user in Cognito:', error);
   return res.status(500).json({ message: 'Error creating user account in Cognito.' });
 }
};

