
import { Navigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { data: me, isLoading, error } = useMe();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!me || error) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default PrivateRoute;
