
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
import { useToast } from '@/hooks/use-toast';

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

export default function AdminPortal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation('/login');
        return;
      }
      
      if (user?.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You need admin privileges to access this portal',
          variant: 'destructive'
        });
        setLocation('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, setLocation, toast]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      setCustomers([
        {
          id: '1',
          name: 'Acme Corp',
          email: 'admin@acme.com',
          plan: 'Professional',
          status: 'Active',
          billing: '$299/month',
          usage: 87.5,
          joinDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'TechStart Inc',
          email: 'contact@techstart.com',
          plan: 'Enterprise',
          status: 'Active',
          billing: '$599/month',
          usage: 92.3,
          joinDate: '2024-02-03'
        }
      ]);

      setAdmins([
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@victorysync.com',
          role: 'Super Admin',
          permissions: ['all'],
          createdAt: '2024-01-01',
          lastLogin: '2024-01-20'
        }
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Mock admin creation - replace with actual API call
      const newAdmin: AdminUser = {
        id: (admins.length + 1).toString(),
        name: 'New Admin',
        email: newAdminEmail,
        role: 'Admin',
        permissions: ['read', 'write'],
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };

      setAdmins([...admins, newAdmin]);
      setNewAdminEmail('');
      
      toast({
        title: 'Success',
        description: 'Admin user created successfully',
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to create admin user',
        variant: 'destructive'
      });
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8 bg-white/20" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-white/70">
              Manage users, integrations, and system settings
            </p>
          </div>
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/20"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{customers.length}</div>
              <p className="text-white/70 text-sm">Active subscriptions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">$12,847</div>
              <p className="text-white/70 text-sm">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Active Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">24</div>
              <p className="text-white/70 text-sm">Across all customers</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">99.9%</div>
              <p className="text-white/70 text-sm">Uptime this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="customers" className="text-white data-[state=active]:bg-white/20">
              Customer Management
            </TabsTrigger>
            <TabsTrigger value="admins" className="text-white data-[state=active]:bg-white/20">
              Admin Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Customer Management</CardTitle>
                <CardDescription className="text-white/70">
                  View and manage customer accounts and subscriptions
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
                        <th className="text-left p-3">Usage</th>
                        <th className="text-left p-3">Revenue</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-white/10">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-white/70 text-sm">{customer.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-white/30 text-white">
                              {customer.plan}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {customer.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="w-24 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-blue-400 h-2 rounded-full" 
                                style={{ width: `${customer.usage}%` }}
                              />
                            </div>
                            <div className="text-sm text-white/70 mt-1">{customer.usage}%</div>
                          </td>
                          <td className="p-3">{customer.billing}</td>
                          <td className="p-3">
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              Manage
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
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-b border-white/10">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-white/70 text-sm">{admin.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-white/30 text-white">
                              {admin.role}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {admin.permissions.map((perm) => (
                                <Badge key={perm} className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-white/70">{admin.lastLogin}</td>
                          <td className="p-3">
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
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

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-white/70">
                  Configure global system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Maintenance Mode</h4>
                      <p className="text-white/70 text-sm">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">New User Registration</h4>
                      <p className="text-white/70 text-sm">Allow new users to register accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-white/70 text-sm">Send system notifications via email</p>
                    </div>
                    <Switch defaultChecked />
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
