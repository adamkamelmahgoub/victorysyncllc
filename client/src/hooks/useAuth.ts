
import { useState, useEffect, useMemo, useCallback } from 'react';

interface User {
  id: number;
  email?: string;
  username?: string;
  name: string;
  role: string;
  permissions?: any;
  privileges?: any;
  isActive?: boolean;
}

interface AuthState {
  user: User | null;
  admin: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'customer' | 'admin' | null;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    admin: null,
    isLoading: true,
    isAuthenticated: false,
    userType: null,
    error: null
  });

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthState({
          user: null,
          admin: null,
          isLoading: false,
          isAuthenticated: false,
          userType: null,
          error: null
        });
        return;
      }

      // Decode token to check userType
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (payload.userType === 'admin') {
          // Try admin auth
          const adminResponse = await fetch('/api/admin/auth/me', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (adminResponse.ok) {
            const data = await adminResponse.json();
            setAuthState({
              user: null,
              admin: data.admin,
              isLoading: false,
              isAuthenticated: true,
              userType: 'admin',
              error: null
            });
            return;
          } else {
            throw new Error('Admin authentication failed');
          }
        } else if (payload.userType === 'customer') {
          // Try customer auth
          const customerResponse = await fetch('/api/auth/me', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (customerResponse.ok) {
            const data = await customerResponse.json();
            if (data.user && data.user.isActive !== false) {
              setAuthState({
                user: data.user,
                admin: null,
                isLoading: false,
                isAuthenticated: true,
                userType: 'customer',
                error: null
              });
              return;
            } else {
              throw new Error('Account is deactivated');
            }
          } else {
            throw new Error('Customer authentication failed');
          }
        } else {
          throw new Error('Invalid token format');
        }
      } catch (decodeError) {
        throw new Error('Invalid or corrupted token');
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        admin: null,
        isLoading: false,
        isAuthenticated: false,
        userType: null,
        error: error.message || 'Authentication failed'
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      admin: null,
      isLoading: false,
      isAuthenticated: false,
      userType: null,
      error: null
    });
    window.location.href = '/';
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAdmin = useMemo(() => {
    return authState.admin && ['admin', 'super_admin', 'sales_admin', 'billing_admin', 'csr_manager', 'agent_manager'].includes(authState.admin.role);
  }, [authState.admin]);

  const isSuperAdmin = useMemo(() => {
    return authState.admin && authState.admin.role === 'super_admin';
  }, [authState.admin]);

  const isCustomer = useMemo(() => {
    return authState.user && authState.user.role === 'customer' && authState.user.isActive !== false;
  }, [authState.user]);

  const hasPermission = useCallback((permission: string) => {
    if (authState.userType === 'admin' && authState.admin) {
      if (authState.admin.role === 'super_admin') return true;
      return authState.admin.permissions?.[permission] === true;
    }
    return false;
  }, [authState.userType, authState.admin]);

  return {
    ...authState,
    logout,
    checkAuth,
    clearError,
    isAdmin,
    isSuperAdmin,
    isCustomer,
    hasPermission
  };
}
