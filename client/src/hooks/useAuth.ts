import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { queryClient } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  role: string;
  org_id: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is valid by calling whoami
      fetch('/api/auth/whoami', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setUser(null);
        }
      })
      .catch(() => {
        // If verification fails, clear token and user
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);

      // Invalidate and refetch queries
      queryClient.invalidateQueries();
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
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