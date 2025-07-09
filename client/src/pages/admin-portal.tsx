
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, ShoppingCart, MessageSquare, Settings, BarChart3, LogOut, Plus } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

export default function AdminPortal() {
  const { admin, logout, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    name: '',
    password: '',
    role: 'admin'
  });

  // All queries - always declared but conditionally enabled
  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: !!isAdmin
  });

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!isAdmin
  });

  const contactsQuery = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
    enabled: !!isAdmin
  });

  const integrationsQuery = useQuery({
    queryKey: ['admin', 'integrations'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/integrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
    enabled: !!isAdmin
  });

  const ticketsQuery = useQuery({
    queryKey: ['admin', 'tickets'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return response.json();
    },
    enabled: !!isAdmin
  });

  const auditLogsQuery = useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/audit-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
    enabled: !!isAdmin
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUserForm) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsCreateUserModalOpen(false);
      setNewUserForm({ username: '', name: '', password: '', role: 'admin' });
    }
  });

  // Memoized values
  const users = useMemo(() => usersQuery.data || [], [usersQuery.data]);
  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data]);
  const contacts = useMemo(() => contactsQuery.data || [], [contactsQuery.data]);
  const integrations = useMemo(() => integrationsQuery.data || [], [integrationsQuery.data]);
  const tickets = useMemo(() => ticketsQuery.data || [], [ticketsQuery.data]);
  const auditLogs = useMemo(() => auditLogsQuery.data || [], [auditLogsQuery.data]);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter((u: any) => u.isActive).length,
    totalOrders: orders.length,
    completedOrders: orders.filter((o: any) => o.status === 'completed').length,
    pendingContacts: contacts.filter((c: any) => c.status === 'new').length,
    activeIntegrations: integrations.filter((i: any) => i.isActive).length,
    openTickets: tickets.filter((t: any) => t.status === 'open').length
  }), [users, orders, contacts, integrations, tickets]);

  // Event handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUserForm);
  };

  // Early return for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={logout} className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">VictorySync Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {admin?.name}</span>
              <Badge variant="secondary">{admin?.role}</Badge>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeUsers} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedOrders} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingContacts} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Integrations</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{integrations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeIntegrations} active
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">${order.total}</p>
                        </div>
                        <Badge variant={order.status === 'completed' ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage customer accounts and permissions</CardDescription>
                  </div>
                  {admin?.role === 'super_admin' && (
                    <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Admin User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Admin User</DialogTitle>
                          <DialogDescription>
                            Add a new admin user to the system.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={newUserForm.username}
                              onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={newUserForm.name}
                              onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={newUserForm.password}
                              onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                                <SelectItem value="crm_manager">CRM Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateUserModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={createUserMutation.isPending}>
                              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'completed' ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>Review and respond to customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact: any) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.company || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={contact.status === 'new' ? "destructive" : "default"}>
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>CRM Integrations</CardTitle>
                <CardDescription>Monitor customer integrations and data sync</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations.map((integration: any) => (
                      <TableRow key={integration.id}>
                        <TableCell>{integration.userId}</TableCell>
                        <TableCell className="font-medium">{integration.type}</TableCell>
                        <TableCell>{integration.name}</TableCell>
                        <TableCell>
                          <Badge variant={integration.isActive ? "default" : "secondary"}>
                            {integration.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {integration.lastSync 
                            ? new Date(integration.lastSync).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>System activity and security logs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.ipAddress || 'N/A'}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
