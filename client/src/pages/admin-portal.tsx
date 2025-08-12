
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  Copy,
  Mail,
  Building,
  CreditCard,
  Flag,
  History,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Zap,
  Target,
  TrendingDown,
  Users2,
  Server,
  Globe,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ORG_OWNER' | 'ORG_USER';
  status: 'active' | 'suspended' | 'locked';
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
  forcePasswordReset?: boolean;
  requireMfa?: boolean;
}

interface Organization {
  id: string;
  name: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  maxSeats: number;
  usedSeats: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  ownerEmail: string;
  billingStatus: 'active' | 'past_due' | 'canceled';
  mrr: number;
}

interface AccessCode {
  id: string;
  code: string;
  orgId?: string;
  used: boolean;
  usedBy?: string;
  expiresAt: string;
  createdAt: string;
}

interface AuditLog {
  id: number;
  actorUserId: number;
  actorEmail: string;
  targetUserId?: number;
  targetEmail?: string;
  action: string;
  entity: string;
  before?: any;
  after?: any;
  ip: string;
  userAgent?: string;
  createdAt: string;
}

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  environments: string[];
}

const AdminPortal = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [isAccessCodeDialogOpen, setIsAccessCodeDialogOpen] = useState(false);
  const [isFeatureFlagDialogOpen, setIsFeatureFlagDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('');

  const queryClient = useQueryClient();

  // Authentication
  const adminToken = localStorage.getItem('admin_token') || 'admin123';
  const adminHeaders = { 'x-admin-auth': adminToken };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orgs'] });
    }, 30000);
    return () => clearInterval(interval);
  }, [queryClient]);

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard', { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    refetchInterval: 30000
  });

  // Users data
  const { data: usersData = { users: [], total: 0 }, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', userSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      const response = await fetch(`/api/admin/users?${params}`, { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    refetchInterval: 30000
  });

  // Organizations data
  const { data: orgsData = { orgs: [], total: 0 }, isLoading: orgsLoading } = useQuery({
    queryKey: ['admin-orgs', orgSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (orgSearch) params.append('search', orgSearch);
      const response = await fetch(`/api/admin/organizations?${params}`, { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch organizations');
      return response.json();
    },
    refetchInterval: 30000
  });

  // Access codes data
  const { data: accessCodes = [] } = useQuery({
    queryKey: ['admin-access-codes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/access-codes', { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch access codes');
      return response.json();
    },
    refetchInterval: 30000
  });

  // Feature flags data
  const { data: featureFlags = [] } = useQuery({
    queryKey: ['admin-feature-flags'],
    queryFn: async () => {
      const response = await fetch('/api/admin/feature-flags', { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch feature flags');
      return response.json();
    }
  });

  // Audit logs data
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const response = await fetch('/api/admin/audit-logs', { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
    refetchInterval: 30000
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast({ title: 'User updated successfully', variant: 'default' });
    }
  });

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
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setIsCreateUserDialogOpen(false);
      toast({ title: 'User created successfully', variant: 'default' });
    }
  });

  const createOrgMutation = useMutation({
    mutationFn: async (orgData: any) => {
      const response = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(orgData)
      });
      if (!response.ok) throw new Error('Failed to create organization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orgs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setIsCreateOrgDialogOpen(false);
      toast({ title: 'Organization created successfully', variant: 'default' });
    }
  });

  const generateAccessCodeMutation = useMutation({
    mutationFn: async (orgId?: string) => {
      const response = await fetch('/api/admin/access-codes', {
        method: 'POST',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId })
      });
      if (!response.ok) throw new Error('Failed to generate access code');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-codes'] });
      setNewAccessCode(data.code);
      setIsAccessCodeDialogOpen(true);
      toast({ title: 'Access code generated successfully', variant: 'default' });
    }
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ userIds, action }: { userIds: number[]; action: string }) => {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { ...adminHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, action })
      });
      if (!response.ok) throw new Error('Failed to perform bulk action');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setSelectedUsers([]);
      toast({ title: 'Bulk action completed successfully', variant: 'default' });
    }
  });

  const exportDataMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await fetch(`/api/admin/export/${type}`, { headers: adminHeaders });
      if (!response.ok) throw new Error('Failed to export data');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({ title: 'Export completed successfully', variant: 'default' });
    }
  });

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'secondary',
      locked: 'destructive'
    };
    return <Badge variant={variants[status] as any} className="capitalize">{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      SUPER_ADMIN: 'bg-red-100 text-red-800 border-red-200',
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      ORG_OWNER: 'bg-blue-100 text-blue-800 border-blue-200',
      ORG_USER: 'bg-green-100 text-green-800 border-green-200'
    };
    return <Badge className={`${colors[role] || colors.ORG_USER} border`}>{role.replace('_', ' ')}</Badge>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', variant: 'default' });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setLocation('/');
  };

  const filteredUsers = usersData.users.filter((user: User) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrgs = orgsData.orgs.filter((org: Organization) =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
    org.ownerEmail.toLowerCase().includes(orgSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VictorySync Admin Portal</h1>
                <p className="text-sm text-gray-500">Super Admin Control Center</p>
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
          <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Users
            </TabsTrigger>
            <TabsTrigger value="organizations" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Organizations
            </TabsTrigger>
            <TabsTrigger value="access-codes" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Access Codes
            </TabsTrigger>
            <TabsTrigger value="feature-flags" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Feature Flags
            </TabsTrigger>
            <TabsTrigger value="audit-logs" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              System
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardData?.totalOrgs || orgsData.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData?.payingOrgs || 0} paying
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData?.activeAgents || filteredUsers.filter(u => u.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardData?.newAgentsToday || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    ${dashboardData?.mrr?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardData?.mrrGrowth || '0%'} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Usage</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData?.apiCalls?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    calls this month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Activity className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map((log: AuditLog, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{log.action}</p>
                          <p className="text-xs text-gray-500">
                            {log.actorEmail} → {log.targetEmail || log.entity}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>System Health</CardTitle>
                  <Server className="h-5 w-5 text-green-500" />
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
                        <span>API Gateway</span>
                      </div>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Authentication</span>
                      </div>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span>Billing System</span>
                      </div>
                      <Badge variant="secondary">Maintenance</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quick Actions</CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => exportDataMutation.mutate('users')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                  <Button size="sm" onClick={() => exportDataMutation.mutate('organizations')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Orgs
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => setIsCreateUserDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-users'] })}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 flex-1 max-w-md">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users by name, email, or role..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="flex-1"
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
                            <SelectItem value="lock">Lock Account</SelectItem>
                            <SelectItem value="unlock">Unlock Account</SelectItem>
                            <SelectItem value="force_password_reset">Force Password Reset</SelectItem>
                            <SelectItem value="enable_mfa">Enable MFA</SelectItem>
                            <SelectItem value="disable_mfa">Disable MFA</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={() => bulkActionMutation.mutate({ userIds: selectedUsers, action: bulkAction })} 
                          disabled={!bulkAction}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Apply to {selectedUsers.length} users
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Users Table */}
                  <div className="border rounded-lg bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
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
                          <TableHead>Organization</TableHead>
                          <TableHead>MFA</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user: User) => (
                          <TableRow key={user.id} className="hover:bg-gray-50">
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
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-medium text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">{user.orgId || 'No Organization'}</span>
                            </TableCell>
                            <TableCell>
                              {user.mfaEnabled ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
                              ) : (
                                <Badge variant="secondary">Disabled</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">
                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsUserDialogOpen(true);
                                  }}
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
                                {user.accountLocked ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateUserMutation.mutate({
                                      userId: user.id,
                                      updates: { accountLocked: false }
                                    })}
                                  >
                                    <Unlock className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateUserMutation.mutate({
                                      userId: user.id,
                                      updates: { accountLocked: true, lockReason: 'Admin locked' }
                                    })}
                                  >
                                    <Lock className="h-4 w-4" />
                                  </Button>
                                )}
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

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Organization Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => setIsCreateOrgDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Organization
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orgs'] })}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="flex items-center space-x-2 max-w-md">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search organizations..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                    />
                  </div>

                  {/* Organizations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrgs.map((org: Organization) => (
                      <Card key={org.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{org.name}</CardTitle>
                              <p className="text-sm text-gray-500">{org.ownerEmail}</p>
                            </div>
                            <Badge className={`capitalize ${
                              org.billingStatus === 'active' ? 'bg-green-100 text-green-800' :
                              org.billingStatus === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {org.billingStatus}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Subscription:</span>
                            <Badge className="capitalize">{org.subscriptionTier}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Seats:</span>
                            <span>{org.usedSeats}/{org.maxSeats}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>MRR:</span>
                            <span className="font-medium">${org.mrr}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Created:</span>
                            <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setSelectedOrg(org);
                                setIsOrgDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateAccessCodeMutation.mutate(org.id)}
                            >
                              <Key className="h-4 w-4 mr-1" />
                              Code
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Codes Tab */}
          <TabsContent value="access-codes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Access Code Management</CardTitle>
                  <Button size="sm" onClick={() => generateAccessCodeMutation.mutate()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Code
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Code</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Used By</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessCodes.map((code: AccessCode) => (
                        <TableRow key={code.id}>
                          <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{code.code}</code>
                          </TableCell>
                          <TableCell>{code.orgId || 'Any'}</TableCell>
                          <TableCell>
                            {code.used ? (
                              <Badge variant="secondary">Used</Badge>
                            ) : new Date(code.expiresAt) < new Date() ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : (
                              <Badge variant="default">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell>{code.usedBy || '-'}</TableCell>
                          <TableCell>{new Date(code.expiresAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(code.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(code.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Flags Tab */}
          <TabsContent value="feature-flags" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Feature Flag Management</CardTitle>
                  <Button size="sm" onClick={() => setIsFeatureFlagDialogOpen(true)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Add Flag
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureFlags.map((flag: FeatureFlag) => (
                    <Card key={flag.key} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{flag.name}</h3>
                            <Badge variant={flag.enabled ? "default" : "secondary"}>
                              {flag.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{flag.description}</p>
                          <p className="text-xs text-gray-500">
                            Rollout: {flag.rolloutPercentage}% | Environments: {flag.environments.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={flag.enabled} />
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit-logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log: AuditLog) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{log.actorEmail}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{log.targetEmail || log.entity}</TableCell>
                          <TableCell className="text-sm font-mono">{log.ip}</TableCell>
                          <TableCell>
                            {(log.before || log.after) && (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Application Version:</span>
                      <span className="font-mono">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache:</span>
                      <span className="text-green-600">Redis Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Background Jobs:</span>
                      <span className="text-green-600">Running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup:</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Run Database Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Manage user settings, permissions, and security
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={selectedUser.name} readOnly />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={selectedUser.email} readOnly />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="ORG_OWNER">Org Owner</SelectItem>
                      <SelectItem value="ORG_USER">Org User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Multi-Factor Authentication</Label>
                  <Switch checked={selectedUser.mfaEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Account Locked</Label>
                  <Switch checked={selectedUser.accountLocked} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Force Password Reset</Label>
                  <Switch checked={selectedUser.forcePasswordReset} />
                </div>
                <div>
                  <Label>Last Login</Label>
                  <Input 
                    value={selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never'} 
                    readOnly 
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Access Code Dialog */}
      <Dialog open={isAccessCodeDialogOpen} onOpenChange={setIsAccessCodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Code Generated</DialogTitle>
            <DialogDescription>
              Share this code with the organization owner to complete registration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <code className="text-lg font-mono font-bold">{newAccessCode}</code>
            </div>
            <p className="text-sm text-gray-600">
              This code expires in 24 hours and can only be used once.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAccessCodeDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => copyToClipboard(newAccessCode)} className="bg-purple-600 hover:bg-purple-700">
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortal;
