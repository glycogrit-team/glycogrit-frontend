import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('glycogrit_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('glycogrit_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // For testing: Generate a mock token
    // In production, this would come from Firebase/Google OAuth
    const mockToken = `mock-token-${email}-${Date.now()}`;

    const mockUser: User = {
      id: 22,
      email: email,
      name: email.split('@')[0],
      role: email === 'glycogrit@gmail.com' ? 'admin' : 'user',
      is_active: true,
      token: mockToken,
    };
    setUser(mockUser);
    localStorage.setItem('glycogrit_user', JSON.stringify(mockUser));
    localStorage.setItem('glycogrit_token', mockToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glycogrit_user');
    localStorage.removeItem('glycogrit_token');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const token = user?.token || null;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
