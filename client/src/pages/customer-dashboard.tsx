
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Phone, 
  Mail,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  DollarSign,
  Target,
  Activity,
  Settings,
  Link,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExternalIntegration {
  id: string;
  name: string;
  type: 'crm' | 'dialer' | 'analytics' | 'social' | 'email';
  isConnected: boolean;
  apiKey?: string;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
}

interface KPIData {
  totalCalls: number;
  callsToday: number;
  conversionRate: number;
  averageCallDuration: number;
  leadsGenerated: number;
  dealsCreated: number;
  revenue: number;
  customerSatisfaction: number;
  responseTime: number;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [integrationApiKey, setIntegrationApiKey] = useState('');
  const [integrationSettings, setIntegrationSettings] = useState<any>({});

  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([
    {
      id: 'salesforce',
      name: 'Salesforce CRM',
      type: 'crm',
      isConnected: false,
      status: 'disconnected'
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      type: 'crm',
      isConnected: true,
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ringcentral',
      name: 'RingCentral',
      type: 'dialer',
      isConnected: true,
      status: 'connected',
      lastSync: '2024-01-15T11:00:00Z'
    },
    {
      id: 'twilio',
      name: 'Twilio',
      type: 'dialer',
      isConnected: false,
      status: 'disconnected'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      type: 'analytics',
      isConnected: true,
      status: 'connected',
      lastSync: '2024-01-15T11:15:00Z'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      type: 'email',
      isConnected: false,
      status: 'disconnected'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      type: 'crm',
      isConnected: false,
      status: 'disconnected'
    },
    {
      id: 'zendesk',
      name: 'Zendesk',
      type: 'crm',
      isConnected: false,
      status: 'disconnected'
    }
  ]);

  const [kpiData] = useState<KPIData>({
    totalCalls: 1247,
    callsToday: 34,
    conversionRate: 23.5,
    averageCallDuration: 287,
    leadsGenerated: 89,
    dealsCreated: 21,
    revenue: 45280,
    customerSatisfaction: 4.2,
    responseTime: 12
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!user,
  });

  const handleIntegrationConnect = (integration: ExternalIntegration) => {
    setSelectedIntegration(integration);
    setIntegrationApiKey('');
    setIntegrationSettings({});
    setIsIntegrationModalOpen(true);
  };

  const handleSaveIntegration = async () => {
    if (!selectedIntegration) return;

    try {
      // Simulate API call to connect integration
      setIntegrations(prev => prev.map(int => 
        int.id === selectedIntegration.id 
          ? { ...int, isConnected: true, status: 'connected' as const, apiKey: integrationApiKey, lastSync: new Date().toISOString() }
          : int
      ));

      toast({
        title: "Integration Connected",
        description: `${selectedIntegration.name} has been successfully connected`,
      });

      setIsIntegrationModalOpen(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect integration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIntegrationDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, isConnected: false, status: 'disconnected' as const, apiKey: undefined }
        : int
    ));

    toast({
      title: "Integration Disconnected",
      description: "Integration has been successfully disconnected",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'syncing': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h1>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Monitor your performance and manage your integrations</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kpis">KPI Tracker</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Calls Today</p>
                      <p className="text-2xl font-bold text-gray-900">{kpiData.callsToday}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{kpiData.conversionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Leads Generated</p>
                      <p className="text-2xl font-bold text-gray-900">{kpiData.leadsGenerated}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-orange-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${kpiData.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">New lead generated from HubSpot</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Call completed via RingCentral</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Google Analytics data synchronized</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Call Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Calls</span>
                    <span className="font-semibold">{kpiData.totalCalls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today</span>
                    <span className="font-semibold">{kpiData.callsToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Duration</span>
                    <span className="font-semibold">{formatDuration(kpiData.averageCallDuration)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-semibold">{kpiData.responseTime}s</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Sales Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="font-semibold">{kpiData.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Leads Generated</span>
                    <span className="font-semibold">{kpiData.leadsGenerated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Deals Created</span>
                    <span className="font-semibold">{kpiData.dealsCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold">${kpiData.revenue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Customer Satisfaction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="font-semibold">{kpiData.customerSatisfaction}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(kpiData.customerSatisfaction / 5) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on {Math.floor(kpiData.totalCalls * 0.3)} customer reviews
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Data Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Real-time Data Feed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">HubSpot: New lead captured</span>
                    </div>
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-sm">RingCentral: Call in progress</span>
                    </div>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-sm">Google Analytics: Traffic spike detected</span>
                    </div>
                    <span className="text-xs text-gray-500">5 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="w-5 h-5" />
                  <span>External Integrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {integration.type === 'crm' && <Users className="w-5 h-5 text-gray-600" />}
                            {integration.type === 'dialer' && <Phone className="w-5 h-5 text-gray-600" />}
                            {integration.type === 'analytics' && <BarChart3 className="w-5 h-5 text-gray-600" />}
                            {integration.type === 'email' && <Mail className="w-5 h-5 text-gray-600" />}
                            {integration.type === 'social' && <Users className="w-5 h-5 text-gray-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{integration.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{integration.type}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                      </div>
                      
                      {integration.isConnected && integration.lastSync && (
                        <div className="text-xs text-gray-500">
                          Last sync: {new Date(integration.lastSync).toLocaleString()}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {integration.isConnected ? (
                          <>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4 mr-1" />
                              Configure
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleIntegrationDisconnect(integration.id)}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleIntegrationConnect(integration)}
                            className="bg-victory-purple hover:bg-purple-700"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Your Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">When you place orders, they'll appear here.</p>
                    <Button onClick={() => window.location.href = '/pricing'}>
                      View Services
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {order.status}
                          </Badge>
                          <span className="font-semibold">${parseFloat(order.total).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Setup Modal */}
        <Dialog open={isIntegrationModalOpen} onOpenChange={setIsIntegrationModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={integrationApiKey}
                  onChange={(e) => setIntegrationApiKey(e.target.value)}
                />
              </div>
              
              {selectedIntegration?.type === 'crm' && (
                <div>
                  <Label htmlFor="crm-url">CRM URL</Label>
                  <Input
                    id="crm-url"
                    placeholder="https://your-crm-domain.com"
                    value={integrationSettings.crmUrl || ''}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, crmUrl: e.target.value})}
                  />
                </div>
              )}
              
              {selectedIntegration?.type === 'dialer' && (
                <div>
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    placeholder="+1234567890"
                    value={integrationSettings.phoneNumber || ''}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, phoneNumber: e.target.value})}
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={integrationSettings.autoSync || false}
                  onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, autoSync: checked})}
                />
                <Label>Enable automatic data synchronization</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsIntegrationModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveIntegration} className="bg-victory-purple hover:bg-purple-700">
                  Connect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
