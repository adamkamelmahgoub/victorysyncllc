import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Package, 
  CreditCard, 
  Settings, 
  Plus,
  Eye,
  FileText,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Activity
} from 'lucide-react';

export default function CustomerDashboard() {
  // ---- 1) All hooks declared unconditionally in same order ----
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State hooks - always declared
  const [activeTab, setActiveTab] = useState('overview');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('medium');
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  // Derive flags for enabled conditions
  const canFetch = !!user?.id;
  const isOverviewTab = activeTab === 'overview';
  const isOrdersTab = activeTab === 'orders';
  const isBillingTab = activeTab === 'billing';
  const isTicketsTab = activeTab === 'tickets';
  const isSettingsTab = activeTab === 'settings';

  // ---- 2) All queries declared unconditionally - use enabled flag ----

  // Profile data (needed across tabs)
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: canFetch,
    staleTime: 60000,
    retry: 1
  });

  // Orders data
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: canFetch && isOrdersTab,
    staleTime: 60000,
    retry: 1
  });

  // Invoices data
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/invoices', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch invoices');
      return response.json();
    },
    enabled: canFetch && isBillingTab,
    staleTime: 60000,
    retry: 1
  });

  // Support tickets data
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/support/tickets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return response.json();
    },
    enabled: canFetch && isTicketsTab,
    staleTime: 60000,
    retry: 1
  });

  // CRM integrations data
  const { data: integrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ['integrations', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/integrations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
    enabled: canFetch && isSettingsTab,
    staleTime: 60000,
    retry: 1
  });

  // ---- 3) Mutations declared unconditionally ----
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ticketData)
      });
      if (!response.ok) throw new Error('Failed to create ticket');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({ title: 'Support ticket created successfully' });
      setNewTicketTitle('');
      setNewTicketDescription('');
      setNewTicketPriority('medium');
      setIsCreateTicketOpen(false);
    },
    onError: () => {
      toast({ title: 'Failed to create ticket', variant: 'destructive' });
    }
  });

  // ---- 4) Event handlers ----
  const handleCreateTicket = () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    createTicketMutation.mutate({
      title: newTicketTitle,
      description: newTicketDescription,
      priority: newTicketPriority
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ---- 5) Conditional rendering AFTER all hooks ----
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You need to be signed in to access your dashboard.</p>
        <Button onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.user?.email || user.email}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center p-6">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{orders?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold">
                      ${orders?.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                    <p className="text-2xl font-bold">{tickets?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Account Status</p>
                    <p className="text-2xl font-bold text-green-600">Active</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <p className="text-gray-500">Loading activity...</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Account created</p>
                        <p className="text-xs text-gray-500">
                          {profile?.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p className="text-gray-500">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <Button onClick={() => window.location.href = '/pricing'} className="mt-4">
                      View Packages
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.packageName}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <p className="text-gray-500">Loading invoices...</p>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice: any) => (
                        <TableRow key={invoice.id}>
                          <TableCell>#{invoice.id}</TableCell>
                          <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>${invoice.amount}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Support Tickets</CardTitle>
                <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newTicketTitle}
                          onChange={(e) => setNewTicketTitle(e.target.value)}
                          placeholder="Brief description of the issue"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTicketDescription}
                          onChange={(e) => setNewTicketDescription(e.target.value)}
                          placeholder="Detailed description of the issue"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleCreateTicket}
                        disabled={createTicketMutation.isPending}
                        className="w-full"
                      >
                        {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <p className="text-gray-500">Loading tickets...</p>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No support tickets yet</p>
                    <p className="text-sm text-gray-400">Create a ticket if you need help</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket #</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket: any) => (
                        <TableRow key={ticket.id}>
                          <TableCell>#{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>
                            <Badge variant={ticket.priority === 'urgent' || ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.user?.email || user?.email || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="created">Member Since</Label>
                  <Input
                    id="created"
                    value={profile?.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString() : 'Unknown'}
                    disabled
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CRM Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                {integrationsLoading ? (
                  <p className="text-gray-500">Loading integrations...</p>
                ) : integrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No integrations configured</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {integrations.map((integration: any) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-gray-500">{integration.type}</p>
                        </div>
                        <Badge className={integration.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {integration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}