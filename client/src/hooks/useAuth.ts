import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem('auth_token');
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!token) {
        return null;
      }
      
      try {
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
      } catch (error) {
        // Handle network errors and other exceptions
        console.error('Auth error:', error);
        localStorage.removeItem('auth_token');
        return null;
      }
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
