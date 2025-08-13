
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [, setLocation] = useLocation();
  const token = localStorage.getItem('vs_token');
  
  useEffect(() => {
    if (!token) {
      setLocation('/login');
    }
  }, [token, setLocation]);

  return token ? children : null;
}
