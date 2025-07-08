import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem('auth_token');
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    enabled: false, // Disable automatic execution to prevent rejections
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return {
    user: null, // Temporarily disable auth to fix loading issues
    isLoading: false,
    isAuthenticated: false,
    logout,
  };
}
