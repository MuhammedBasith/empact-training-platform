import { Request, Response, NextFunction, RequestHandler } from 'express';
import { signInUser, signUpUser, verifyToken } from '../services/auth.service';
import { createUserIfNotExist } from '../services/user.service';

// Signup controller
export const signupController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;
    const cognitoResponse = await signUpUser(email, password, name, role);
    res.status(201).json({ message: 'User signed up successfully', data: cognitoResponse });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || 'Signup failed' });
  }
};

// Login controller
export const loginController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const authResult = await signInUser(username, password);
    const { idToken, accessToken, refreshToken } = authResult;

    await createUserIfNotExist(authResult.cognitoId, username, authResult.role);

    res.status(200).json({ idToken, accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: error.message || 'Login failed' });
  }
};

// Verify controller
export const verifyController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = await verifyToken(token);
    res.status(200).json({ message: 'Token is valid', decoded });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: error.message || 'Token is invalid' });
  }
};
