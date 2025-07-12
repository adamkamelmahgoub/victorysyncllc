import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  MoreVertical, 
  Shield, 
  Eye, 
  Lock, 
  Unlock, 
  Trash2, 
  Plus, 
  Edit 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  privileges?: {
    subscriptionTier?: string;
    accountStatus?: string;
    priority?: string;
  };
}

interface Order {
  id: number;
  userId: string;
  status: string;
  total: string;
  createdAt: string;
}

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  features: string[];
}

export default function AdminPortal() {
  const [, setLocation] = useLocation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'admin123') {
      setLocation('/admin');
    }
  }, [setLocation]);

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-auth': 'admin123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/admin/orders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'x-admin-auth': 'admin123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  });

  // Fetch packages
  const { data: packages = [] } = useQuery({
    queryKey: ['/api/packages']
  });

  // Filter users based on tier
  const filteredUsers = users.filter((user: User) => {
    if (tierFilter === 'all') return true;
    return user.privileges?.subscriptionTier === tierFilter;
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await apiRequest({
        url: `/api/admin/users/${userId}/status`,
        method: 'PUT',
        body: { isActive: !currentStatus }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiRequest({
          url: `/api/admin/users/${userId}`,
          method: 'DELETE'
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const impersonateUser = (userId: number) => {
    console.log('Impersonating user:', userId);
    // Implement impersonation logic
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + parseFloat(order.total || '0'), 0);
  const activeUsers = users.filter((user: User) => user.isActive !== false).length;
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600">Manage users, orders, and system settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">{activeUsers} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Packages</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{packages.length}</div>
              <p className="text-xs text-muted-foreground">Available services</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={tierFilter} onValueChange={setTierFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        {filteredUsers.map((user: User) => (
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
                              {orders.filter((order: Order) => order.userId === user.id.toString()).length}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              ${orders.filter((order: Order) => order.userId === user.id.toString())
                                .reduce((sum: number, order: Order) => sum + parseFloat(order.total || '0'), 0)
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

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: Order) => (
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
                        <span className="font-semibold">${parseFloat(order.total || '0').toLocaleString()}</span>
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

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Package Management</CardTitle>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packages.map((pkg: Package) => (
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

          {/* Settings Tab */}
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
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>User Management: {selectedUser?.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Email</span>
                          <span className="font-semibold">{selectedUser.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className={getStatusColor(selectedUser.privileges?.accountStatus || 'active')}>
                            {selectedUser.privileges?.accountStatus || 'active'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tier</span>
                          <Badge className={getTierColor(selectedUser.privileges?.subscriptionTier || 'basic')}>
                            {selectedUser.privileges?.subscriptionTier || 'basic'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Joined</span>
                          <span className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Orders</span>
                          <span className="font-semibold">
                            {orders.filter((order: Order) => order.userId === selectedUser.id.toString()).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Spent</span>
                          <span className="font-semibold">
                            ${orders.filter((order: Order) => order.userId === selectedUser.id.toString())
                              .reduce((sum: number, order: Order) => sum + parseFloat(order.total || '0'), 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Eye,
  UserPlus,
  CreditCard,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  seats: number;
  lastLogin: string;
  totalSpent: number;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalCalls: number;
  avgSatisfaction: number;
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const queryClient = useQueryClient();

  // Authentication check
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'kimo8723' && credentials.password === 'Mshmsh7184365700!') {
      localStorage.setItem('adminToken', 'admin-authenticated');
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  // API calls with admin headers
  const adminRequest = async (method: string, url: string, data?: any) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-auth': 'admin123', // Simple admin auth
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  // Queries
  const { data: adminStats } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => adminRequest('GET', '/api/admin/stats'),
    enabled: isAuthenticated,
    initialData: {
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      monthlyGrowth: 0,
      totalCalls: 0,
      avgSatisfaction: 0
    }
  });

  const { data: users = [] } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: () => adminRequest('GET', '/api/admin/users'),
    enabled: isAuthenticated,
    initialData: []
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => adminRequest('GET', '/api/admin/health'),
    enabled: isAuthenticated,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: any }) =>
      adminRequest('PATCH', `/api/admin/users/${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => adminRequest('DELETE', `/api/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src="/LOGO_VS.png" alt="VictorySync" className="w-12 h-12 mx-auto mb-4" />
            <CardTitle className="text-2xl">VictorySync Admin</CardTitle>
            <p className="text-gray-600">Enter your admin credentials</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/LOGO_VS.png" alt="VictorySync" className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VictorySync Admin</h1>
                <p className="text-sm text-gray-600">System Administration Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Online
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Admin Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                  <p className="text-xs text-gray-600">+{adminStats.monthlyGrowth}% this month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats.activeUsers}</div>
                  <p className="text-xs text-gray-600">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${adminStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">Monthly recurring</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
                  <BarChart3 className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats.avgSatisfaction}%</div>
                  <p className="text-xs text-gray-600">Across all clients</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">Last login: {user.lastLogin}</p>
                        </div>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Connection</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Response Time</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Fast
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Integration Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        2 Warning
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Usage</span>
                      <span className="text-sm font-medium">67% of 1TB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage customer accounts and subscriptions</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">User</th>
                        <th className="text-left p-4 font-medium text-gray-900">Plan</th>
                        <th className="text-left p-4 font-medium text-gray-900">Status</th>
                        <th className="text-left p-4 font-medium text-gray-900">Seats</th>
                        <th className="text-left p-4 font-medium text-gray-900">Last Login</th>
                        <th className="text-left p-4 font-medium text-gray-900">Total Spent</th>
                        <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{user.plan}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 'secondary'}
                              className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">{user.seats}</td>
                          <td className="p-4 text-sm text-gray-600">{user.lastLogin}</td>
                          <td className="p-4 font-medium">${user.totalSpent.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="w-3 h-3" />
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Monthly Recurring Revenue</span>
                      <span className="font-bold text-lg">${adminStats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth Rate</span>
                      <span className="font-bold text-green-600">+{adminStats.monthlyGrowth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Revenue Per User</span>
                      <span className="font-bold">${Math.round(adminStats.totalRevenue / adminStats.totalUsers)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Calls This Month</span>
                      <span className="font-bold text-lg">{adminStats.totalCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Integrations</span>
                      <span className="font-bold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Satisfaction Score</span>
                      <span className="font-bold text-green-600">{adminStats.avgSatisfaction}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>CPU Usage</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[45%]" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Memory Usage</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full w-[67%]" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Storage Usage</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[34%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-green-600">[INFO] Database backup completed</div>
                    <div className="text-blue-600">[INFO] New user registration: john@example.com</div>
                    <div className="text-yellow-600">[WARN] High API usage detected</div>
                    <div className="text-green-600">[INFO] Integration sync successful</div>
                    <div className="text-red-600">[ERROR] Failed to send email notification</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Security Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Require 2FA for admin access</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-logout after inactivity</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Log all admin actions</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email alerts for new users</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS alerts for system issues</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly analytics reports</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>Save Settings</Button>
                  <Button variant="outline">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
