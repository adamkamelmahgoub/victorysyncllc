import { useState } from "react";

export function useAuth() {
  const [user] = useState(null);
  const [isLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: false,
    logout,
  };
}
