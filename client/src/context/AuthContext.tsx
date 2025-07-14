// src/context/AuthContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Move the function definition inside the effect
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get<User>('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user, logging out.');
        // Since logout is defined outside, it needs to be a dependency.
        // Or, we can just call the core logic directly.
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    role: user?.role || null,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to fetch the current user, used in login and effect
async function fetchCurrentUser() {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
}
