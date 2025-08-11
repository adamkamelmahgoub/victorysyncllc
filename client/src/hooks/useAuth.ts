import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem('auth_token');
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!token) {
        return null;
      }
      
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          return null;
        }
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      return data.user;
    },
    retry: false,
    enabled: !!token,
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    logout,
  };
}
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token/session
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token with your backend
      setIsAuthenticated(true);
      // Mock user data - replace with actual API call
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'User'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    const mockUser = { id: '1', email, name: 'User' };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'mock-token');
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
