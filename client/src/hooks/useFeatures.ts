
import { useQuery } from "@tanstack/react-query";

export function useFeatures(customerId?: number) {
  return useQuery({
    queryKey: ["/api/features", customerId],
    queryFn: async () => {
      const response = await fetch(`/api/features?customer_id=${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch features');
      }
      const data = await response.json();
      return data.features || [];
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
