import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ConnectIntegrationModal } from '@/components/ConnectIntegrationModal';
import { TrendingUp, TrendingDown, Plus, ExternalLink } from 'lucide-react';

interface KPIMetric {
  name: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  description?: string;
  source?: string;
}

interface DashboardMetrics {
  metrics: KPIMetric[];
  message?: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
      return;
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const { data: dashboardData, isLoading: metricsLoading, error } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: integrations = [] } = useQuery<any[]>({
    queryKey: ['/api/integrations'],
    enabled: isAuthenticated,
  });

  if (isLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-white/10 border-white/20">
                <CardHeader>
                  <Skeleton className="h-4 w-24 bg-white/20" />
                  <Skeleton className="h-6 w-16 bg-white/20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-20 bg-white/20" />
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
            <p className="text-red-300">Failed to load dashboard data</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || [];
  const hasIntegrations = integrations.filter(i => i.is_active).length > 0;

  const renderMetricCard = (metric: KPIMetric, index: number) => (
    <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardDescription className="text-white/70 text-xs">
          {metric.source && `${metric.source} • `}{metric.description}
        </CardDescription>
        <CardTitle className="text-white text-lg">{metric.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {metric.value}
            {metric.unit && <span className="text-sm text-white/70 ml-1">{metric.unit}</span>}
          </span>
          {metric.change !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${
              metric.changeType === 'increase' ? 'text-green-400' :
              metric.changeType === 'decrease' ? 'text-red-400' : 'text-white/70'
            }`}>
              {metric.changeType === 'increase' && <TrendingUp className="w-4 h-4" />}
              {metric.changeType === 'decrease' && <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(metric.change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/70">
              Welcome back, {user?.name || user?.email}
            </p>
          </div>
          <Button
            onClick={() => setConnectModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>

        {!hasIntegrations ? (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">No Integrations Connected</h2>
              <p className="text-white/70 mb-6">
                Connect your CRM or dialer tools to see live KPIs and performance metrics.
              </p>
              <Button
                onClick={() => setConnectModalOpen(true)}
                className="bg-white text-purple-900 hover:bg-white/90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect Your First Integration
              </Button>
            </div>
          </div>
        ) : metrics.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Loading Metrics</h2>
              <p className="text-white/70 mb-6">
                Your integrations are connected. Fetching live data...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => renderMetricCard(metric, index))}
          </div>
        )}

        {hasIntegrations && (
          <div className="mt-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Connected Integrations</CardTitle>
                <CardDescription className="text-white/70">
                  Manage your connected CRM and dialer tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {integrations.filter(i => i.is_active).map((integration) => (
                    <div key={integration.id} className="bg-white/10 rounded-lg px-3 py-2">
                      <span className="text-white font-medium capitalize">
                        {integration.type}
                      </span>
                      <span className="text-green-400 ml-2">●</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ConnectIntegrationModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </div>
  );
}