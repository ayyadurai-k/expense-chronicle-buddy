
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, subscribeToAuthChanges } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      if (user) {
        toast.success(`Welcome back, ${user.displayName || user.email}`);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
