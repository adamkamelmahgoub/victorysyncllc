
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Filter,
  Users,
  Shield,
  Key,
  CreditCard,
  Phone,
  Activity,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  UserCheck,
  UserX,
  Lock,
  Unlock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  orgId?: string;
  permissions: string[];
  featureFlags: string[];
  isLinkedToDialer: boolean;
  orderCount: number;
  totalSpent: number;
  lastLoginAt?: string;
  createdAt: string;
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

const AccessControlCenter = () => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const queryClient = useQueryClient();

  const adminToken = localStorage.getItem('admin_token') || 'admin123';
  const headers = { 'x-admin-auth': adminToken };

  // Fetch all users with details
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-access-control-users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/access/users', { headers });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    refetchInterval: 5000
  });

  // Fetch call metrics for selected user
  const { data: callMetrics } = useQuery({
    queryKey: ['user-call-metrics', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return null;
      const response = await fetch(`/api/admin/access/users/${selectedUser.id}/call-metrics`, { headers });
      if (!response.ok) throw new Error('Failed to fetch call metrics');
      return response.json();
    },
    enabled: !!selectedUser && activeTab === 'calls',
    refetchInterval: 10000
  });

  // Fetch audit logs for selected user
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['user-audit-logs', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const response = await fetch(`/api/admin/access/users/${selectedUser.id}/audit`, { headers });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
    enabled: !!selectedUser && activeTab === 'audit'
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      const response = await fetch(`/api/admin/access/users/${userId}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-control-users'] });
      toast({ title: 'User updated successfully' });
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: number[]; action: string; value?: any }) => {
      const response = await fetch('/api/admin/access/users/bulk', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, action, value })
      });
      if (!response.ok) throw new Error('Failed to perform bulk action');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-control-users'] });
      setSelectedUsers([]);
      toast({ title: 'Bulk action completed successfully' });
    }
  });

  const refreshCallMetricsMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/access/users/${userId}/call-metrics/refresh`, {
        method: 'POST',
        headers
      });
      if (!response.ok) throw new Error('Failed to refresh call metrics');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-call-metrics'] });
      toast({ title: 'Call metrics refreshed' });
    }
  });

  // Filter users based on search
  const filteredUsers = users.filter((user: UserDetail) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase()) ||
    user.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleUserSelect = (user: UserDetail) => {
    setSelectedUser(user);
    setIsUserDrawerOpen(true);
    setActiveTab('overview');
  };

  const handleBulkAction = () => {
    if (selectedUsers.length === 0 || !bulkAction) return;
    bulkUpdateMutation.mutate({ userIds: selectedUsers, action: bulkAction });
  };

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

      {/* User Directory */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                        checked={selectedUsers.length === filteredUsers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(filteredUsers.map((u: UserDetail) => u.id));
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
                  {filteredUsers.map((user: UserDetail) => (
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
                      <TableCell>{user.orderCount}</TableCell>
                      <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
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

      {/* User Detail Drawer */}
      <Dialog open={isUserDrawerOpen} onOpenChange={setIsUserDrawerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Manage user access, permissions, and settings
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Account Lock</Label>
                        <p className="text-sm text-gray-500">Lock account access</p>
                      </div>
                      <Switch checked={selectedUser.status === 'locked'} />
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
                                // Would update feature flag via API
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

              <TabsContent value="integrations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Allowed Payment Methods</Label>
                        <div className="flex gap-2 mt-2">
                          {['card', 'ach_debit', 'bank_transfer', 'wire', 'paypal'].map(method => (
                            <div key={method} className="flex items-center space-x-2">
                              <Checkbox />
                              <Label className="text-sm">{method}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>CRM Integration Scopes</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['read', 'write', 'sync', 'webhook'].map(scope => (
                            <div key={scope} className="flex items-center space-x-2">
                              <Checkbox />
                              <Label className="text-sm">crm:{scope}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Dialer Integration Scopes</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['read', 'dial', 'record', 'stats'].map(scope => (
                            <div key={scope} className="flex items-center space-x-2">
                              <Checkbox />
                              <Label className="text-sm">dialer:{scope}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                          {callMetrics.isStale && (
                            <p className="text-sm text-orange-600">Data is stale (last updated: {callMetrics.lastUpdated})</p>
                          )}
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
                      <CardTitle>Dialer Mapping</CardTitle>
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
                      {auditLogs.map((log: any, index: number) => (
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

export default AccessControlCenter;
