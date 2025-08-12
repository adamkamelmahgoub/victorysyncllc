
import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token/session
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, verify the token with the server
      setIsAuthenticated(true);
      // Mock user data for now
      setUser({
        id: 1,
        email: 'user@example.com',
        name: 'Test User'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    localStorage.setItem('authToken', 'mock-token');
    setIsAuthenticated(true);
    setUser({
      id: 1,
      email,
      name: 'Test User'
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
