
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { 
  Phone, 
  Clock, 
  Star, 
  Ticket, 
  ShoppingCart, 
  Users, 
  Settings, 
  CreditCard, 
  Zap, 
  TrendingUp,
  Download,
  Plus,
  ExternalLink,
  Plug,
  Activity,
  BarChart3
} from 'lucide-react';

interface DashboardMetrics {
  callsToday: number;
  avgResponseTime: number;
  csat: number;
  openTickets: number;
  totalOrders: number;
  activeUsers: number;
}

interface KpiData {
  date: string;
  calls: number;
  avgResponseSec: number;
  csat: number;
  ahtSec: number;
}

interface Integration {
  connected: boolean;
  lastSyncAt: string | null;
  authType: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  roles: { name: string; description: string }[];
  createdAt: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdByUser: { name: string };
  assignedToUser: { name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: number;
  externalId: string | null;
  amount: string;
  currency: string;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  source: string | null;
  createdAt: string;
}

interface BillingInfo {
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  recentInvoices: Array<{
    id: number;
    amount: string;
    status: string;
    hostedInvoiceUrl: string | null;
    createdAt: string;
  }>;
}

export default function CustomerDashboard() {
  const { user, hasPermission, requireAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [integrations, setIntegrations] = useState<Record<string, Integration>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  // New user invitation form
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    roleIds: [] as number[]
  });

