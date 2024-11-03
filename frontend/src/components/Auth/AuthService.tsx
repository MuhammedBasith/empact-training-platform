import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    GetUserCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    AdminGetUserCommand,
    InitiateAuthCommandOutput,
    AdminSetUserPasswordCommand,
    SignUpCommandOutput,
    GetUserCommandOutput,
    AdminGetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoUser } from "amazon-cognito-identity-js";

interface AuthResult {
    IdToken?: string;
    AccessToken?: string;
    RefreshToken?: string;
}

interface SignInResponse {
    AuthenticationResult?: AuthResult;
}

interface SignUpResponse {
    response: SignUpCommandOutput;
}

interface ConfirmSignUpResponse {
    success: boolean;
}

// Create the Cognito client
export const cognitoClient = new CognitoIdentityProviderClient({
    region: import.meta.env.VITE_APP_REGION || "ap-south-1", // Default region
});

export const signIn = async (username: string, password: string): Promise<AuthResult | null> => {
    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: import.meta.env.VITE_APP_CLIENT_ID!,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    };

    try {
        const command = new InitiateAuthCommand(params);
        const response: InitiateAuthCommandOutput = await cognitoClient.send(command);

        if (response.AuthenticationResult) {
            const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
            sessionStorage.setItem("idToken", IdToken || "");
            sessionStorage.setItem("accessToken", AccessToken || "");
            sessionStorage.setItem("refreshToken", RefreshToken || "");

            const userCommand = new GetUserCommand({ AccessToken: AccessToken! });
            const userResponse: GetUserCommandOutput = await cognitoClient.send(userCommand);

            const customRole = userResponse.UserAttributes?.find(attr => attr.Name === "custom:role");
            const customRoleValue = customRole ? customRole.Value : "No custom role found";
            sessionStorage.setItem("customRole", customRoleValue);

            return response.AuthenticationResult;
        }
        return null;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export const signUp = async (email: string, password: string, name: string, role: string): Promise<SignUpResponse> => {
    const params = {
        ClientId: import.meta.env.VITE_APP_CLIENT_ID!,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email },
            { Name: "name", Value: name },
            { Name: "custom:role", Value: role },
        ],
    };

    try {
        const command = new SignUpCommand(params);
        const response: SignUpCommandOutput = await cognitoClient.send(command);
        console.log("Sign up success:", response);
        return { response };
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export const confirmSignUp = async (username: string, code: string): Promise<ConfirmSignUpResponse> => {
    const params = {
        ClientId: import.meta.env.VITE_APP_CLIENT_ID!,
        Username: username,
        ConfirmationCode: code,
    };

    try {
        const command = new ConfirmSignUpCommand(params);
        await cognitoClient.send(command);
        console.log("User confirmed successfully");
        return { success: true };
    } catch (error) {
        console.error("Error confirming sign up:", error);
        throw error;
    }
};

// Function to initiate password reset
export const initiatePasswordReset = async (username: string): Promise<void> => {
    const params = {
        ClientId: import.meta.env.VITE_APP_CLIENT_ID!,
        Username: username,
    };

    try {
        const command = new ForgotPasswordCommand(params);
        await cognitoClient.send(command);
        console.log("Password reset initiated");
    } catch (error) {
        console.error("Error initiating password reset:", error);
        throw error;
    }
};

// Function to check if the user is confirmed
export const isUserConfirmed = async (username: string): Promise<boolean> => {
    try {
        const params = {
            Username: username,
            UserPoolId: import.meta.env.VITE_APP_USER_POOL_ID, // Ensure correct environment variable is used
        };

        const command = new AdminGetUserCommand(params);
        
        const response = await cognitoClient.send(command);
        return response.UserStatus === "CONFIRMED";
    } catch (error) {
        console.error("Error checking user confirmation status:", error);
        throw error;
    }
};


export const confirmNewPassword = async (
    username: string,
    verificationCode: string,
    newPassword: string
): Promise<void> => {
    const params = {
        UserPoolId: import.meta.env.VITE_APP_USER_POOL_ID!, // Ensure user pool ID is correct
        Username: username,
        Password: newPassword,
        Permanent: true, // Use Permanent: true for setting a new password permanently
    };

    try {
        const command = new AdminSetUserPasswordCommand(params);
        await cognitoClient.send(command);
        console.log("New password confirmed successfully");
    } catch (error) {
        console.error("Error confirming new password:", error);
        throw error;
    }
};


// Redefining resetPassword function
export const resetPassword = async (username: string, verificationCode: string, newPassword: string): Promise<void> => {
    const user = new CognitoUser({
        Username: username,
        Pool: import.meta.env.VITE_APP_USER_POOL_ID!, // Make sure userPool is defined somewhere in your code
    });

    return new Promise((resolve, reject) => {
        user.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => {
                resolve(); // Successfully confirmed the new password
            },
            onFailure: (err) => {
                reject(err); // Handle error
            },
        });
    });
};