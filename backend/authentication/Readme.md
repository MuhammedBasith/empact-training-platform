# Microservice Authentication Documentation

## Overview

This microservice provides authentication functionality using AWS Cognito for user management and JWT (JSON Web Tokens) for secure communication. It uses MongoDB to store user data and supports roles like manager, employee, trainer, and admin.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Folder Structure](#folder-structure)
3. [Models](#models)
4. [Services](#services)
   - [Token Verification](#token-verification)
   - [User Management](#user-management)
5. [Controllers](#controllers)
6. [Routes](#routes)
7. [Middleware](#middleware)
8. [Error Handling](#error-handling)
9. [Environment Variables](#environment-variables)
10. [Running the Service](#running-the-service)

## Getting Started

To set up and run the microservice, follow these steps:

1. **Clone the repository**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up your environment variables** (see [Environment Variables](#environment-variables)).
4. **Run the service**:
   ```bash
   npm run dev
   ```

## Folder Structure

```
/src
├── config
│   └── db.config.ts      # Database connection configuration
├── controllers
│   └── auth.controller.ts # Controller for authentication routes
├── models
│   └── user.model.ts      # Mongoose user model
├── routes
│   └── auth.routes.ts      # Auth routes
├── services
│   └── auth.service.ts     # Service for authentication logic
├── server.ts                  # Main application file
└── ...
```

## Models

### User Model (`user.model.ts`)

The user model defines the structure of user documents in MongoDB.

```typescript
export interface IUser extends Document {
  cognitoId: string;     // Unique identifier from Cognito
  email: string;         // User's email address
  name?: string;         // Optional name of the user
  role: string;          // User's role (manager, employee, trainer, admin)
  createdAt: Date;       // Timestamp of user creation
}
```

## Services

### Token Verification (`auth.service.ts`)

The service handles token verification and user management.

#### Verify Token Function

Verifies JWT tokens using AWS Cognito.

```typescript
export const verifyToken = async (token: string) => {
  const payload = await verifier.verify(token);
  return payload; // Contains the claims from the JWT
};
```

### User Management

Functions to check user existence and save new users.

```typescript
export const findUserByCognitoId = async (cognitoId: string) => {
  return await User.findOne({ cognitoId });
};

export const saveUser = async (cognitoId: string, email: string, name: string, role: string) => {
  const user = new User({ cognitoId, email, name, role });
  return await user.save();
};
```

## Controllers

### Authentication Controller (`auth.controller.ts`)

Handles incoming requests for token verification.

#### Verify Controller

This controller verifies the JWT and manages user creation.

```typescript
export const verifyController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Implementation details...
};
```

## Routes

### Authentication Routes (`auth.routes.ts`)

Defines the routes for authentication-related endpoints.

```typescript
router.post('/verify', verifyController);
```

## Middleware

Middleware is used to enhance security and manage requests.

- **Helmet**: Sets security-related HTTP headers.
- **CORS**: Enables Cross-Origin Resource Sharing.
- **Morgan**: Logs requests to the console.
- **Body Parsing**: Parses JSON and URL-encoded bodies.

## Error Handling

The service includes a centralized error handling middleware to catch and log errors:

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});
```

## Environment Variables

The following environment variables are required:

- `REGION`: AWS region where your Cognito user pool is located.
- `USER_POOL_ID`: Your Cognito user pool ID.
- `CLIENT_ID`: Your Cognito app client ID.
- `PORT`: (Optional) The port on which the server runs.

## Running the Service

1. Ensure MongoDB is running.
2. Set your environment variables in a `.env` file or your system's environment.
3. Start the application:
   ```bash
   npm run dev
   ```

Visit `http://localhost:<3000>/` to check if the API is running.