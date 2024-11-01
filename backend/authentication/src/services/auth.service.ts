// auth.service.ts

import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import User from '../models/user.model';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

// Set up the JWT Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  clientId: process.env.CLIENT_ID,
  tokenUse: "id", // or "access" depending on your use case
  jwksUri: `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`,
});

// Verify Token Function
export const verifyToken = async (token: string) => {
  const payload = await verifier.verify(token);
  return payload; // Contains the claims from the JWT
};

// Helper to get Role from Cognito
const getRoleFromCognito = async (accessToken: string) => {
  const userCommand = new GetUserCommand({ AccessToken: accessToken });
  const userResponse = await cognitoClient.send(userCommand);
  
  if (!userResponse.UserAttributes) return null; // Handle case where userAttributes may be undefined
  
  const customRole = userResponse.UserAttributes.find(attr => attr.Name === 'custom:role');
  return customRole ? customRole.Value : null;
};

// Function to check if user exists
export const findUserByCognitoId = async (cognitoId: string) => {
  return await User.findOne({ cognitoId });
};

// Save User Function
export const saveUser = async (cognitoId: string, email: string, name: string, role: string) => {
  const user = new User({ cognitoId, email, name, role });
  return await user.save();
};
