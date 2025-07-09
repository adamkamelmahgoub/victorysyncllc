
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const { user: authUser, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const [integrationData, setIntegrationData] = useState({
    type: 'crm',
    name: '',
    apiKey: '',
    webhookUrl: ''
  });

  // Fetch user's orders
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/user/orders'],
    queryFn: async () => {
      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!authUser
  });

  // Fetch user profile details
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) return authUser;
      return response.json();
    },
    enabled: !!authUser
  });

  // Fetch KPIs
  const { data: kpis = {} } = useQuery({
    queryKey: ['/api/user/kpis'],
    queryFn: async () => {
      const response = await fetch('/api/user/kpis', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) return {};
      return response.json();
    },
    enabled: !!authUser
  });

  // Fetch integrations
  const { data: integrations = [] } = useQuery({
    queryKey: ['/api/user/integrations'],
    queryFn: async () => {
      const response = await fetch('/api/user/integrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!authUser
  });

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (updates: { name: string; email: string }) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditingProfile(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Integration mutations
  const addIntegrationMutation = useMutation({
    mutationFn: async (integration: any) => {
      const response = await fetch('/api/user/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(integration)
      });
      if (!response.ok) throw new Error('Failed to add integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/integrations'] });
      toast({
        title: "Success",
        description: "Integration added successfully"
      });
      setIsAddingIntegration(false);
      setIntegrationData({ type: 'crm', name: '', apiKey: '', webhookUrl: '' });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add integration: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: async (integrationId: number) => {
      const response = await fetch(`/api/user/integrations/${integrationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/integrations'] });
      toast({
        title: "Success",
        description: "Integration deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete integration: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const user = userProfile || authUser || {
    name: 'Guest User',
    email: 'guest@example.com',
    plan: 'Basic',
    status: 'Active'
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleProfileEdit = () => {
    setProfileData({ name: user.name, email: user.email });
    setIsEditingProfile(true);
  };

  const handleProfileSave = () => {
    profileUpdateMutation.mutate(profileData);
  };

  const handleAddIntegration = () => {
    addIntegrationMutation.mutate(integrationData);
  };

  const handleDeleteIntegration = (integrationId: number) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      deleteIntegrationMutation.mutate(integrationId);
    }
  };

  if (!authUser) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.totalOrders || 0}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpis.orderTrend || '+0%'}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${(kpis.totalSpent || 0).toFixed(2)}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpis.spendingTrend || '+0%'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">${(kpis.avgOrderValue || 0).toFixed(2)}</p>
                  <p className="text-xs text-blue-600 flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {kpis.conversionRate || '0%'}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.satisfactionScore || 0}</p>
                  <p className="text-xs text-green-600">Out of 5.0</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <p className="text-sm text-gray-400">Your order history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Order {order.id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{order.packageName || 'Service Package'}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {order.status || 'pending'}
                          </Badge>
                          <span className="font-semibold">${parseFloat(order.total || 0).toFixed(2)}</span>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Account Information</CardTitle>
                  <Button onClick={handleProfileEdit} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan</label>
                  <p className="mt-1 text-sm text-gray-900">{user.plan || 'Basic'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>CRM & Dialer Integrations</CardTitle>
                  <Button onClick={() => setIsAddingIntegration(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {integrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No integrations configured</p>
                    <p className="text-sm text-gray-400">Connect your CRM or dialer to sync data</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {integration.type === 'crm' ? <Users className="w-4 h-4 text-blue-600" /> : <Phone className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div>
                            <p className="font-semibold">{integration.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{integration.type}</p>
                            {integration.lastSync && (
                              <p className="text-xs text-gray-500">Last sync: {new Date(integration.lastSync).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={integration.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {integration.status}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteIntegration(integration.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Plan: {user.plan || 'Basic'}</p>
                      <p className="text-sm text-gray-600">Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline">Manage Plan</Button>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>No payment method on file</span>
                      <Button size="sm" variant="outline">Add Payment Method</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contact Support</h4>
                    <p className="text-sm text-gray-600 mb-3">Get help with your account or services</p>
                    <Button className="w-full">Start Chat</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Documentation</h4>
                    <p className="text-sm text-gray-600 mb-3">Access guides and tutorials</p>
                    <Button variant="outline" className="w-full">View Docs</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Modal */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                <Button onClick={handleProfileSave}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Integration Modal */}
        <Dialog open={isAddingIntegration} onOpenChange={setIsAddingIntegration}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Integration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={integrationData.type} onValueChange={(value) => setIntegrationData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crm">CRM System</SelectItem>
                    <SelectItem value="dialer">Dialer/VoIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  placeholder="e.g., Salesforce, HubSpot"
                  value={integrationData.name}
                  onChange={(e) => setIntegrationData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={integrationData.apiKey}
                  onChange={(e) => setIntegrationData(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                <Input 
                  id="webhookUrl"
                  placeholder="https://your-system.com/webhook"
                  value={integrationData.webhookUrl}
                  onChange={(e) => setIntegrationData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingIntegration(false)}>Cancel</Button>
                <Button onClick={handleAddIntegration}>Add Integration</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
