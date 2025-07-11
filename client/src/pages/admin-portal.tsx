import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  DollarSign,
  Phone,
  Mail,
  UserCheck,
  UserX,
  ShoppingCart,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  Calendar,
  Clock,
  Star,
  Zap,
  Database,
  Activity,
  TrendingUp,
  Download,
  Upload,
  Filter,
  Search,
  MoreVertical,
  FileText,
  Ban
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';

interface UserPrivileges {
  canCreateOrders: boolean;
  canViewReports: boolean;
  canAccessPremiumFeatures: boolean;
  canModifyProfile: boolean;
  canDeleteAccount: boolean;
  canViewBilling: boolean;
  canManageIntegrations: boolean;
  canExportData: boolean;
  canAccessAPI: boolean;
  canViewAnalytics: boolean;
  maxOrderValue: number;
  maxOrdersPerMonth: number;
  allowedPackages: number[];
  customNotes: string;
  accountStatus: 'active' | 'suspended' | 'pending' | 'banned' | 'trial';
  subscriptionTier: 'basic' | 'premium' | 'enterprise' | 'custom';
  apiRateLimit: number;
  dataRetentionDays: number;
  customFeatures: string[];
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  creditLimit: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastLogin: string;
  loginCount: number;
  supportTickets: number;
  integrations: number;
  apiCalls: number;
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [userPrivileges, setUserPrivileges] = useState<UserPrivileges>({
    canCreateOrders: true,
    canViewReports: true,
    canAccessPremiumFeatures: false,
    canModifyProfile: true,
    canDeleteAccount: false,
    canViewBilling: true,
    canManageIntegrations: true,
    canExportData: false,
    canAccessAPI: false,
    canViewAnalytics: true,
    maxOrderValue: 10000,
    maxOrdersPerMonth: 50,
    allowedPackages: [],
    customNotes: '',
    accountStatus: 'active',
    subscriptionTier: 'basic',
    apiRateLimit: 1000,
    dataRetentionDays: 365,
    customFeatures: [],
    billingCycle: 'monthly',
    creditLimit: 5000,
    priority: 'normal'
  });

  const [userActivity] = useState<UserActivity[]>([
    {
      id: '1',
      action: 'Login',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.1',
      userAgent: 'Chrome 120.0',
      status: 'success'
    },
    {
      id: '2',
      action: 'Created Order #12345',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ip: '192.168.1.1',
      userAgent: 'Chrome 120.0',
      status: 'success'
    },
    {
      id: '3',
      action: 'Failed login attempt',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ip: '192.168.1.100',
      userAgent: 'Safari 17.0',
      status: 'failed'
    }
  ]);

  const [userStats] = useState<UserStats>({
    totalOrders: 24,
    totalSpent: 15680,
    avgOrderValue: 653,
    lastLogin: new Date().toISOString(),
    loginCount: 147,
    supportTickets: 3,
    integrations: 5,
    apiCalls: 12450
  });

