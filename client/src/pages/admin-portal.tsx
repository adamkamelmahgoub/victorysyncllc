
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Download,
  Plus,
  Edit,
  Trash2,
  Shield,
  Globe,
  Mail,
  Bell,
  Eye,
  UserCheck,
  UserX,
  Search,
  Filter,

import AccessControlCenter from '@/admin/access-control/AccessControlCenter';

  ChevronDown,
  RefreshCw,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Target,
  Calendar,
  FileText,
  Database,
  Zap,
  Lock,
  Unlock,
  UserPlus,
  ShoppingCart,
  CreditCard,
  Home,
  LogOut
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  role: string;
  subscriptionTier: string;
  totalSpent: number;
  orderCount: number;
}

interface Order {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  total: string;
  status: string;

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

  createdAt: string;
  items: any[];
}

interface Package {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

const AdminPortal = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [packageSearch, setPackageSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [adminSettings, setAdminSettings] = useState({
    siteName: 'VictorySync',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    autoApproveOrders: true,
    maxUsersPerAccount: 50,
    defaultUserRole: 'user',
    sessionTimeout: 30,
    enableAnalytics: true,
    enableLogging: true,
    backupFrequency: 'daily',
    emailProvider: 'smtp',
    smtpSettings: {
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'tls'
    }
  });

  const queryClient = useQueryClient();

  // Check admin authentication
  const adminToken = localStorage.getItem('admin_token') || 'admin123';
  const adminHeaders = { 'x-admin-auth': adminToken };

  // Real-time refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: adminHeaders
      });
      if (!response.ok) {
        if (response.status === 403) {
          setLocation('/');
          throw new Error('Admin access required');
        }
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/orders', {
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      const response = await fetch('/api/admin/packages', {
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to fetch packages');
      return response.json();
    },
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', {
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 3000 // Refetch every 3 seconds for real-time stats
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsAddUserModalOpen(false);
      toast({ title: 'User created successfully' });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: any }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User updated successfully' });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User deleted successfully' });
    }
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: number[]; action: string; value?: any }) => {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, action, value })
      });
      if (!response.ok) throw new Error('Failed to perform bulk action');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUsers([]);
      toast({ title: 'Bulk action completed successfully' });
    }
  });

  const createPackageMutation = useMutation({
    mutationFn: async (packageData: any) => {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      });
      if (!response.ok) throw new Error('Failed to create package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      setIsAddPackageModalOpen(false);
      toast({ title: 'Package created successfully' });
    }
  });

  const updatePackageMutation = useMutation({
    mutationFn: async ({ packageId, data }: { packageId: number; data: any }) => {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'PUT',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      setEditingPackage(null);
      toast({ title: 'Package updated successfully' });
    }
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (packageId: number) => {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'DELETE',
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to delete package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      toast({ title: 'Package deleted successfully' });
    }
  });

  // Filter functions
  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((order: Order) =>
    order.userEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
    order.userName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    order.status.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredPackages = packages.filter((pkg: Package) =>
    pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
    pkg.description.toLowerCase().includes(packageSearch.toLowerCase())
  );

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedUsers.length === 0 || !bulkAction) return;
    
    bulkActionMutation.mutate({
      userIds: selectedUsers,
      action: bulkAction
    });
  };

  // Export functions
  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to export data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({ title: `${type} exported successfully` });
    } catch (error) {
      toast({ title: 'Export failed', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setLocation('/');
  };

  // Dashboard Stats
  const dashboardStats = analytics ? {
    totalUsers: analytics.totalUsers,
    activeUsers: analytics.activeUsers,
    totalOrders: analytics.totalOrders,
    totalRevenue: analytics.totalRevenue,
    avgOrderValue: analytics.avgOrderValue,
    conversionRate: analytics.conversionRate,
    monthlyGrowth: analytics.monthlyGrowth
  } : {
    totalUsers: users.length,
    activeUsers: users.filter((u: User) => u.isActive).length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum: number, order: Order) => sum + parseFloat(order.total), 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum: number, order: Order) => sum + parseFloat(order.total), 0) / orders.length : 0,
    conversionRate: users.length > 0 ? (orders.length / users.length) * 100 : 0,
    monthlyGrowth: { users: '+12%', revenue: '+8%', orders: '+15%' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">VictorySync Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.activeUsers} active users
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.monthlyGrowth.orders} from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.monthlyGrowth.revenue} from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />

          {/* Access Control Tab */}
          <TabsContent value="access-control" className="space-y-6">
            <AccessControlCenter />
          </TabsContent>

                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Avg order: ${dashboardStats.avgOrderValue.toFixed(0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order: Order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-sm text-gray-500">{order.userEmail}</p>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user: User) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('users')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsAddUserModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-80"
                      />
                    </div>
                    {selectedUsers.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Select value={bulkAction} onValueChange={setBulkAction}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Bulk action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activate">Activate</SelectItem>
                            <SelectItem value="deactivate">Deactivate</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={handleBulkAction}
                          disabled={!bulkAction}
                        >
                          Apply to {selectedUsers.length} users
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Users Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedUsers.length === filteredUsers.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers(filteredUsers.map((u: User) => u.id));
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user: User) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>{user.orderCount || 0}</TableCell>
                            <TableCell>${user.totalSpent?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingUser(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateUserMutation.mutate({
                                    userId: user.id,
                                    data: { isActive: !user.isActive }
                                  })}
                                >
                                  {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteUserMutation.mutate(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Management</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('orders')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-80"
                    />
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order: Order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.userName}</TableCell>
                            <TableCell>{order.userEmail}</TableCell>
                            <TableCell>${order.total}</TableCell>
                            <TableCell>
                              <Badge variant={
                                order.status === 'completed' ? 'default' :
                                order.status === 'pending' ? 'secondary' :
                                'destructive'
                              }>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Package Management</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setIsAddPackageModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search packages..."
                      value={packageSearch}
                      onChange={(e) => setPackageSearch(e.target.value)}
                      className="w-80"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map((pkg: Package) => (
                      <Card key={pkg.id} className="relative">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{pkg.name}</CardTitle>
                              <p className="text-2xl font-bold text-purple-600">${pkg.price}</p>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingPackage(pkg)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePackageMutation.mutate(pkg.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                          <div className="space-y-2">
                            {pkg.features.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-bold">{dashboardStats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-bold">{dashboardStats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-bold text-green-600">{dashboardStats.monthlyGrowth.users}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">${dashboardStats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value</span>
                      <span className="font-bold">${dashboardStats.avgOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-bold text-green-600">{dashboardStats.monthlyGrowth.revenue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-bold">{dashboardStats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-bold">{dashboardStats.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-bold text-green-600">{dashboardStats.monthlyGrowth.orders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Database</span>
                      </div>
                      <Badge variant="default">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>API Server</span>
                      </div>
                      <Badge variant="default">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Email Service</span>
                      </div>
                      <Badge variant="default">Online</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            createUserMutation.mutate({
              name: formData.get('name'),
              email: formData.get('email'),
              password: formData.get('password'),
              role: formData.get('role') || 'user',
              isActive: formData.get('isActive') === 'on'
            });
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select name="role">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" name="isActive" defaultChecked />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Package Modal */}
      <Dialog open={isAddPackageModalOpen} onOpenChange={setIsAddPackageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>Create a new service package</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const features = formData.get('features')?.toString().split('\n').filter(f => f.trim()) || [];
            
            createPackageMutation.mutate({
              name: formData.get('name'),
              price: formData.get('price'),
              description: formData.get('description'),
              features
            });
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea id="features" name="features" rows={5} required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddPackageModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Package</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              updateUserMutation.mutate({
                userId: editingUser.id,
                data: {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  role: formData.get('role'),
                  isActive: formData.get('isActive') === 'on'
                }
              });
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-user-name">Full Name</Label>
                  <Input id="edit-user-name" name="name" defaultValue={editingUser.name} required />
                </div>
                <div>
                  <Label htmlFor="edit-user-email">Email</Label>
                  <Input id="edit-user-email" name="email" type="email" defaultValue={editingUser.email} required />
                </div>
                <div>
                  <Label htmlFor="edit-user-role">Role</Label>
                  <Select name="role" defaultValue={editingUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-user-isActive" name="isActive" defaultChecked={editingUser.isActive} />
                  <Label htmlFor="edit-user-isActive">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update User</Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Package Modal */}
      <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update package information</DialogDescription>
          </DialogHeader>
          {editingPackage && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const features = formData.get('features')?.toString().split('\n').filter(f => f.trim()) || [];
              
              updatePackageMutation.mutate({
                packageId: editingPackage.id,
                data: {
                  name: formData.get('name'),
                  price: formData.get('price'),
                  description: formData.get('description'),
                  features
                }
              });
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Package Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingPackage.name} required />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={editingPackage.price} required />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input id="edit-description" name="description" defaultValue={editingPackage.description} required />
                </div>
                <div>
                  <Label htmlFor="edit-features">Features (one per line)</Label>
                  <Textarea id="edit-features" name="features" rows={5} defaultValue={editingPackage.features.join('\n')} required />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditingPackage(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Package</Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>System Settings</DialogTitle>
            <DialogDescription>Configure system-wide settings and preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">General Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" value={adminSettings.siteName} onChange={(e) => setAdminSettings({...adminSettings, siteName: e.target.value})} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenance"
                      checked={adminSettings.maintenanceMode}
                      onCheckedChange={(checked) => setAdminSettings({...adminSettings, maintenanceMode: checked})}
                    />
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="registration"
                      checked={adminSettings.registrationEnabled}
                      onCheckedChange={(checked) => setAdminSettings({...adminSettings, registrationEnabled: checked})}
                    />
                    <Label htmlFor="registration">Enable Registration</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Security Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number"
                      value={adminSettings.sessionTimeout}
                      onChange={(e) => setAdminSettings({...adminSettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUsers">Max Users Per Account</Label>
                    <Input 
                      id="maxUsers" 
                      type="number"
                      value={adminSettings.maxUsersPerAccount}
                      onChange={(e) => setAdminSettings({...adminSettings, maxUsersPerAccount: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Save settings logic here
                toast({ title: 'Settings saved successfully' });
                setIsSettingsModalOpen(false);
              }}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortal;
