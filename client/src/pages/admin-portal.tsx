
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users,
  Shield,
  Key,
  Settings,
  BarChart3,
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Activity,
  Lock,
  Unlock,
  UserPlus,
  Home,
  LogOut,
  Phone,
  CreditCard,
  Globe,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Calendar,
  FileText,
  Zap,
  Mail,
  Bell
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  accountLocked: boolean;
  lockReason?: string;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  orgId?: string;
  permissions: string[];
  featureFlags: string[];
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  isLinkedToDialer: boolean;
}

interface CallMetrics {
  callsToday: number;
  calls7d: number;
  calls30d: number;
  avgHandleTime: number;
  occupancy: number;
  liveStatus: string;
  isLinked: boolean;
  lastUpdated?: string;
  isStale?: boolean;
}

interface AuditLog {
  id: number;
  actorUserId: number;
  targetUserId?: number;
  action: string;
  before?: any;
  after?: any;
  ip: string;
  userAgent?: string;
  createdAt: string;
}

const AdminPortal = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [userDetailTab, setUserDetailTab] = useState('overview');
  const [bulkAction, setBulkAction] = useState('');

  const queryClient = useQueryClient();

  // Authentication
  const adminToken = localStorage.getItem('admin_token') || 'admin123';
  const adminHeaders = { 'x-admin-auth': adminToken };

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    }, 5000);
    return () => clearInterval(interval);
  }, [queryClient]);

  // Data fetching
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/access/users', { headers: adminHeaders });
      if (!response.ok) {
        if (response.status === 403) {
          setLocation('/');
          throw new Error('Admin access required');
        }
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data.users || [];
    },
    refetchInterval: 5000
  });

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 10000
  });

  // User details query
  const { data: userDetails } = useQuery({
    queryKey: ['user-details', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return null;
      const response = await fetch(`/api/admin/access/users/${selectedUser.id}`, { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch user details');
      return response.json();
    },
    enabled: !!selectedUser
  });

  // Call metrics query
  const { data: callMetrics } = useQuery({
    queryKey: ['user-call-metrics', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return null;
      const response = await fetch(`/api/admin/access/users/${selectedUser.id}/call-metrics`, { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch call metrics');
      return response.json();
    },
    enabled: !!selectedUser && userDetailTab === 'calls',
    refetchInterval: 10000
  });

  // Audit logs query
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['user-audit-logs', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const response = await fetch(`/api/admin/access/users/${selectedUser.id}/audit`, { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
    enabled: !!selectedUser && userDetailTab === 'audit'
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      const response = await fetch(`/api/admin/access/users/${userId}`, {
        method: 'PATCH',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-details'] });
      toast({ title: 'User updated successfully' });
    }
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: number[]; action: string; value?: any }) => {
      const response = await fetch('/api/admin/access/users/bulk', {
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

  const refreshCallMetricsMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/access/users/${userId}/call-metrics/refresh`, {
        method: 'POST',
        headers: adminHeaders
      });
      if (!response.ok) throw new Error('Failed to refresh call metrics');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-call-metrics'] });
      toast({ title: 'Call metrics refreshed' });
    }
  });

  // Filter users
  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.status.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsUserDrawerOpen(true);
    setUserDetailTab('overview');
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedUsers.length === 0 || !bulkAction) return;
    bulkActionMutation.mutate({ userIds: selectedUsers, action: bulkAction });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setLocation('/');
  };

  // Status and role badge helpers
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'default',
      suspended: 'secondary',
      locked: 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      superAdmin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      agent: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[role] || colors.customer}>{role}</Badge>;
  };

  // Permission and feature flag lists
  const permissionsList = [
    'users:read', 'users:write', 'orders:read', 'orders:write',
    'billing:read', 'billing:write', 'exports:run', 'reports:read',
    'apiKeys:read', 'apiKeys:write', 'integrations:connect',
    'integrations:sync', 'webhooks:read', 'webhooks:write',
    'coupons:write', 'support:impersonate'
  ];

  const featureFlagsList = [
    'dashboard', 'reports', 'exports', 'webhook_manage',
    'coupon_manage', 'api_access', 'integration_connect',
    'advanced_analytics', 'bulk_operations'
  ];

  // Dashboard stats
  const dashboardStats = analytics || {
    totalUsers: users.length,
    activeUsers: users.filter((u: User) => u.isActive).length,
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
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
                <h1 className="text-2xl font-bold text-gray-900">Access Control Center</h1>
                <p className="text-sm text-gray-500">VictorySync User Management & Security</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setLocation('/')}>
                <Home className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="security">Security & Audit</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
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
                    {dashboardStats.activeUsers} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    Last 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">
                    Across all users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">98.9%</div>
                  <p className="text-xs text-muted-foreground">
                    Uptime this month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Failed Login Attempts</p>
                        <p className="text-sm text-yellow-600">user@example.com</p>
                      </div>
                      <Badge variant="secondary">5 attempts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">Account Locked</p>
                        <p className="text-sm text-red-600">suspicious.user@example.com</p>
                      </div>
                      <Badge variant="destructive">Auto-locked</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Permission Updated</p>
                        <p className="text-sm text-green-600">manager@company.com</p>
                      </div>
                      <Badge variant="default">Admin action</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>New Registrations</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">+24</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Sessions</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">156</span>
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Permission Changes</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">8</span>
                        <Settings className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Directory</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-users'] })}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button size="sm">
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
                        className="w-96"
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
                            <SelectItem value="suspend">Suspend</SelectItem>
                            <SelectItem value="lock">Lock</SelectItem>
                            <SelectItem value="unlock">Unlock</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleBulkAction} disabled={!bulkAction}>
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
                              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers(filteredUsers.map((u: User) => u.id));
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Spent</TableHead>
                          <TableHead>Dialer</TableHead>
                          <TableHead>Last Login</TableHead>
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
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.orderCount || 0}</TableCell>
                            <TableCell>${user.totalSpent?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell>
                              {user.isLinkedToDialer ? (
                                <Badge variant="default">Linked</Badge>
                              ) : (
                                <Badge variant="secondary">Not Linked</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserSelect(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateUserMutation.mutate({
                                    userId: user.id,
                                    updates: { status: user.status === 'active' ? 'suspended' : 'active' }
                                  })}
                                >
                                  {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['superAdmin', 'admin', 'manager', 'agent', 'customer'].map(role => (
                      <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{role}</p>
                          <p className="text-sm text-gray-500">
                            {users.filter((u: User) => u.role === role).length} users
                          </p>
                        </div>
                        {getRoleBadge(role)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Permission Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {permissionsList.slice(0, 6).map(permission => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{permission}</span>
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs">Admin</Badge>
                          <Badge variant="outline" className="text-xs">Manager</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security & Audit Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enforce MFA for Admins</Label>
                        <p className="text-sm text-gray-500">Require multi-factor authentication</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-lock Failed Logins</Label>
                        <p className="text-sm text-gray-500">Lock after 5 failed attempts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Session Timeout</Label>
                        <p className="text-sm text-gray-500">Auto-logout inactive users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">User Role Changed</p>
                        <p className="text-sm text-gray-500">admin@company.com</p>
                      </div>
                      <span className="text-sm text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Permission Updated</p>
                        <p className="text-sm text-gray-500">user@example.com</p>
                      </div>
                      <span className="text-sm text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Account Locked</p>
                        <p className="text-sm text-gray-500">suspicious@email.com</p>
                      </div>
                      <span className="text-sm text-gray-500">12 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Health Tab */}
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
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Authentication Service</span>
                      </div>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span>Call Metrics Service</span>
                      </div>
                      <Badge variant="secondary">Degraded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="font-bold">245ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPU Usage</span>
                      <span className="font-bold">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage</span>
                      <span className="font-bold">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Connections</span>
                      <span className="font-bold">1,234</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Drawer */}
      <Dialog open={isUserDrawerOpen} onOpenChange={setIsUserDrawerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Manage user access, permissions, and security settings
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs value={userDetailTab} onValueChange={setUserDetailTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="calls">Call Metrics</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        {getStatusBadge(selectedUser.status)}
                      </div>
                      <div className="flex justify-between">
                        <span>Role:</span>
                        {getRoleBadge(selectedUser.role)}
                      </div>
                      <div className="flex justify-between">
                        <span>Organization:</span>
                        <span>{selectedUser.orgId || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span>{selectedUser.orderCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Spent:</span>
                        <span>${selectedUser.totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Login:</span>
                        <span>{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Account Status</span>
                        <Switch
                          checked={selectedUser.status === 'active'}
                          onCheckedChange={(checked) => updateUserMutation.mutate({
                            userId: selectedUser.id,
                            updates: { status: checked ? 'active' : 'suspended' }
                          })}
                        />
                      </div>
                      <Button variant="outline" className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Force Password Reset
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Require MFA Next Login
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Sign Out Everywhere
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enforce MFA</Label>
                        <p className="text-sm text-gray-500">Require multi-factor authentication</p>
                      </div>
                      <Switch checked={selectedUser.mfaEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Account Lock</Label>
                        <p className="text-sm text-gray-500">Lock account access</p>
                      </div>
                      <Switch checked={selectedUser.accountLocked} />
                    </div>
                    <div>
                      <Label>IP Allowlist</Label>
                      <Textarea placeholder="Enter IP addresses (one per line)" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role & Permissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Role</Label>
                        <Select
                          value={selectedUser.role}
                          onValueChange={(value) => updateUserMutation.mutate({
                            userId: selectedUser.id,
                            updates: { role: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superAdmin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                          {permissionsList.map(permission => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedUser.permissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                  const newPermissions = checked 
                                    ? [...selectedUser.permissions, permission]
                                    : selectedUser.permissions.filter(p => p !== permission);
                                  
                                  updateUserMutation.mutate({
                                    userId: selectedUser.id,
                                    updates: { permissions: newPermissions }
                                  });
                                }}
                              />
                              <Label className="text-sm">{permission}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {featureFlagsList.map(flag => (
                          <div key={flag} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedUser.featureFlags.includes(flag)}
                              onCheckedChange={(checked) => {
                                toast({ title: `Feature flag ${flag} ${checked ? 'enabled' : 'disabled'}` });
                              }}
                            />
                            <Label className="text-sm">{flag.replace('_', ' ')}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="calls" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Call Metrics</CardTitle>
                      <Button
                        size="sm"
                        onClick={() => refreshCallMetricsMutation.mutate(selectedUser.id)}
                        disabled={refreshCallMetricsMutation.isPending}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {callMetrics ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Calls Today:</span>
                            <span className="font-bold">{callMetrics.callsToday}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Calls (7d):</span>
                            <span className="font-bold">{callMetrics.calls7d}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Calls (30d):</span>
                            <span className="font-bold">{callMetrics.calls30d}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Handle Time:</span>
                            <span className="font-bold">{Math.floor(callMetrics.avgHandleTime / 60)}m {callMetrics.avgHandleTime % 60}s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Occupancy:</span>
                            <span className="font-bold">{callMetrics.occupancy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge variant={callMetrics.liveStatus === 'available' ? 'default' : 'secondary'}>
                              {callMetrics.liveStatus}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            {selectedUser.isLinkedToDialer ? 'Loading call metrics...' : 'User not linked to dialer system'}
                          </p>
                          {!selectedUser.isLinkedToDialer && (
                            <Button className="mt-4" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Link to Dialer
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dialer Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedUser.isLinkedToDialer ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span>Twilio</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Agent ID:</span>
                            <span className="font-mono text-sm">WK123456789</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Unlink Dialer
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <Label>Provider</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="five9">Five9</SelectItem>
                                <SelectItem value="ringcentral">RingCentral</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>External Agent ID</Label>
                            <Input placeholder="e.g., WK123456789" />
                          </div>
                          <Button size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Link Dialer
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {auditLogs.map((log: AuditLog, index: number) => (
                        <div key={index} className="border-b pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-gray-600">
                                by User #{log.actorUserId} from {log.ip}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {log.before && log.after && (
                            <div className="mt-2 text-xs">
                              <details>
                                <summary className="cursor-pointer text-gray-600">Show changes</summary>
                                <div className="mt-2 bg-gray-50 p-2 rounded">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong>Before:</strong>
                                      <pre>{JSON.stringify(log.before, null, 2)}</pre>
                                    </div>
                                    <div>
                                      <strong>After:</strong>
                                      <pre>{JSON.stringify(log.after, null, 2)}</pre>
                                    </div>
                                  </div>
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      ))}
                      {auditLogs.length === 0 && (
                        <p className="text-center text-gray-600 py-8">No audit logs found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortal;
