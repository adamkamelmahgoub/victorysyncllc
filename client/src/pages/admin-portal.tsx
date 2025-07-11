
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  billing: string;
  usage: number;
  joinDate: string;
}

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  customerId?: string;
}

const AdminPortal: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation('/login');
        return;
      }
      
      // Check if user has admin role
      checkAdminAccess();
    }
  }, [user, authLoading, setLocation]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/check-access', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          setLocation('/');
          return;
        }
        throw new Error('Failed to verify admin access');
      }
      
      // If access is verified, load admin data
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Access denied');
      setTimeout(() => setLocation('/'), 3000);
    }
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const [customersRes, adminUsersRes, togglesRes] = await Promise.all([
        fetch('/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/feature-toggles', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (!customersRes.ok || !adminUsersRes.ok || !togglesRes.ok) {
        throw new Error('Failed to load admin data');
      }

      const [customersData, adminUsersData, togglesData] = await Promise.all([
        customersRes.json(),
        adminUsersRes.json(),
        togglesRes.json()
      ]);

      setCustomers(customersData);
      setAdminUsers(adminUsersData);
      setFeatureToggles(togglesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: newAdminEmail, role: 'admin' })
      });

      if (!response.ok) {
        throw new Error('Failed to create admin user');
      }

      setNewAdminEmail('');
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin');
    }
  };

  const toggleFeature = async (toggleId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/feature-toggles/${toggleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ enabled })
      });

      if (!response.ok) {
        throw new Error('Failed to update feature toggle');
      }

      setFeatureToggles(prev => 
        prev.map(toggle => 
          toggle.id === toggleId ? { ...toggle, enabled } : toggle
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feature');
    }
  };

  const updateCustomerStatus = async (customerId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update customer status');
      }

      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId ? { ...customer, status } : customer
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Admin Portal</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardHeader>
                  <Skeleton className="h-6 w-40 bg-white/20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full bg-white/20" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-red-300 mb-4">{error}</p>
          <p className="text-gray-400">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <Badge variant="secondary" className="bg-red-500/20 text-red-300">
            Super Admin
          </Badge>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="customers" className="text-white data-[state=active]:bg-white/20">
              Customers
            </TabsTrigger>
            <TabsTrigger value="admins" className="text-white data-[state=active]:bg-white/20">
              Admin Users
            </TabsTrigger>
            <TabsTrigger value="features" className="text-white data-[state=active]:bg-white/20">
              Feature Toggles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Customer Management</CardTitle>
                <CardDescription className="text-white/70">
                  Manage all customer accounts, plans, and billing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Plan</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Billing</th>
                        <th className="text-left p-3">Usage</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-white/10">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-white/70">{customer.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-white/20 text-white">
                              {customer.plan}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={
                              customer.status === 'active' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-red-500/20 text-red-300'
                            }>
                              {customer.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={
                              customer.billing === 'current' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }>
                              {customer.billing}
                            </Badge>
                          </td>
                          <td className="p-3">{customer.usage}%</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={customer.status === 'active' ? 'destructive' : 'default'}
                                onClick={() => updateCustomerStatus(
                                  customer.id, 
                                  customer.status === 'active' ? 'suspended' : 'active'
                                )}
                              >
                                {customer.status === 'active' ? 'Suspend' : 'Activate'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Admin User Management</CardTitle>
                <CardDescription className="text-white/70">
                  Create and manage admin users with role-based permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter email address"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button onClick={createAdmin}>
                    Create Admin
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Permissions</th>
                        <th className="text-left p-3">Last Login</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((admin) => (
                        <tr key={admin.id} className="border-b border-white/10">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-sm text-white/70">{admin.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-white/20 text-white">
                              {admin.role}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {admin.permissions.slice(0, 3).map((permission) => (
                                <Badge key={permission} className="bg-purple-500/20 text-purple-300 text-xs">
                                  {permission}
                                </Badge>
                              ))}
                              {admin.permissions.length > 3 && (
                                <Badge className="bg-gray-500/20 text-gray-300 text-xs">
                                  +{admin.permissions.length - 3}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-white/70">
                            {new Date(admin.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Feature Toggles</CardTitle>
                <CardDescription className="text-white/70">
                  Control feature availability across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureToggles.map((toggle) => (
                    <div key={toggle.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{toggle.name}</h4>
                        <p className="text-white/70 text-sm">{toggle.description}</p>
                      </div>
                      <Switch
                        checked={toggle.enabled}
                        onCheckedChange={(checked) => toggleFeature(toggle.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
