import React, { createContext, useState, useEffect } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../utils/cognito';

interface AuthContextType {
  user: CognitoUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      userPool.signIn(email, password, {
        onSuccess: (user) => {
          setUser(user);
          resolve();
        },
        onFailure: (err) => reject(err),
      });
    });
  };

  const signUp = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      userPool.signUp(email, password, [], null, (err, data) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  const signOut = () => {
    if (user) {
      user.signOut();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
