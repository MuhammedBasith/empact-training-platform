// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, initiatePasswordReset } from "../components/Auth/AuthService";
import { useNavigate } from 'react-router-dom';

// Define types for better TypeScript support
interface AuthContextType {
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  resetPassword: (username: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const idToken = sessionStorage.getItem("idToken");
    if (idToken) {
      setUser({ idToken });
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const authResult = await signIn(username, password);
      if (authResult) {
        setUser(authResult);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate("/signin");
  };

  const resetPassword = async (username: string) => {
    await initiatePasswordReset(username);
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    signUp,
    isAuthenticated: Boolean(user),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
