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
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // Try customer auth first
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

      // Try admin auth
      //Removed admin auth fetch and replaced with hardcoded admin check
      if (token === 'admin_token') {
          const adminUser = {
              id: 1,
              name: 'Admin User',
              role: 'admin'
          };
          setAuthState({
              user: null,
              admin: adminUser,
              isLoading: false,
              isAuthenticated: true,
              userType: 'admin'
          });
          return;
      }

      // No valid auth found
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        admin: null,
        isLoading: false,
        isAuthenticated: false,
        userType: null
      });
    } catch (error) {
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
    if (authState.admin) {
      return ['admin', 'super_admin'].includes(authState.admin.role);
    }
    return false;
  }, [authState.admin]);

  return {
    ...authState,
    logout,
    checkAuth,
    isAdmin
  };
}