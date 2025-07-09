
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Settings, 
  Database, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Phone,
  Users,
  Target,
  Zap,
  Link,
  Trash2,
  Eye,
  Activity,
  Clock,
  Shield,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout, isCustomer, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [newIntegration, setNewIntegration] = useState({
    type: '',
    name: '',
    apiKey: '',
    oauthToken: '',
    webhookUrl: '',
    config: {}
  });
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  // Always declare all hooks at the top level
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    'Content-Type': 'application/json'
  });

  // Only fetch data if user is authenticated and active
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const response = await fetch('/api/user/orders', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!isCustomer && !!user,
  });

  const { data: crmIntegrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ['crm-integrations'],
    queryFn: async () => {
      const response = await fetch('/api/crm/integrations', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
    enabled: !!isCustomer && !!user,
  });

  const { data: supportTickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const response = await fetch('/api/support/tickets', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return response.json();
    },
    enabled: !!isCustomer && !!user,
  });

  // Only fetch KPI metrics if user has active integrations
  const { data: kpiMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['kpi-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/kpi/metrics', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
    enabled: !!isCustomer && !!user && crmIntegrations.some((i: any) => i.isActive),
  });

  // Check authentication and handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive"
      });
      clearError();
    }

    if (!isLoading && (!user || !isCustomer)) {
      toast({
        title: "Access Required",
        description: "Please log in to access your dashboard.",
        variant: "destructive"
      });
      window.location.href = '/login?redirect=/dashboard';
      return;
    }
  }, [user, isCustomer, isLoading, error]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user || !isCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              Please log in with a valid customer account to access this dashboard.
            </p>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mutations for secure operations
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: any) => {
      const response = await fetch('/api/crm/integrations', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...integration,
          config: integration.config || {}
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create integration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-metrics'] });
      setIsIntegrationModalOpen(false);
      setNewIntegration({ type: '', name: '', apiKey: '', oauthToken: '', webhookUrl: '', config: {} });
      toast({ title: 'Success', description: 'Integration created successfully. It may take a few minutes to sync data.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: async (integrationId: number) => {
      const response = await fetch(`/api/crm/integrations/${integrationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-integrations'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-metrics'] });
      toast({ title: 'Success', description: 'Integration deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: 'Failed to delete integration', variant: 'destructive' });
    }
  });

  // Calculate real statistics from actual data
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);
  const activeIntegrations = crmIntegrations.filter((i: any) => i.isActive).length;
  const openTickets = supportTickets.filter((t: any) => t.status === 'open').length;

  // Real-time metrics only if integrations exist
  const hasActiveIntegrations = activeIntegrations > 0;
  const todaysMetrics = kpiMetrics.filter((m: any) => 
    new Date(m.timestamp).toDateString() === new Date().toDateString()
  );

  const callsToday = todaysMetrics.filter((m: any) => m.metricType === 'calls').length;
  const leadsToday = todaysMetrics.filter((m: any) => m.metricType === 'leads').length;
  const conversionsToday = todaysMetrics.filter((m: any) => m.metricType === 'conversions').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-sm text-gray-500">Victory Sync Services Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                CUSTOMER
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="kpis">Real-Time KPIs</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    ${totalSpent.toLocaleString()} total spent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeIntegrations}</div>
                  <p className="text-xs text-muted-foreground">
                    {crmIntegrations.length} total configured
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {hasActiveIntegrations ? 'Calls Today' : 'No Data'}
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {hasActiveIntegrations ? callsToday : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {hasActiveIntegrations ? `${leadsToday} leads generated` : 'Connect CRM to see data'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{openTickets}</div>
                  <p className="text-xs text-muted-foreground">
                    Support requests
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Integration Status Alert */}
            {!hasActiveIntegrations && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-8 w-8 text-amber-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-amber-900">No Active Integrations</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Connect your CRM or dialer to start seeing real-time KPIs and metrics. 
                        Only live data from your connected systems will be displayed.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('integrations')}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Setup Integration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <Phone className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Inbound Contact Center</h3>
                        <p className="text-sm text-gray-500">24/7 customer support services</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <Target className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Outbound Sales</h3>
                        <p className="text-sm text-gray-500">Lead generation and appointment setting</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <Zap className="h-8 w-8 text-purple-500" />
                      <div>
                        <h3 className="font-medium">AI Automation</h3>
                        <p className="text-sm text-gray-500">Intelligent chatbots and workflows</p>
                      </div>
                    </div>
                    <Badge variant={hasActiveIntegrations ? "default" : "secondary"}>
                      {hasActiveIntegrations ? "Active" : "Setup Required"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>CRM & Dialer Integrations</CardTitle>
                  <Dialog open={isIntegrationModalOpen} onOpenChange={setIsIntegrationModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Integration
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Integration</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="type">Integration Type</Label>
                          <Select value={newIntegration.type} onValueChange={(value) => 
                            setNewIntegration({...newIntegration, type: value})
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select integration type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hubspot">HubSpot CRM</SelectItem>
                              <SelectItem value="salesforce">Salesforce</SelectItem>
                              <SelectItem value="zoho">Zoho CRM</SelectItem>
                              <SelectItem value="twilio">Twilio</SelectItem>
                              <SelectItem value="aircall">Aircall</SelectItem>
                              <SelectItem value="justcall">JustCall</SelectItem>
                              <SelectItem value="five9">Five9</SelectItem>
                              <SelectItem value="dialpad">Dialpad</SelectItem>
                              <SelectItem value="ringcentral">RingCentral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="name">Integration Name</Label>
                          <Input
                            id="name"
                            value={newIntegration.name}
                            onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                            placeholder="My CRM Integration"
                          />
                        </div>
                        <div>
                          <Label htmlFor="apiKey">API Key / Access Token</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            value={newIntegration.apiKey}
                            onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
                            placeholder="Enter your API key or access token"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This will be stored securely and encrypted
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                          <Input
                            id="webhookUrl"
                            value={newIntegration.webhookUrl}
                            onChange={(e) => setNewIntegration({...newIntegration, webhookUrl: e.target.value})}
                            placeholder="https://your-webhook-url.com"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsIntegrationModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => createIntegrationMutation.mutate(newIntegration)}
                            disabled={!newIntegration.type || !newIntegration.name || !newIntegration.apiKey}
                          >
                            Create Integration
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {crmIntegrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations configured</h3>
                    <p className="text-gray-500 mb-4">
                      Connect your CRM or dialer to start seeing real-time data. Only live data from connected systems is displayed.
                    </p>
                    <Button onClick={() => setIsIntegrationModalOpen(true)}>
                      Add Your First Integration
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {crmIntegrations.map((integration: any) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            integration.isActive ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <Link className={`h-5 w-5 ${
                              integration.isActive ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                            {integration.lastSync && (
                              <p className="text-xs text-gray-400">
                                Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={integration.isActive ? 'default' : 'secondary'}>
                            {integration.isActive ? 'Connected' : 'Disconnected'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteIntegrationMutation.mutate(integration.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real-Time KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Real-Time KPIs</CardTitle>
                  <div className="flex items-center space-x-2">
                    {hasActiveIntegrations && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Activity className="h-3 w-3 mr-1" />
                        Live Data
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['kpi-metrics'] })}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!hasActiveIntegrations ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Real-Time Data Available</h3>
                    <p className="text-gray-500 mb-4">
                      Connect your CRM or dialer to see real-time KPIs and metrics. We only display live data from your integrated systems.
                    </p>
                    <Button onClick={() => setActiveTab('integrations')}>
                      Setup Integration
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Calls Today</p>
                            <p className="text-2xl font-bold text-blue-900">{callsToday}</p>
                          </div>
                          <Phone className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Leads Generated</p>
                            <p className="text-2xl font-bold text-green-900">{leadsToday}</p>
                          </div>
                          <Users className="h-8 w-8 text-green-600" />
                        </div>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Conversions</p>
                            <p className="text-2xl font-bold text-purple-900">{conversionsToday}</p>
                          </div>
                          <Target className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Recent Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {kpiMetrics.slice(0, 10).map((metric: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <Activity className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {metric.metricType} - {metric.value}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(metric.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {metric.source || 'CRM'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support & Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Quick Links</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Create Support Ticket
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Integration Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Recent Tickets</h3>
                    {supportTickets.length === 0 ? (
                      <p className="text-sm text-gray-500">No support tickets</p>
                    ) : (
                      <div className="space-y-2">
                        {supportTickets.slice(0, 3).map((ticket: any) => (
                          <div key={ticket.id} className="p-3 rounded-lg border">
                            <p className="text-sm font-medium">{ticket.title}</p>
                            <p className="text-xs text-gray-500">
                              {ticket.status} • {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
