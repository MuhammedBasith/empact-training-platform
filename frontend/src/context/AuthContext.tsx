// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, initiatePasswordReset } from "../components/Auth/AuthService";
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string; // Adjust this type based on your application's roles
  user: any; // Replace with a more specific user type if you have one
  setUser: (user: any) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setRole: (role: string) => void; // Add if you want to set role
  loading: boolean; // To handle loading state
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (username: string, password: string) => Promise<void>; // Add signUp if necessary
  resetPassword: (email: string) => Promise<void>; // Adjust if you need specific parameters
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const idToken = sessionStorage.getItem("idToken");
    const customRole = sessionStorage.getItem("customRole"); // Get the role from session storage
    if (idToken) {
      setUser({ idToken });
      if (customRole) {
        setRole(JSON.parse(customRole).toLowerCase()); // Parse and set the role in lowercase
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const authResult = await signIn(username, password);
      if (authResult) {
        setUser(authResult);
        sessionStorage.setItem("idToken", authResult.idToken); // Store the token in session storage
        sessionStorage.setItem("customRole", JSON.stringify(authResult.role)); // Store the role in session storage
        setRole(authResult.role.toLowerCase()); // Set role in state in lowercase
        navigate(`/dashboard/${authResult.role.toLowerCase()}`); // Redirect to the role-specific dashboard
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setRole(""); // Clear role on logout
    navigate("/signin");
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    signUp,
    resetPassword: initiatePasswordReset, // Directly using function from AuthService
    role,
    setUser,
    setRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