  const queryClient = useQueryClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'victorysync2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-auth': 'admin123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  }) as { data: any[], isLoading: boolean, refetch: () => void };

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'x-admin-auth': 'admin123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  }) as { data: any[], isLoading: boolean };

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["/api/admin/packages"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/packages', {
        headers: {
          'x-admin-auth': 'admin123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch packages');
      return response.json();
    }
  }) as { data: any[], isLoading: boolean };

  const updateUserPrivilegesMutation = useMutation({
    mutationFn: async ({ userId, privileges }: { userId: number; privileges: UserPrivileges }) => {
      const response = await fetch(`/api/admin/users/${userId}/privileges`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin123',
        },
        body: JSON.stringify({ privileges }),
      });
      if (!response.ok) throw new Error('Failed to update user privileges');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "User privileges updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user privileges",
        variant: "destructive",
      });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: number[], action: string, value?: any }) => {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin123',
        },
        body: JSON.stringify({ userIds, action, value }),
      });
      if (!response.ok) throw new Error('Failed to perform bulk action');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "Bulk action completed successfully",
      });
    },
  });

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin123'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update user status');

      toast({
        title: "User Updated",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      refetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-auth': 'admin123'
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');

      toast({
        title: "User Deleted",
        description: "User has been permanently deleted",
      });

      refetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const impersonateUser = async (userId: number) => {
    if (!confirm('Are you sure you want to impersonate this user? This will log you in as them.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: 'POST',
        headers: {
          'x-admin-auth': 'admin123'
        }
      });

      if (!response.ok) throw new Error('Failed to impersonate user');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/customer-dashboard';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to impersonate user",
        variant: "destructive",
      });
    }
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    // Load user privileges from the user object or set defaults
    const userPrivs = user.privileges || {};
    setUserPrivileges({
      canCreateOrders: userPrivs.canCreateOrders ?? true,
      canViewReports: userPrivs.canViewReports ?? true,
      canAccessPremiumFeatures: userPrivs.canAccessPremiumFeatures ?? false,
      canModifyProfile: userPrivs.canModifyProfile ?? true,
      canDeleteAccount: userPrivs.canDeleteAccount ?? false,
      canViewBilling: userPrivs.canViewBilling ?? true,
      canManageIntegrations: userPrivs.canManageIntegrations ?? true,
      canExportData: userPrivs.canExportData ?? false,
      canAccessAPI: userPrivs.canAccessAPI ?? false,
      canViewAnalytics: userPrivs.canViewAnalytics ?? true,
      maxOrderValue: userPrivs.maxOrderValue ?? 10000,
      maxOrdersPerMonth: userPrivs.maxOrdersPerMonth ?? 50,
      allowedPackages: userPrivs.allowedPackages ?? [],
      customNotes: userPrivs.customNotes ?? '',
      accountStatus: userPrivs.accountStatus ?? 'active',
      subscriptionTier: userPrivs.subscriptionTier ?? 'basic',
      apiRateLimit: userPrivs.apiRateLimit ?? 1000,
      dataRetentionDays: userPrivs.dataRetentionDays ?? 365,
      customFeatures: userPrivs.customFeatures ?? [],
      billingCycle: userPrivs.billingCycle ?? 'monthly',
      creditLimit: userPrivs.creditLimit ?? 5000,
      priority: userPrivs.priority ?? 'normal'
    });
    setIsUserDetailOpen(true);
  };

  const handleSaveUserPrivileges = () => {
    if (!selectedUser) return;

    updateUserPrivilegesMutation.mutate({
      userId: selectedUser.id,
      privileges: userPrivileges
    });

    setIsUserDetailOpen(false);
  };

  const createOrder = async () => {
    if (!selectedUser || !selectedPackage) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin123'
        },
        body: JSON.stringify({
          packageId: parseInt(selectedPackage),
          quantity: orderQuantity
        })
      });

      if (!response.ok) throw new Error('Failed to create order');

      toast({
        title: "Order Created",
        description: `Order created successfully for ${selectedUser.name}`,
      });

      setSelectedPackage('');
      setOrderQuantity(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive !== false) ||
                         (statusFilter === 'inactive' && user.isActive === false);
    const matchesTier = tierFilter === 'all' || 
                       (user.privileges?.subscriptionTier || 'basic') === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'trial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-victory-purple hover:bg-purple-700">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Logout
          </Button>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">+8% this month</p>
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
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-xs text-green-600">+15% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u: any) => u.isActive !== false).length}
                  </p>
                  <p className="text-xs text-blue-600">Online now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issues</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-red-600">Needs attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>User Management</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-victory-purple hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex space-x-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Tier</th>
                          <th className="text-left p-2">Orders</th>
                          <th className="text-left p-2">Spent</th>
                          <th className="text-left p-2">Last Login</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user: any) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <Badge className={user.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {user.isActive !== false ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <Badge className={getTierColor(user.privileges?.subscriptionTier || 'basic')}>
                                {user.privileges?.subscriptionTier || 'basic'}
                              </Badge>
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              {orders.filter((order: any) => order.userId === user.id.toString()).length}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              ${orders.filter((order: any) => order.userId === user.id.toString())
                                .reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0)
                                .toLocaleString()}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleUserClick(user)}>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Manage Privileges
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => impersonateUser(user.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Impersonate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                                    className={user.isActive !== false ? "text-yellow-600" : "text-green-600"}
                                  >
                                    {user.isActive !== false ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                    {user.isActive !== false ? "Suspend" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <span className="font-semibold">${parseFloat(order.total || 0).toLocaleString()}</span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Package Management</CardTitle>
                  <Button className="bg-victory-purple hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packages.map((pkg: any) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">${parseFloat(pkg.price).toLocaleString()}</span>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Revenue chart would go here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    User growth chart would go here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="VictorySync" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="info@victorysync.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+ (718)-813-2106" />
                  </div>
                  <Button className="bg-victory-purple hover:bg-purple-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced User Details Modal */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Complete User Management: {selectedUser?.name}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                {/* User Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="font-semibold">{selectedUser.name}</p>
                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                        <Badge className={`${getStatusColor(userPrivileges.accountStatus)} mt-2`}>
                          {userPrivileges.accountStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Orders</span>
                          <span className="font-semibold">{userStats.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Spent</span>
                          <span className="font-semibold">${userStats.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Order</span>
                          <span className="font-semibold">${userStats.avgOrderValue}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Login Count</span>
                          <span className="font-semibold">{userStats.loginCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Login</span>
                          <span className="font-semibold text-xs">{new Date(userStats.lastLogin).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Integrations</span>
                          <span className="font-semibold">{userStats.integrations}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Support Tickets</span>
                          <span className="font-semibold">{userStats.supportTickets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">API Calls</span>
                          <span className="font-semibold">{userStats.apiCalls.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Priority</span>
                          <Badge className={
                            userPrivileges.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            userPrivileges.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            userPrivileges.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {userPrivileges.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="privileges" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="privileges">Privileges</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="privileges" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Core Permissions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Can Create Orders</Label>
                            <Switch 
                              checked={userPrivileges.canCreateOrders} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canCreateOrders: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can View Reports</Label>
                            <Switch 
                              checked={userPrivileges.canViewReports} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewReports: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can Access Premium Features</Label>
                            <Switch 
                              checked={userPrivileges.canAccessPremiumFeatures} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canAccessPremiumFeatures: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can Modify Profile</Label>
                            <Switch 
                              checked={userPrivileges.canModifyProfile} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canModifyProfile: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can Delete Account</Label>
                            <Switch 
                              checked={userPrivileges.canDeleteAccount} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canDeleteAccount: checked})}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Advanced Permissions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Can View Billing</Label>
                            <Switch 
                              checked={userPrivileges.canViewBilling} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewBilling: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can Manage Integrations</Label>
                            <Switch 
                              checked={userPrivileges.canManageIntegrations} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canManageIntegrations: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can Export Data</Label>
                            <Switch 
                              checked={userPrivileges.canExportData} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canExportData: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can Access API</Label>
                            <Switch 
                              checked={userPrivileges.canAccessAPI} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canAccessAPI: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Can View Analytics</Label>
                            <Switch 
                              checked={userPrivileges.canViewAnalytics} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewAnalytics: checked})}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Max Order Value ($)</Label>
                        <Input 
                          type="number" 
                          value={userPrivileges.maxOrderValue}
                          onChange={(e) => setUserPrivileges({...userPrivileges, maxOrderValue: parseInt(e.target.value)})}
                        />
                      </div>

                      <div>
                        <Label>Max Orders Per Month</Label>
                        <Input 
                          type="number" 
                          value={userPrivileges.maxOrdersPerMonth}
                          onChange={(e) => setUserPrivileges({...userPrivileges, maxOrdersPerMonth: parseInt(e.target.value)})}
                        />
                      </div>

                      <div>
                        <Label>API Rate Limit (per hour)</Label>
                        <Input 
                          type="number" 
                          value={userPrivileges.apiRateLimit}
                          onChange={(e) => setUserPrivileges({...userPrivileges, apiRateLimit: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Account Status</Label>
                        <Select value={userPrivileges.accountStatus} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, accountStatus: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Priority Level</Label>
                        <Select value={userPrivileges.priority} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="subscription" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Subscription Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Subscription Tier</Label>
                            <Select value={userPrivileges.subscriptionTier} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, subscriptionTier: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Billing Cycle</Label>
                            <Select value={userPrivileges.billingCycle} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, billingCycle: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Credit Limit ($)</Label>
                            <Input 
                              type="number" 
                              value={userPrivileges.creditLimit}
                              onChange={(e) => setUserPrivileges({...userPrivileges, creditLimit: parseInt(e.target.value)})}
                            />
                          </div>

                          <div>
                            <Label>Data Retention (days)</Label>
                            <Input 
                              type="number" 
                              value={userPrivileges.dataRetentionDays}
                              onChange={(e) => setUserPrivileges({...userPrivileges, dataRetentionDays: parseInt(e.target.value)})}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Usage Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Storage Used</span>
                              <span className="font-semibold">2.3 GB / 10 GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }} />
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm">API Calls This Month</span>
                              <span className="font-semibold">1,247 / 10,000</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }} />
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm">Bandwidth Used</span>
                              <span className="font-semibold">45 GB / 100 GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">User Orders</h4>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {orders.filter((order: any) => order.userId === selectedUser.id.toString()).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {order.status}
                            </Badge>
                            <span className="font-semibold">${parseFloat(order.total || 0).toLocaleString()}</span>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <h5 className="font-semibold mb-3">Create New Order</h5>
                      <div className="flex space-x-2">
                        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Package" />
                          </SelectTrigger>
                          <SelectContent>
                            {packages.map((pkg: any) => (
                              <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                {pkg.name} - ${pkg.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                          className="w-20"
                        />
                        <Button onClick={createOrder} className="bg-victory-purple hover:bg-purple-700">
                          Create Order
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <h4 className="font-semibold">Recent Activity</h4>
                    <div className="space-y-3">
                      {userActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.status === 'success' ? 'bg-green-500' :
                              activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">IP: {activity.ip} • {activity.userAgent}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                            <Badge className={
                              activity.status === 'success' ? 'bg-green-100 text-green-800' :
                              activity.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }>
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Billing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Balance</span>
                            <span className="font-semibold">$247.50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Credit Limit</span>
                            <span className="font-semibold">${userPrivileges.creditLimit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Next Billing Date</span>
                            <span className="font-semibold">Dec 15, 2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Payment Method</span>
                            <span className="font-semibold">•••• 4242</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Nov 2024 Payment</p>
                                <p className="text-xs text-gray-500">Nov 15, 2024</p>
                              </div>
                              <span className="font-semibold">$299.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Oct 2024 Payment</p>
                                <p className="text-xs text-gray-500">Oct 15, 2024</p>
                              </div>
                              <span className="font-semibold">$299.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Sep 2024 Payment</p>
                                <p className="text-xs text-gray-500">Sep 15, 2024</p>
                              </div>
                              <span className="font-semibold">$299.00</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <div>
                      <Label>Admin Notes</Label>
                      <Textarea 
                        value={userPrivileges.customNotes}
                        onChange={(e) => setUserPrivileges({...userPrivileges, customNotes: e.target.value})}
                        placeholder="Add custom notes about this user..."
                        rows={8}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Internal Tags</Label>
                      <Input 
                        placeholder="VIP, High-Volume, Support-Priority, etc."
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => impersonateUser(selectedUser.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Impersonate User
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUserPrivileges} className="bg-victory-purple hover:bg-purple-700">
                        Save All Changes
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}