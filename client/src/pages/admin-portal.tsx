
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
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UserPrivileges {
  canCreateOrders: boolean;
  canViewReports: boolean;
  canAccessPremiumFeatures: boolean;
  canModifyProfile: boolean;
  canDeleteAccount: boolean;
  maxOrderValue: number;
  allowedPackages: number[];
  customNotes: string;
  accountStatus: 'active' | 'suspended' | 'pending' | 'banned';
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState<UserPrivileges>({
    canCreateOrders: true,
    canViewReports: true,
    canAccessPremiumFeatures: false,
    canModifyProfile: true,
    canDeleteAccount: false,
    maxOrderValue: 10000,
    allowedPackages: [],
    customNotes: '',
    accountStatus: 'active'
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

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    // Load user privileges (in a real app, this would come from the backend)
    setUserPrivileges({
      canCreateOrders: user.privileges?.canCreateOrders ?? true,
      canViewReports: user.privileges?.canViewReports ?? true,
      canAccessPremiumFeatures: user.privileges?.canAccessPremiumFeatures ?? false,
      canModifyProfile: user.privileges?.canModifyProfile ?? true,
      canDeleteAccount: user.privileges?.canDeleteAccount ?? false,
      maxOrderValue: user.privileges?.maxOrderValue ?? 10000,
      allowedPackages: user.privileges?.allowedPackages ?? [],
      customNotes: user.privileges?.customNotes ?? '',
      accountStatus: user.privileges?.accountStatus ?? 'active'
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
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
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Joined</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user: any) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="p-2 font-medium" onClick={() => handleUserClick(user)}>
                              {user.name}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              {user.email}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <Badge className={user.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {user.isActive !== false ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserClick(user);
                                  }}
                                >
                                  <Shield className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={user.isActive !== false ? "destructive" : "default"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleUserStatus(user.id, user.isActive !== false);
                                  }}
                                >
                                  {user.isActive !== false ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteUser(user.id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
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

        {/* User Details Modal */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>User Management: {selectedUser?.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={selectedUser.name} readOnly />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedUser.email} readOnly />
                  </div>
                  <div>
                    <Label>User ID</Label>
                    <Input value={selectedUser.id} readOnly />
                  </div>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs defaultValue="privileges" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="privileges">Privileges</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="privileges" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={userPrivileges.canCreateOrders} 
                            onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canCreateOrders: checked})}
                          />
                          <Label>Can Create Orders</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={userPrivileges.canViewReports} 
                            onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewReports: checked})}
                          />
                          <Label>Can View Reports</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={userPrivileges.canAccessPremiumFeatures} 
                            onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canAccessPremiumFeatures: checked})}
                          />
                          <Label>Can Access Premium Features</Label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={userPrivileges.canModifyProfile} 
                            onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canModifyProfile: checked})}
                          />
                          <Label>Can Modify Profile</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={userPrivileges.canDeleteAccount} 
                            onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canDeleteAccount: checked})}
                          />
                          <Label>Can Delete Account</Label>
                        </div>
                        
                        <div>
                          <Label>Max Order Value ($)</Label>
                          <Input 
                            type="number" 
                            value={userPrivileges.maxOrderValue}
                            onChange={(e) => setUserPrivileges({...userPrivileges, maxOrderValue: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold">User Orders</h4>
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
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h5 className="font-semibold mb-2">Create New Order</h5>
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
                          <Button>Add Order</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <div>
                      <Label>Admin Notes</Label>
                      <Textarea 
                        value={userPrivileges.customNotes}
                        onChange={(e) => setUserPrivileges({...userPrivileges, customNotes: e.target.value})}
                        placeholder="Add custom notes about this user..."
                        rows={6}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveUserPrivileges} className="bg-victory-purple hover:bg-purple-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
