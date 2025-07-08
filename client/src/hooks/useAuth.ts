import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // For now, just set a mock user to enable authentication
      setUser({ 
        id: 1, 
        email: 'demo@victorysync.com', 
        name: 'Demo User' 
      });
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/';
  };

  const login = (email: string, password: string) => {
    // Simple mock login for demo purposes
    if (email && password) {
      const token = 'demo-token-' + Date.now();
      localStorage.setItem('auth_token', token);
      setUser({ 
        id: 1, 
        email: email, 
        name: email.split('@')[0] 
      });
      return true;
    }
    return false;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    login,
  };
}
