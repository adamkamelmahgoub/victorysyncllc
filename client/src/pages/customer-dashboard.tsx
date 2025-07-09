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
  TrendingDown,
  Phone,
  Users,
  Target,
  Zap,
  Link,
  Trash2,
  Eye,
  Activity,
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout, isCustomer, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [newIntegration, setNewIntegration] = useState({
    type: '',
    name: '',
    apiKey: '',
    webhookUrl: ''
  });
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Always declare all hooks at the top level
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    'Content-Type': 'application/json'
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/user/orders'],
    queryFn: async () => {
      const response = await fetch('/api/user/orders', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!isCustomer,
  });

  const { data: crmIntegrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ['/api/crm/integrations'],
    queryFn: async () => {
      const response = await fetch('/api/crm/integrations', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
    enabled: !!isCustomer,
  });

  const { data: supportTickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['/api/support/tickets'],
    queryFn: async () => {
      const response = await fetch('/api/support/tickets', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return response.json();
    },
    enabled: !!isCustomer,
  });

  const { data: kpiMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/kpi/metrics'],
    queryFn: async () => {
      const response = await fetch('/api/kpi/metrics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
    enabled: !!user && !isLoading,
  });

  // Check authentication
  useEffect(() => {
    if (!isLoading && (!user || !isCustomer)) {
      toast({
        title: "Access Required",
        description: "Please log in to access your dashboard.",
        variant: "destructive"
      });
      window.location.href = '/login?redirect=/dashboard';
      return;
    }
  }, [user, isCustomer, isLoading]);

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
            <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your customer dashboard.
            </p>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mutations
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: any) => {
      const response = await fetch('/api/crm/integrations', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(integration)
      });
      if (!response.ok) throw new Error('Failed to create integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/integrations'] });
      setIsIntegrationModalOpen(false);
      setNewIntegration({ type: '', name: '', apiKey: '', webhookUrl: '' });
      toast({ title: 'Success', description: 'Integration created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create integration', variant: 'destructive' });
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
      queryClient.invalidateQueries({ queryKey: ['/api/crm/integrations'] });
      toast({ title: 'Success', description: 'Integration deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete integration', variant: 'destructive' });
    }
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: any) => {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticket)
      });
      if (!response.ok) throw new Error('Failed to create ticket');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
      setIsTicketModalOpen(false);
      setNewTicket({ title: '', description: '', priority: 'medium' });
      toast({ title: 'Success', description: 'Support ticket created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create ticket', variant: 'destructive' });
    }
  });

  // Calculate KPIs from real data
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const activeIntegrations = crmIntegrations.filter((i: any) => i.isActive).length;
  const openTickets = supportTickets.filter((t: any) => t.status === 'open').length;

  // Real-time metrics from CRM integrations
  const callsToday = kpiMetrics.filter((m: any) => m.metricType === 'calls' && 
    new Date(m.timestamp).toDateString() === new Date().toDateString()).length;
  const leadsToday = kpiMetrics.filter((m: any) => m.metricType === 'leads' && 
    new Date(m.timestamp).toDateString() === new Date().toDateString()).length;
  const conversionsToday = kpiMetrics.filter((m: any) => m.metricType === 'conversions' && 
    new Date(m.timestamp).toDateString() === new Date().toDateString()).length;

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
                <p className="text-sm text-gray-500">Manage your Victory Sync services</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{callsToday}</div>
                  <p className="text-xs text-muted-foreground">
                    {leadsToday} leads generated
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
                    <Badge variant="secondary">
                      Setup Required
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
                    <DialogContent>
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
                              <SelectItem value="hubspot">HubSpot</SelectItem>
                              <SelectItem value="salesforce">Salesforce</SelectItem>
                              <SelectItem value="zoho">Zoho CRM</SelectItem>
                              <SelectItem value="twilio">Twilio</SelectItem>
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
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            value={newIntegration.apiKey}
                            onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
                            placeholder="Enter your API key"
                          />
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
                      Connect your CRM or dialer to start seeing real-time data
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

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Real-Time KPIs</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeIntegrations === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                    <p className="text-gray-500 mb-4">
                      Connect your CRM or dialer to see real-time KPIs and metrics
                    </p>
                    <Button onClick={() => setActiveTab('integrations')}>
                      Setup Integration
                    </Button>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">
                      Your order history will appear here once you make a purchase
                    </p>
                    <Button onClick={() => window.location.href = '/pricing'}>
                      View Pricing
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order: any) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>${parseFloat(order.total).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Support Tickets</CardTitle>
                  <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newTicket.title}
                            onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                            placeholder="Brief description of the issue"
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={newTicket.priority} onValueChange={(value) => 
                            setNewTicket({...newTicket, priority: value})
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <textarea
                            id="description"
                            className="w-full p-3 border rounded-md"
                            rows={4}
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                            placeholder="Please provide detailed information about your issue..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => createTicketMutation.mutate(newTicket)}
                            disabled={!newTicket.title || !newTicket.description}
                          >
                            Create Ticket
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {supportTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                    <p className="text-gray-500 mb-4">
                      Need help? Create a support ticket and our team will assist you
                    </p>
                    <Button onClick={() => setIsTicketModalOpen(true)}>
                      Create Support Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportTickets.map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            ticket.status === 'open' ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            <MessageSquare className={`h-5 w-5 ${
                              ticket.status === 'open' ? 'text-red-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium">{ticket.title}</h3>
                            <p className="text-sm text-gray-500">
                              Created {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}