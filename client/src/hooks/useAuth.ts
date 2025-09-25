
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
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
          localStorage.removeItem('token');
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
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  const isAdmin = () => {
    return user && ['admin', 'super_admin', 'billing', 'crm_manager'].includes(user.role);
  };

  const isCustomer = () => {
    return user && (user.role === 'user' || user.role === 'customer');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    logout,
  };
}
