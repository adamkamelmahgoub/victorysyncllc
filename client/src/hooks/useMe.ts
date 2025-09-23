
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useMe() {
  return useQuery({
    queryKey: ['/api/session/me'], // keep path+key in sync
    queryFn: () => api('/session/me'),
    select: (d) => d?.user ?? null, // never undefined
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
