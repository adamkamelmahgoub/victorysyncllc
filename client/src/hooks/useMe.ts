
import { useQuery } from '@tanstack/react-query';

export function useMe() {
  return useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const r = await fetch('/api/auth/me', { credentials: 'include' });
      if (r.status === 401) return null;
      if (!r.ok) throw new Error('me failed');
      const data = await r.json();
      return data.user;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
