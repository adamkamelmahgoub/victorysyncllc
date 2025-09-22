
import { useQuery } from '@tanstack/react-query'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) return null
      return res.json() as Promise<{ id: number; email: string } | null>
    },
    retry: false,
  })
}
