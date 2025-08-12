import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import {
  User,
  Package,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  DollarSign,
  Target,
  Users,
  Phone,
  Database,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Edit
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
}

interface Integration {
  id: number;
  type: string;
  name: string;
  isActive: boolean;
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const queryClient = useQueryClient();

  if (!user) {
    setLocation('/login');
    return null;
  }

  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // Real-time data fetching
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile', { headers });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    refetchInterval: 5000
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await fetch('/api/user/orders', { headers });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    refetchInterval: 3000
  });

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['user-kpis'],
    queryFn: async () => {
      const response = await fetch('/api/user/kpis', { headers });
      if (!response.ok) throw new Error('Failed to fetch KPIs');
      return response.json();
    },
    refetchInterval: 5000
  });

  const { data: integrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ['user-integrations'],
    queryFn: async () => {
      const response = await fetch('/api/user/integrations', { headers });
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
    refetchInterval: 5000
  });

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsEditingProfile(false);
      toast({ title: 'Profile updated successfully' });
    }
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (data: { type: string; name: string; apiKey: string; webhookUrl: string }) => {
      const response = await fetch('/api/user/integrations', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
      setIsAddingIntegration(false);
      toast({ title: 'Integration added successfully' });
    }
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/user/integrations/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error('Failed to delete integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
      toast({ title: 'Integration deleted successfully' });
    }
  });

  // Real-time auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-kpis'] });
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
    }, 10000);

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {kpis?.orderTrend || '+0%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${kpis?.totalSpent?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {kpis?.spendingTrend || '+0%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${kpis?.avgOrderValue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                Conversion rate: {kpis?.conversionRate || '0%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.satisfactionScore || '0.0'}/5</div>
              <p className="text-xs text-muted-foreground">
                Based on recent feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order: Order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total}</p>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No orders yet. <a href="/pricing" className="text-purple-600 hover:underline">Browse our services</a> to get started.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {integrations.length > 0 ? (
                    <div className="space-y-3">
                      {integrations.filter((int: Integration) => int.isActive).map((integration: Integration) => (
                        <div key={integration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Database className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{integration.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                            </div>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No active integrations. Set up integrations to sync data with your CRM and dialer systems.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Orders</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="border rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Order ID</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: Order) => (
                          <tr key={order.id} className="border-b">
                            <td className="p-3 font-medium">#{order.id}</td>
                            <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">${order.total}</td>
                            <td className="p-3">
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No orders yet. <a href="/pricing" className="text-purple-600 hover:underline">Browse our services</a> to get started.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>CRM & Dialer Integrations</CardTitle>
                  <Button size="sm" onClick={() => setIsAddingIntegration(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration: Integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{integration.type} Integration</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={integration.isActive ? 'default' : 'secondary'}>
                          {integration.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteIntegrationMutation.mutate(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {integrations.length === 0 && (
                    <p className="text-gray-600">No integrations configured. Add integrations to sync data with your CRM and dialer systems.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Orders</span>
                      <span className="font-bold">{kpis?.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Spent</span>
                      <span className="font-bold">${kpis?.totalSpent?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Order Value</span>
                      <span className="font-bold">${kpis?.avgOrderValue?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Satisfaction Score</span>
                      <span className="font-bold">{kpis?.satisfactionScore || '0.0'}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Order Growth</span>
                      <span className="font-bold text-green-600">{kpis?.orderTrend || '+0%'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Spending Growth</span>
                      <span className="font-bold text-green-600">{kpis?.spendingTrend || '+0%'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-bold">{kpis?.conversionRate || '0%'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Order</span>
                      <span className="font-bold">
                        {kpis?.lastOrderDate ? new Date(kpis.lastOrderDate).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{profile?.name || user.name}</h3>
                      <p className="text-gray-600">{profile?.email || user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={profile?.name || user.name} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={profile?.email || user.email} disabled />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input value={profile?.role || 'Customer'} disabled />
                    </div>
                    <div>
                      <Label>Member Since</Label>
                      <Input value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'} disabled />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            updateProfileMutation.mutate({
              name: formData.get('name') as string,
              email: formData.get('email') as string
            });
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" name="name" defaultValue={profile?.name || user.name} required />
              </div>
              <div>
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" name="email" type="email" defaultValue={profile?.email || user.email} required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Integration Modal */}
      <Dialog open={isAddingIntegration} onOpenChange={setIsAddingIntegration}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Integration</DialogTitle>
            <DialogDescription>Connect your CRM or dialer system</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            createIntegrationMutation.mutate({
              type: formData.get('type') as string,
              name: formData.get('name') as string,
              apiKey: formData.get('apiKey') as string,
              webhookUrl: formData.get('webhookUrl') as string
            });
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="integration-type">Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select integration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crm">CRM System</SelectItem>
                    <SelectItem value="dialer">Dialer System</SelectItem>
                    <SelectItem value="email">Email Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="integration-name">Name</Label>
                <Input id="integration-name" name="name" placeholder="e.g., Salesforce, HubSpot" required />
              </div>
              <div>
                <Label htmlFor="integration-apiKey">API Key</Label>
                <Input id="integration-apiKey" name="apiKey" type="password" placeholder="Enter your API key" required />
              </div>
              <div>
                <Label htmlFor="integration-webhookUrl">Webhook URL (Optional)</Label>
                <Input id="integration-webhookUrl" name="webhookUrl" placeholder="https://your-webhook-url.com" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingIntegration(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Integration</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}