
import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../hooks/useMe';

export default function PrivateRoute() {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
