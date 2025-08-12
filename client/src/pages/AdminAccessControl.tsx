
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  Key, 
  CreditCard, 
  Phone, 
  Flag,
  Settings,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  Plus,
  X,
  Check,
  AlertTriangle,
  Activity,
  Calendar,
  Globe,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  accountLocked: boolean;
  lockReason?: string;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  sessionCount: number;
  orgId?: string;
  orderCount: number;
  totalSpent: number;
  permissions: string[];
  createdAt: string;
}

interface UserDetail extends User {
  sessions: any[];
  integrations: any[];
  apiKeys: any[];
  callMetrics: any[];
  paymentPolicy: any;
  auditLogs: any[];
}

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

const paymentMethods = [
  'card', 'ach_debit', 'bank_transfer', 'wire', 'paypal'
];

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response.json();
}

export default function AdminAccessControl() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [showNewRole, setShowNewRole] = useState(false);

  const queryClient = useQueryClient();

  // Fetch users with pagination and filters
  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-access-users', page, searchTerm, selectedRole, selectedStatus],
    queryFn: () => apiRequest<{ users: User[]; total: number; page: number; limit: number }>(`/api/admin/access/users?page=${page}&limit=50&search=${searchTerm}&role=${selectedRole}&status=${selectedStatus}`)
  });

  // Fetch user details
  const { data: userDetail } = useQuery({
    queryKey: ['admin-access-user-detail', selectedUser],
    queryFn: () => apiRequest<UserDetail>(`/api/admin/access/users/${selectedUser}`),
    enabled: !!selectedUser
  });

  // Fetch roles
  const { data: roles } = useQuery({
    queryKey: ['admin-access-roles'],
    queryFn: () => apiRequest<any[]>('/api/admin/access/roles')
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, isActive, lockReason }: { userId: number; isActive: boolean; lockReason?: string }) =>
      apiRequest(`/api/admin/access/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive, lockReason })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-access-user-detail'] });
      toast({ title: 'User status updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update user status', variant: 'destructive' });
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      apiRequest(`/api/admin/access/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-access-user-detail'] });
      toast({ title: 'User role updated successfully' });
    }
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ userId, permissions }: { userId: number; permissions: string[] }) =>
      apiRequest(`/api/admin/access/users/${userId}/permissions`, {
        method: 'PATCH',
        body: JSON.stringify({ permissions })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-user-detail'] });
      toast({ title: 'Permissions updated successfully' });
    }
  });

  const updateFeatureFlagsMutation = useMutation({
    mutationFn: ({ userId, flags }: { userId: number; flags: Record<string, boolean> }) =>
      apiRequest(`/api/admin/access/users/${userId}/feature-flags`, {
        method: 'PATCH',
        body: JSON.stringify({ flags })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-user-detail'] });
      toast({ title: 'Feature flags updated successfully' });
    }
  });

  const revokeSessionsMutation = useMutation({
    mutationFn: (userId: number) =>
      apiRequest(`/api/admin/access/users/${userId}/sessions/revoke-all`, {
        method: 'POST'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-user-detail'] });
      toast({ title: 'All sessions revoked successfully' });
    }
  });

  const updatePaymentPolicyMutation = useMutation({
    mutationFn: ({ userId, allowedMethods }: { userId: number; allowedMethods: string[] }) =>
      apiRequest(`/api/admin/access/users/${userId}/payment-policy`, {
        method: 'PATCH',
        body: JSON.stringify({ allowedMethods })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-user-detail'] });
      toast({ title: 'Payment policy updated successfully' });
    }
  });

  const getStatusBadge = (user: User) => {
    if (user.accountLocked) {
      return <Badge variant="destructive" className="gap-1"><Lock className="h-3 w-3" />Locked</Badge>;
    }
    if (!user.isActive) {
      return <Badge variant="secondary" className="gap-1"><X className="h-3 w-3" />Suspended</Badge>;
    }
    return <Badge variant="default" className="gap-1"><Check className="h-3 w-3" />Active</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      superAdmin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      agent: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[role as keyof typeof colors] || colors.customer}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Access Control Center</h1>
          <p className="text-gray-600">Manage users, permissions, and access controls</p>
        </div>
        <Button onClick={() => refetchUsers()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="superAdmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Directory ({usersData?.total || 0} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.orgId || 'Default'}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>{user.orderCount}</TableCell>
                  <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowUserDetail(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Detail Sheet */}
      <Sheet open={showUserDetail} onOpenChange={setShowUserDetail}>
        <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Access Control
            </SheetTitle>
          </SheetHeader>

          {userDetail && (
            <div className="mt-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{userDetail.name}</h2>
                <p className="text-gray-600">{userDetail.email}</p>
                <div className="flex gap-2 mt-2">
                  {getStatusBadge(userDetail)}
                  {getRoleBadge(userDetail.role)}
                  {userDetail.mfaEnabled && <Badge variant="outline">MFA Enabled</Badge>}
                </div>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                  <TabsTrigger value="audit">Audit</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant={userDetail.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({
                            userId: userDetail.id,
                            isActive: !userDetail.isActive
                          })}
                        >
                          {userDetail.isActive ? <Lock className="h-4 w-4 mr-1" /> : <Unlock className="h-4 w-4 mr-1" />}
                          {userDetail.isActive ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeSessionsMutation.mutate(userDetail.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Revoke Sessions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Sessions</Label>
                          <p className="text-2xl font-semibold">{userDetail.sessions.length}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">API Keys</Label>
                          <p className="text-2xl font-semibold">{userDetail.apiKeys.length}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Integrations</Label>
                          <p className="text-2xl font-semibold">{userDetail.integrations.length}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Orders</Label>
                          <p className="text-2xl font-semibold">{userDetail.orderCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>MFA Required</Label>
                          <p className="text-sm text-gray-500">Force user to setup MFA on next login</p>
                        </div>
                        <Switch checked={userDetail.mfaEnabled} />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Lock Account</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Lock reason..." className="flex-1" />
                          <Button variant="destructive" size="sm">
                            <Lock className="h-4 w-4 mr-1" />
                            Lock
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Assignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={userDetail.role}
                        onValueChange={(role) => updateRoleMutation.mutate({ userId: userDetail.id, role })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="superAdmin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Permissions Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {permissionsList.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              checked={userDetail.permissions.includes(permission)}
                              onCheckedChange={(checked) => {
                                const newPermissions = checked
                                  ? [...userDetail.permissions, permission]
                                  : userDetail.permissions.filter(p => p !== permission);
                                updatePermissionsMutation.mutate({
                                  userId: userDetail.id,
                                  permissions: newPermissions
                                });
                              }}
                            />
                            <Label className="text-sm">{permission}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {featureFlagsList.map((flag) => (
                          <div key={flag} className="flex items-center space-x-2">
                            <Checkbox
                              defaultChecked={false}
                              onCheckedChange={(checked) => {
                                updateFeatureFlagsMutation.mutate({
                                  userId: userDetail.id,
                                  flags: { [flag]: Boolean(checked) }
                                });
                              }}
                            />
                            <Label className="text-sm">{flag}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connected Integrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userDetail.integrations.length === 0 ? (
                        <p className="text-gray-500">No integrations connected</p>
                      ) : (
                        <div className="space-y-2">
                          {userDetail.integrations.map((integration, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium">{integration.provider}</p>
                                <p className="text-sm text-gray-500">Status: {integration.status}</p>
                              </div>
                              <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                                {integration.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="api-keys" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        API Keys
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          New Key
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userDetail.apiKeys.length === 0 ? (
                        <p className="text-gray-500">No API keys created</p>
                      ) : (
                        <div className="space-y-2">
                          {userDetail.apiKeys.map((key, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium">{key.label}</p>
                                <p className="text-sm text-gray-500">
                                  Created: {new Date(key.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="destructive" size="sm">
                                Revoke
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audit" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userDetail.auditLogs.length === 0 ? (
                        <p className="text-gray-500">No audit logs</p>
                      ) : (
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-2">
                            {userDetail.auditLogs.map((log, index) => (
                              <div key={index} className="p-2 border rounded">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{log.action}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(log.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600">
                                  IP: {log.ip || 'Unknown'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
