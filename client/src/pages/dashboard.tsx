
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

interface KPIData {
  totalCalls: number;
  activeAgents: number;
  avgWaitTime: number;
  customerSatisfaction: number;
  conversionRate: number;
  revenue: number;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  joinDate: string;
}

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
      return;
    }
    
    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, setLocation]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch KPI data from multiple sources
      const [kpiResponse, customerResponse] = await Promise.all([
        fetchKPIData(),
        fetchCustomerData()
      ]);

      setKpiData(kpiResponse);
      setCustomerData(customerResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIData = async (): Promise<KPIData> => {
    // Fetch from HubSpot API
    const hubspotData = await fetchHubSpotMetrics();
    
    // Fetch from Five9 API
    const five9Data = await fetchFive9Metrics();
    
    // Combine and return KPI data
    return {
      totalCalls: five9Data.totalCalls || 0,
      activeAgents: five9Data.activeAgents || 0,
      avgWaitTime: five9Data.avgWaitTime || 0,
      customerSatisfaction: hubspotData.satisfaction || 0,
      conversionRate: hubspotData.conversionRate || 0,
      revenue: hubspotData.revenue || 0
    };
  };

  const fetchHubSpotMetrics = async () => {
    const response = await fetch('/api/integrations/hubspot/metrics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch HubSpot metrics');
    }
    
    return response.json();
  };

  const fetchFive9Metrics = async () => {
    const response = await fetch('/api/integrations/five9/metrics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Five9 metrics');
    }
    
    return response.json();
  };

  const fetchCustomerData = async (): Promise<CustomerData[]> => {
    const response = await fetch('/api/customers', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }
    
    return response.json();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <Skeleton className="h-4 w-32 bg-white/20" />
                  <Skeleton className="h-8 w-24 bg-white/20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full bg-white/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Dashboard Error</h1>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="text-white/70">
            Welcome back, {user?.name || user?.email}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Total Calls Today</CardTitle>
              <CardDescription className="text-white/70">Active call volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{kpiData?.totalCalls.toLocaleString() || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Active Agents</CardTitle>
              <CardDescription className="text-white/70">Currently online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{kpiData?.activeAgents || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Avg Wait Time</CardTitle>
              <CardDescription className="text-white/70">In seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{kpiData?.avgWaitTime || 0}s</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Customer Satisfaction</CardTitle>
              <CardDescription className="text-white/70">Average rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{(kpiData?.customerSatisfaction || 0).toFixed(1)}/5</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Conversion Rate</CardTitle>
              <CardDescription className="text-white/70">This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{(kpiData?.conversionRate || 0).toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Revenue</CardTitle>
              <CardDescription className="text-white/70">This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${(kpiData?.revenue || 0).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Data Table */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Customers</CardTitle>
            <CardDescription className="text-white/70">Latest customer activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Plan</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.slice(0, 10).map((customer) => (
                    <tr key={customer.id} className="border-b border-white/10">
                      <td className="p-2">{customer.name}</td>
                      <td className="p-2">{customer.email}</td>
                      <td className="p-2">{customer.plan}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          customer.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="p-2">{new Date(customer.joinDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