  // Protect route
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Fetch data functions
  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/org/overview', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.ok) {
        setMetrics(data.data.metrics);
        setKpis(data.data.recentKpis);
      }
    } catch (error) {
      console.error('Failed to fetch overview:', error);
      toast({ title: 'Error', description: 'Failed to load dashboard', variant: 'destructive' });
    }
  };

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations/status', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.ok) {
        setIntegrations(data.data.integrations);
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/org/users', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.ok) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/org/tickets', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.ok) {
        setTickets(data.data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/org/orders', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.ok) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchBilling = async () => {
    try {
      const response = await fetch('/api/billing', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.ok) {
        setBilling(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch billing:', error);
    }
  };

  // Actions
  const createTicket = async () => {
    try {
      const response = await fetch('/api/org/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.ok) {
        toast({ title: 'Success', description: 'Ticket created successfully' });
        setNewTicket({ subject: '', description: '', priority: 'medium' });
        fetchTickets();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const openBillingPortal = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.ok) {
        window.open(data.data.url, '_blank');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const testIntegration = async (provider: string) => {
    try {
      const response = await fetch(`/api/integrations/${provider}/test`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.ok) {
        toast({ 
          title: 'Success', 
          description: `${provider} connection test ${data.data.connected ? 'passed' : 'failed'}`,
          variant: data.data.connected ? 'default' : 'destructive'
        });
        fetchIntegrations();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const syncIntegration = async (provider: string) => {
    try {
      const response = await fetch(`/api/integrations/${provider}/sync`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.ok) {
        toast({ title: 'Success', description: 'Sync triggered successfully' });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (!user?.orgId) return;

    setLoading(true);
    
    const loadData = async () => {
      switch (activeTab) {
        case 'overview':
          await fetchOverview();
          break;
        case 'integrations':
          await fetchIntegrations();
          break;
        case 'team':
          if (hasPermission('user:invite')) {
            await fetchUsers();
          }
          break;
        case 'tickets':
          if (hasPermission('ticket:view')) {
            await fetchTickets();
          }
          break;
        case 'orders':
          if (hasPermission('order:view')) {
            await fetchOrders();
          }
          break;
        case 'billing':
          if (hasPermission('billing:view')) {
            await fetchBilling();
          }
          break;
      }
      setLoading(false);
    };

    loadData();
  }, [activeTab, user?.orgId, hasPermission]);

  if (!user?.orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Organization</h2>
            <p className="text-gray-600">You need to belong to an organization to access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name} • {user?.organization?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="team" disabled={!hasPermission('user:invite')}>Team</TabsTrigger>
            <TabsTrigger value="tickets" disabled={!hasPermission('ticket:view')}>Tickets</TabsTrigger>
            <TabsTrigger value="billing" disabled={!hasPermission('billing:view')}>Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {metrics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Phone className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Calls Today</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.callsToday}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="text-green-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Response</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.avgResponseTime}s</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Star className="text-yellow-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CSAT Score</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.csat}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Ticket className="text-red-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Open Tickets</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.openTickets}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="text-purple-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Users className="text-indigo-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Active Users</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {kpis.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {kpis.map((kpi, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium">{new Date(kpi.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex space-x-6 text-sm">
                              <span>{kpi.calls} calls</span>
                              <span>{kpi.avgResponseSec}s avg response</span>
                              <span>{kpi.csat} CSAT</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="kpis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>KPI Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect an integration to view KPIs</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your CRM or call center system to start tracking detailed analytics and KPIs.
                  </p>
                  <Button onClick={() => setActiveTab('integrations')}>
                    <Plug className="w-4 h-4 mr-2" />
                    View Integrations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CRM Integrations */}
              <div className="col-span-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CRM Systems</h3>
              </div>
              
              {['hubspot', 'salesforce', 'zoho', 'pipedrive'].map((provider) => (
                <Card key={provider}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center justify-between">
                      <span>{provider}</span>
                      <Badge variant={integrations[provider]?.connected ? 'default' : 'outline'}>
                        {integrations[provider]?.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {integrations[provider]?.connected ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Last sync: {integrations[provider]?.lastSyncAt 
                            ? new Date(integrations[provider].lastSyncAt!).toLocaleString() 
                            : 'Never'}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => testIntegration(provider)}>
                            <Activity className="w-4 h-4 mr-2" />
                            Test
                          </Button>
                          <Button size="sm" onClick={() => syncIntegration(provider)}>
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Connect your {provider} account to sync customer data.</p>
                        <Button size="sm" className="w-full">
                          <Plug className="w-4 h-4 mr-2" />
                          Connect {provider}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Contact Center Integrations */}
              <div className="col-span-full mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Center</h3>
              </div>
              
              {['five9', 'ringcentral', 'twilio', 'aircall'].map((provider) => (
                <Card key={provider}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center justify-between">
                      <span>{provider.replace('five9', 'Five9').replace('ringcentral', 'RingCentral')}</span>
                      <Badge variant={integrations[provider]?.connected ? 'default' : 'outline'}>
                        {integrations[provider]?.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {integrations[provider]?.connected ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Last sync: {integrations[provider]?.lastSyncAt 
                            ? new Date(integrations[provider].lastSyncAt!).toLocaleString() 
                            : 'Never'}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => testIntegration(provider)}>
                            <Activity className="w-4 h-4 mr-2" />
                            Test
                          </Button>
                          <Button size="sm" onClick={() => syncIntegration(provider)}>
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Connect your {provider} system to sync call data.</p>
                        <Button size="sm" className="w-full">
                          <Plug className="w-4 h-4 mr-2" />
                          Connect {provider}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Support Systems */}
              <div className="col-span-full mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Systems</h3>
              </div>
              
              {['zendesk', 'freshdesk', 'intercom', 'helpscout'].map((provider) => (
                <Card key={provider}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center justify-between">
                      <span>{provider.replace('helpscout', 'Help Scout')}</span>
                      <Badge variant={integrations[provider]?.connected ? 'default' : 'outline'}>
                        {integrations[provider]?.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {integrations[provider]?.connected ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Last sync: {integrations[provider]?.lastSyncAt 
                            ? new Date(integrations[provider].lastSyncAt!).toLocaleString() 
                            : 'Never'}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => testIntegration(provider)}>
                            <Activity className="w-4 h-4 mr-2" />
                            Test
                          </Button>
                          <Button size="sm" onClick={() => syncIntegration(provider)}>
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Connect your {provider} account to sync support tickets.</p>
                        <Button size="sm" className="w-full">
                          <Plug className="w-4 h-4 mr-2" />
                          Connect {provider}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            {hasPermission('user:invite') ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newUserForm.name}
                            onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUserForm.email}
                            onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <Button onClick={() => {}} className="w-full">
                          Send Invitation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.roles.map(role => role.name).join(', ') || 'None'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLoginAt 
                              ? new Date(user.lastLoginAt).toLocaleDateString() 
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                  <p className="text-gray-600">You don't have permission to view team management.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            {hasPermission('ticket:view') ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
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
                          <Textarea
                            id="description"
                            value={newTicket.description}
                            onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                          />
                        </div>
                        <Button onClick={createTicket} className="w-full">
                          Create Ticket
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>
                            <Badge variant={ticket.status === 'open' ? 'destructive' : 'default'}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.priority === 'urgent' ? 'destructive' :
                              ticket.priority === 'high' ? 'secondary' : 'outline'
                            }>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{ticket.createdByUser.name}</TableCell>
                          <TableCell>{ticket.assignedToUser?.name || 'Unassigned'}</TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {tickets.length === 0 && (
                    <div className="text-center py-12">
                      <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                      <p className="text-gray-600">Create your first support ticket to get started.</p>
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                  <p className="text-gray-600">You don't have permission to view tickets.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            {hasPermission('billing:view') ? (
              <div className="space-y-6">
                {billing ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Current Subscription</span>
                          <Button onClick={openBillingPortal}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Manage Billing
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {billing.subscription ? (
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <Label>Plan</Label>
                              <p className="text-lg font-semibold capitalize">{billing.subscription.plan}</p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Badge variant={billing.subscription.status === 'active' ? 'default' : 'secondary'}>
                                {billing.subscription.status}
                              </Badge>
                            </div>
                            <div>
                              <Label>Next Billing</Label>
                              <p className="text-sm">{new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                            <p className="text-gray-600 mb-4">Subscribe to a plan to access all features.</p>
                            <Button>
                              Choose a Plan
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Invoices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Invoice</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {billing.recentInvoices.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>${invoice.amount}</TableCell>
                                <TableCell>
                                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {invoice.hostedInvoiceUrl && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                      </a>
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {billing.recentInvoices.length === 0 && (
                          <div className="text-center py-6">
                            <p className="text-gray-600">No invoices yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-gray-600">Loading billing information...</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                  <p className="text-gray-600">You don't have permission to view billing information.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
