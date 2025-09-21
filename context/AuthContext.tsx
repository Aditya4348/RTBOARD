
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, UserRole } from '../types';
import { initialUsers } from './DataContext'; // for credential check

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useLocalStorage<User[]>('users', initialUsers);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!currentUser);

  const login = useCallback((username: string, password: string): boolean => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in session
      setCurrentUser(userToStore);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [users, setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, [setCurrentUser]);

  const value = useMemo(() => ({
    user: currentUser,
    isAuthenticated,
    login,
    logout,
  }), [currentUser, isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
