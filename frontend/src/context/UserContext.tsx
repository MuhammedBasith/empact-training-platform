import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the user data
interface User {
  name: string;
  email: string;
  role: string;
  cognitoID: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage whenever the user changes
  const handleSetUser = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  console.log("User context updated:", user);

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
