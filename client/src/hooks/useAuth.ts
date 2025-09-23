import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/authUtils";

export function useAuth() {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: fetchMe,
    // Never undefined because fetchMe returns either object or null
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    window.location.href = '/';
  };

  return {
    user: authData?.user || null,
    isLoading,
    isAuthenticated: !!authData?.user,
    logout,
  };
}
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false
  };
}
