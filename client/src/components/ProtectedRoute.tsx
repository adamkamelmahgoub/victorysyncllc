
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCustomer?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireCustomer = false }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, admin, user, userType } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (requireAdmin && userType !== 'admin') {
      window.location.href = '/login?type=admin';
      return;
    }

    if (requireCustomer && userType !== 'customer') {
      window.location.href = '/login';
      return;
    }
  }, [isLoading, isAuthenticated, admin, user, userType, requireAdmin, requireCustomer]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && userType !== 'admin') {
    return null;
  }

  if (requireCustomer && userType !== 'customer') {
    return null;
  }

  return <>{children}</>;
}
