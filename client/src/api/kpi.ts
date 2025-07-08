
export interface KpiMetrics {
  activeServices: number;
  monthlySpend: number;
  supportTickets: number;
  accountStatus: 'Active' | 'Inactive';
  totalRevenue: number;
  completedOrders: number;
  avgOrderValue: number;
  customerSatisfaction: number;
  avgResponseTime: number;
  resolutionRate: number;
  completedTasks: number;
}

export const getLiveKpi = async (): Promise<KpiMetrics> => {
  const response = await fetch('/api/kpi/live');
  if (!response.ok) {
    throw new Error('Failed to fetch KPI data');
  }
  return response.json();
};
