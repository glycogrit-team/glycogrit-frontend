/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api-client';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  city?: string;
  state?: string;
  is_active: boolean;
  email_verified: boolean;
  oauth_provider?: string;
  profile_picture_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    city?: string;
    state?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'glycogrit_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        apiClient.setAuthToken(token);
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem(TOKEN_KEY);
          apiClient.setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    const { access_token } = response;

    // Store token
    localStorage.setItem(TOKEN_KEY, access_token);
    apiClient.setAuthToken(access_token);

    // Fetch user data
    const userData = await apiClient.getCurrentUser();
    setUser(userData);
  };

  const loginWithGoogle = async (token: string) => {
    const response = await apiClient.googleAuth(token);
    const { access_token } = response;

    // Store token
    localStorage.setItem(TOKEN_KEY, access_token);
    apiClient.setAuthToken(access_token);

    // Fetch user data
    const userData = await apiClient.getCurrentUser();
    setUser(userData);
  };

  const register = async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    city?: string;
    state?: string;
  }) => {
    const response = await apiClient.register(userData);
    const { access_token } = response;

    // Store token
    localStorage.setItem(TOKEN_KEY, access_token);
    apiClient.setAuthToken(access_token);

    // Fetch user data
    const userDataResponse = await apiClient.getCurrentUser();
    setUser(userDataResponse);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    apiClient.setAuthToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!apiClient.getAuthToken()) return;

    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Token is invalid, clear it
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
