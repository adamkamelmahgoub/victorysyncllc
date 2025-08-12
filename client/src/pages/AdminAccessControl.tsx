import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Shield, 
  Key, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  UserX, 
  RefreshCw, 
  Eye, 
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Database,
  BarChart,
  LogOut,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  orgId?: string;
  createdAt: string;
  lastLoginAt?: string;
  orderCount: number;
  totalSpent: number;
  isMfaEnabled: boolean;
  permissions: string[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuditLog {
  id: number;
  actorUserId: number;
  targetUserId?: number;
  action: string;
  resourceType?: string;
  resourceId?: string;
  before?: any;
  after?: any;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

interface ApiKey {
  id: number;
  label: string;
  scopes: string[];
  lastUsedAt?: string;
  createdAt: string;
  revokedAt?: string;
}

const AVAILABLE_PERMISSIONS = [
  'users.read', 'users.write', 'users.delete',
  'roles.read', 'roles.write', 'roles.delete',
  'orders.read', 'orders.write', 'orders.delete',
  'admin.access', 'admin.super',
  'billing.read', 'billing.write',
  'analytics.read', 'analytics.write',
  'integrations.read', 'integrations.write',
  'api.read', 'api.write'
];

const USER_STATUSES = ['active', 'suspended', 'locked'];
const USER_ROLES = ['customer', 'agent', 'manager', 'admin', 'super_admin'];

export default function AdminAccessControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  // User management queries
  const { data: usersData, isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['/api/admin/users', page, searchTerm, statusFilter, roleFilter],
    queryFn: () => apiRequest(`/api/admin/users?page=${page}&search=${searchTerm}&status=${statusFilter}&role=${roleFilter}`) as Promise<{ users: User[], total: number }>,
  });

  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ['/api/admin/roles'],
    queryFn: () => apiRequest('/api/admin/roles') as Promise<Role[]>,
  });

  const { data: auditLogs, isLoading: loadingAuditLogs } = useQuery({
    queryKey: ['/api/admin/audit-logs', page],
    queryFn: () => apiRequest(`/api/admin/audit-logs?page=${page}&limit=50`) as Promise<{ logs: AuditLog[], total: number }>,
  });

  const { data: apiKeys, isLoading: loadingApiKeys } = useQuery({
    queryKey: ['/api/admin/api-keys'],
    queryFn: () => apiRequest('/api/admin/api-keys') as Promise<ApiKey[]>,
  });

  // Mutations
  const updateUserStatus = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: string }) =>
      fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user status", variant: "destructive" });
    },
  });

  const updateUserRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User role updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user role", variant: "destructive" });
    },
  });

  const updateUserPermissions = useMutation({
    mutationFn: ({ userId, permissions }: { userId: number; permissions: string[] }) =>
      fetch(`/api/admin/users/${userId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User permissions updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user permissions", variant: "destructive" });
    },
  });

  const lockUser = useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      fetch(`/api/admin/users/${userId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User account locked successfully" });
    },
    onError: () => {
      toast({ title: "Failed to lock user account", variant: "destructive" });
    },
  });

  const unlockUser = useMutation({
    mutationFn: (userId: number) =>
      fetch(`/api/admin/users/${userId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User account unlocked successfully" });
    },
    onError: () => {
      toast({ title: "Failed to unlock user account", variant: "destructive" });
    },
  });

  const forcePasswordReset = useMutation({
    mutationFn: (userId: number) =>
      fetch(`/api/admin/users/${userId}/force-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "Password reset forced successfully" });
    },
    onError: () => {
      toast({ title: "Failed to force password reset", variant: "destructive" });
    },
  });

  const requireMfa = useMutation({
    mutationFn: (userId: number) =>
      fetch(`/api/admin/users/${userId}/require-mfa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "MFA requirement set successfully" });
    },
    onError: () => {
      toast({ title: "Failed to require MFA", variant: "destructive" });
    },
  });

  const bulkUpdateUsers = useMutation({
    mutationFn: ({ userIds, updates }: { userIds: number[]; updates: any }) =>
      fetch('/api/admin/users/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, updates }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUsers([]);
      toast({ title: "Bulk update completed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to perform bulk update", variant: "destructive" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (userId: number) =>
      fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete user", variant: "destructive" });
    },
  });

  const createRole = useMutation({
    mutationFn: (role: { name: string; description?: string; permissions: string[] }) =>
      fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      toast({ title: "Role created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create role", variant: "destructive" });
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ roleId, updates }: { roleId: number; updates: any }) =>
      fetch(`/api/admin/roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      toast({ title: "Role updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update role", variant: "destructive" });
    },
  });

  const deleteRole = useMutation({
    mutationFn: (roleId: number) =>
      fetch(`/api/admin/roles/${roleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      toast({ title: "Role deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete role", variant: "destructive" });
    },
  });

  const createApiKey = useMutation({
    mutationFn: (apiKey: { label: string; scopes: string[]; userId?: number }) =>
      fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKey),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      toast({ title: "API key created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create API key", variant: "destructive" });
    },
  });

  const revokeApiKey = useMutation({
    mutationFn: (keyId: number) =>
      fetch(`/api/admin/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      toast({ title: "API key revoked successfully" });
    },
    onError: () => {
      toast({ title: "Failed to revoke API key", variant: "destructive" });
    },
  });

  const handleBulkAction = () => {
    if (selectedUsers.length === 0 || !bulkAction) return;

    const updates: any = {};
    switch (bulkAction) {
      case 'activate':
        updates.status = 'active';
        break;
      case 'suspend':
        updates.status = 'suspended';
        break;
      case 'lock':
        updates.status = 'locked';
        break;
      default:
        return;
    }

    bulkUpdateUsers.mutate({ userIds: selectedUsers, updates });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'suspended': return 'secondary';
      case 'locked': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'secondary';
      case 'manager': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-purple-900">Access Control Center</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetchUsers()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Roles</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>User Management</span>
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with specified role and permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter user name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {USER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-4 mb-4 p-4 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedUsers.length} user(s) selected
                  </span>
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Bulk action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activate">Activate</SelectItem>
                      <SelectItem value="suspend">Suspend</SelectItem>
                      <SelectItem value="lock">Lock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleBulkAction} disabled={!bulkAction}>
                    Apply
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedUsers([])}>
                    Clear Selection
                  </Button>
                </div>
              )}

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === usersData?.users?.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(usersData?.users?.map((u: User) => u.id) || []);
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
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingUsers ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : usersData?.users?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      usersData?.users?.map((user: User) => (
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
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-purple-600">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.orderCount}</TableCell>
                          <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                          <TableCell>
                            {user.lastLoginAt ? (
                              <span className="text-sm text-gray-500">
                                {new Date(user.lastLoginAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px]">
                                  <SheetHeader>
                                    <SheetTitle>User Details</SheetTitle>
                                    <SheetDescription>
                                      View and manage user information
                                    </SheetDescription>
                                  </SheetHeader>
                                  <div className="mt-6 space-y-6">
                                    <div className="space-y-2">
                                      <Label>Basic Information</Label>
                                      <div className="space-y-2">
                                        <Input value={user.name} readOnly />
                                        <Input value={user.email} readOnly />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Role</Label>
                                      <Select 
                                        value={user.role} 
                                        onValueChange={(role) => updateUserRole.mutate({ userId: user.id, role })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {USER_ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>
                                              {role.replace('_', ' ')}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select 
                                        value={user.status} 
                                        onValueChange={(status) => updateUserStatus.mutate({ userId: user.id, status })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {USER_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>
                                              {status}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Permissions</Label>
                                      <ScrollArea className="h-[200px] border rounded-md p-4">
                                        <div className="space-y-2">
                                          {AVAILABLE_PERMISSIONS.map((permission) => (
                                            <div key={permission} className="flex items-center space-x-2">
                                              <Checkbox
                                                id={permission}
                                                checked={user.permissions.includes(permission)}
                                                onCheckedChange={(checked) => {
                                                  const newPermissions = checked
                                                    ? [...user.permissions, permission]
                                                    : user.permissions.filter(p => p !== permission);
                                                  updateUserPermissions.mutate({ userId: user.id, permissions: newPermissions });
                                                }}
                                              />
                                              <Label htmlFor={permission} className="text-sm">
                                                {permission}
                                              </Label>
                                            </div>
                                          ))}
                                        </div>
                                      </ScrollArea>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                      <Label>Security Actions</Label>
                                      <div className="grid grid-cols-2 gap-2">
                                        {user.status === 'locked' ? (
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => unlockUser.mutate(user.id)}
                                          >
                                            <Unlock className="h-4 w-4 mr-2" />
                                            Unlock
                                          </Button>
                                        ) : (
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button variant="outline" size="sm">
                                                <Lock className="h-4 w-4 mr-2" />
                                                Lock
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>Lock User Account</DialogTitle>
                                                <DialogDescription>
                                                  Please provide a reason for locking this account.
                                                </DialogDescription>
                                              </DialogHeader>
                                              <Textarea 
                                                placeholder="Enter reason for locking account..."
                                                id="lockReason"
                                              />
                                              <DialogFooter>
                                                <Button 
                                                  onClick={() => {
                                                    const reason = (document.getElementById('lockReason') as HTMLTextAreaElement)?.value;
                                                    if (reason) {
                                                      lockUser.mutate({ userId: user.id, reason });
                                                    }
                                                  }}
                                                >
                                                  Lock Account
                                                </Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        )}
                                        
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => forcePasswordReset.mutate(user.id)}
                                        >
                                          <RefreshCw className="h-4 w-4 mr-2" />
                                          Reset Password
                                        </Button>
                                        
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => requireMfa.mutate(user.id)}
                                        >
                                          <Shield className="h-4 w-4 mr-2" />
                                          Require MFA
                                        </Button>
                                        
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                              <UserX className="h-4 w-4 mr-2" />
                                              Delete
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete
                                                the user account and remove all associated data.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction 
                                                onClick={() => deleteUser.mutate(user.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {usersData?.total > 50 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((page - 1) * 50) + 1} to {Math.min(page * 50, usersData?.total)} of {usersData?.total} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * 50 >= usersData?.total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Role Management</span>
                  </CardTitle>
                  <CardDescription>
                    Create and manage user roles and permissions
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new role with specific permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="roleName">Role Name</Label>
                          <Input id="roleName" placeholder="Enter role name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roleDescription">Description</Label>
                          <Input id="roleDescription" placeholder="Enter role description" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <ScrollArea className="h-[200px] border rounded-md p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_PERMISSIONS.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox id={`new-${permission}`} />
                                <Label htmlFor={`new-${permission}`} className="text-sm">
                                  {permission}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => {
                          const name = (document.getElementById('roleName') as HTMLInputElement)?.value;
                          const description = (document.getElementById('roleDescription') as HTMLInputElement)?.value;
                          const permissions: string[] = [];
                          AVAILABLE_PERMISSIONS.forEach(permission => {
                            const checkbox = document.getElementById(`new-${permission}`) as HTMLInputElement;
                            if (checkbox?.checked) {
                              permissions.push(permission);
                            }
                          });
                          
                          if (name) {
                            createRole.mutate({ name, description, permissions });
                          }
                        }}
                      >
                        Create Role
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loadingRoles ? (
                  <div className="text-center py-8">Loading roles...</div>
                ) : roles?.length === 0 ? (
                  <div className="text-center py-8">No roles found</div>
                ) : (
                  roles?.map((role: Role) => (
                    <Card key={role.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{role.name}</span>
                              {role.isSystem && (
                                <Badge variant="secondary">System</Badge>
                              )}
                            </CardTitle>
                            {role.description && (
                              <CardDescription>{role.description}</CardDescription>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Role: {role.name}</DialogTitle>
                                  <DialogDescription>
                                    Update role permissions and details.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`editName-${role.id}`}>Role Name</Label>
                                      <Input 
                                        id={`editName-${role.id}`} 
                                        defaultValue={role.name}
                                        disabled={role.isSystem}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`editDescription-${role.id}`}>Description</Label>
                                      <Input 
                                        id={`editDescription-${role.id}`} 
                                        defaultValue={role.description || ''}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Permissions</Label>
                                    <ScrollArea className="h-[200px] border rounded-md p-4">
                                      <div className="grid grid-cols-2 gap-2">
                                        {AVAILABLE_PERMISSIONS.map((permission) => (
                                          <div key={permission} className="flex items-center space-x-2">
                                            <Checkbox 
                                              id={`edit-${role.id}-${permission}`}
                                              defaultChecked={role.permissions.includes(permission)}
                                            />
                                            <Label htmlFor={`edit-${role.id}-${permission}`} className="text-sm">
                                              {permission}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    onClick={() => {
                                      const name = (document.getElementById(`editName-${role.id}`) as HTMLInputElement)?.value;
                                      const description = (document.getElementById(`editDescription-${role.id}`) as HTMLInputElement)?.value;
                                      const permissions: string[] = [];
                                      AVAILABLE_PERMISSIONS.forEach(permission => {
                                        const checkbox = document.getElementById(`edit-${role.id}-${permission}`) as HTMLInputElement;
                                        if (checkbox?.checked) {
                                          permissions.push(permission);
                                        }
                                      });
                                      
                                      updateRole.mutate({ 
                                        roleId: role.id, 
                                        updates: { name, description, permissions }
                                      });
                                    }}
                                  >
                                    Update Role
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            {!role.isSystem && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete
                                      the role and remove it from all users.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteRole.mutate(role.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Permissions:</Label>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Audit Logs</span>
              </CardTitle>
              <CardDescription>
                Track all administrative actions and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingAuditLogs ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading audit logs...
                        </TableCell>
                      </TableRow>
                    ) : auditLogs?.logs?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs?.logs?.map((log: AuditLog) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">User {log.actorUserId}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>
                            {log.targetUserId && (
                              <span className="text-sm">User {log.targetUserId}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {log.resourceType && (
                              <span className="text-sm">
                                {log.resourceType} {log.resourceId}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">{log.ip}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>API Key Management</span>
                  </CardTitle>
                  <CardDescription>
                    Create and manage API keys for system integration
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Generate a new API key with specific scopes and permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyLabel">Label</Label>
                        <Input id="keyLabel" placeholder="Enter API key label" />
                      </div>
                      <div className="space-y-2">
                        <Label>Scopes</Label>
                        <ScrollArea className="h-[150px] border rounded-md p-4">
                          <div className="space-y-2">
                            {['read', 'write', 'admin', 'users', 'orders', 'analytics'].map((scope) => (
                              <div key={scope} className="flex items-center space-x-2">
                                <Checkbox id={`scope-${scope}`} />
                                <Label htmlFor={`scope-${scope}`} className="text-sm">
                                  {scope}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => {
                          const label = (document.getElementById('keyLabel') as HTMLInputElement)?.value;
                          const scopes: string[] = [];
                          ['read', 'write', 'admin', 'users', 'orders', 'analytics'].forEach(scope => {
                            const checkbox = document.getElementById(`scope-${scope}`) as HTMLInputElement;
                            if (checkbox?.checked) {
                              scopes.push(scope);
                            }
                          });
                          
                          if (label) {
                            createApiKey.mutate({ label, scopes });
                          }
                        }}
                      >
                        Create API Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Label</TableHead>
                      <TableHead>Scopes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingApiKeys ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading API keys...
                        </TableCell>
                      </TableRow>
                    ) : apiKeys?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No API keys found
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiKeys?.map((key: ApiKey) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.label}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {key.scopes.map((scope) => (
                                <Badge key={scope} variant="outline" className="text-xs">
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              {new Date(key.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {key.lastUsedAt ? (
                              <span className="text-sm text-gray-500">
                                {new Date(key.lastUsedAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={key.revokedAt ? "destructive" : "default"}>
                              {key.revokedAt ? "Revoked" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {!key.revokedAt && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Revoke
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The API key will be permanently
                                      disabled and any applications using it will lose access.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => revokeApiKey.mutate(key.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Revoke
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}