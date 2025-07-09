
import { useState, useEffect, useMemo } from 'react';

interface User {
  id: number;
  email?: string;
  username?: string;
  name: string;
  role: string;
  permissions?: any;
}

interface AuthState {
  user: User | null;
  admin: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'customer' | 'admin' | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    admin: null,
    isLoading: true,
    isAuthenticated: false,
    userType: null
  });

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Decode token to check userType
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.userType === 'admin') {
        // Try admin auth
        const adminResponse = await fetch('/api/admin/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (adminResponse.ok) {
          const data = await adminResponse.json();
          setAuthState({
            user: null,
            admin: data.admin,
            isLoading: false,
            isAuthenticated: true,
            userType: 'admin'
          });
          return;
        }
      } else if (payload.userType === 'customer') {
        // Try customer auth
        const customerResponse = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (customerResponse.ok) {
          const data = await customerResponse.json();
          setAuthState({
            user: data.user,
            admin: null,
            isLoading: false,
            isAuthenticated: true,
            userType: 'customer'
          });
          return;
        }
      }

      // Token is invalid, clear it
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        admin: null,
        isLoading: false,
        isAuthenticated: false,
        userType: null
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        admin: null,
        isLoading: false,
        isAuthenticated: false,
        userType: null
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      admin: null,
      isLoading: false,
      isAuthenticated: false,
      userType: null
    });
    window.location.href = '/';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isAdmin = useMemo(() => {
    return authState.admin && ['admin', 'super_admin'].includes(authState.admin.role);
  }, [authState.admin]);

  const isCustomer = useMemo(() => {
    return authState.user && authState.user.role === 'customer';
  }, [authState.user]);

  return {
    ...authState,
    logout,
    checkAuth,
    isAdmin,
    isCustomer
  };
}
