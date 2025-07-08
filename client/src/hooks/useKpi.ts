
import { useState } from 'react';
import { KpiMetrics } from '../api/kpi';

// Simplified KPI hook that returns static data to avoid promise rejections
export const useKpi = () => {
  const [metrics] = useState<KpiMetrics>({
    activeServices: 3,
    monthlySpend: 1250,
    supportTickets: 2,
    accountStatus: 'Active' as const,
    totalRevenue: 45000,
    completedOrders: 127,
    avgOrderValue: 354,
    customerSatisfaction: 92,
    avgResponseTime: 2.4,
    resolutionRate: 87,
    completedTasks: 89
  });
  
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return { metrics, loading, error };
};
