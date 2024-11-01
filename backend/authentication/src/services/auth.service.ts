import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

// Initialize the Cognito JWT Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID, // Your User Pool ID
  tokenUse: "access", // Specify whether you're validating an access token or ID token
  jwtAwsRegion: process.env.REGION, // AWS Region
});

// Signup Function
export const signUpUser = async (email: string, password: string, name: string, role: string) => {
  const params = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "custom:role", Value: role },
    ],
  };
  const command = new SignUpCommand(params);
  return await cognitoClient.send(command);
};

// Login Function
export const signInUser = async (username: string, password: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.CLIENT_ID,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  };
  const command = new InitiateAuthCommand(params);
  const { AuthenticationResult } = await cognitoClient.send(command);

  if (!AuthenticationResult) throw new Error("Failed to authenticate");

  const role = await getRoleFromCognito(AuthenticationResult.AccessToken);

  return {
    idToken: AuthenticationResult.IdToken,
    accessToken: AuthenticationResult.AccessToken,
    refreshToken: AuthenticationResult.RefreshToken,
    cognitoId: username,
    role: role,
  };
};

// Verify Token Function
export const verifyToken = async (token: string) => {
  try {
    const decoded = await verifier.verify(token);
    return decoded; // Return the decoded token if valid
  } catch (error) {
    throw new Error("Token verification failed: " + error.message);
  }
};

// Helper to get Role from Cognito
const getRoleFromCognito = async (accessToken: string) => {
  const userCommand = new GetUserCommand({ AccessToken: accessToken });
  const userResponse = await cognitoClient.send(userCommand);
  
  if (!userResponse.UserAttributes) return null; // Handle case where userAttributes may be undefined
  
  const customRole = userResponse.UserAttributes.find(attr => attr.Name === 'custom:role');
  return customRole ? customRole.Value : null;
};
