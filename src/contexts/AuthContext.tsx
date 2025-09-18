import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getToken, setToken, removeToken, isAuthenticated } from '@/lib/auth';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // In a real app, you'd validate the token with the server
      // For now, we'll assume the token is valid if it exists
      const mockUser: User = {
        id: '1',
        username: 'Demo User',
        email: 'demo@example.com'
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, accept any email/password combination
      const mockAuthResponse = {
        token: 'demo-jwt-token-' + Date.now(),
        user: {
          id: 'demo-user-1',
          username: email.split('@')[0] || 'Demo User',
          email: email
        }
      };
      
      setToken(mockAuthResponse.token);
      setUser(mockAuthResponse.user);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // For demo purposes, accept any registration
      const mockAuthResponse = {
        token: 'demo-jwt-token-' + Date.now(),
        user: {
          id: 'demo-user-' + Date.now(),
          username: username,
          email: email
        }
      };
      
      setToken(mockAuthResponse.token);
      setUser(mockAuthResponse.user);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};