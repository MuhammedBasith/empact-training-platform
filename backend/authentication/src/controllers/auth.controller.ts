// auth.controller.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, saveUser, findUserByCognitoId } from '../services/auth.service';
import { isUserConfirmed, confirmNewPassword, saveUserToDatabase  } from "../services/auth.service";
import  User , { IUser } from '../models/user.model';

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
    // Extract email from request parameters
    const { email } = request.params;

    // Validate the email format
    if (!email) {
      return response.status(400).json({ message: 'Email is required' });
    }

    // Query the User model to find the user by email
    const user = await User.findOne({ email });

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