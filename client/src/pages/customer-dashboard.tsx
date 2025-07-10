
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Package, CreditCard, Settings, LogOut, Bell, Download } from 'lucide-react';
import { useLocation } from 'wouter';

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'Professional',
    status: 'Active'
  });

  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.00,
      items: ['VictorySync Pro Package']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 149.00,
      items: ['Additional Features']
    }
  ]);

  const handleLogout = () => {
    // Clear any auth tokens/session data
    localStorage.removeItem('auth_token');
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900">{user.plan}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">Order {order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                        <p className="text-sm text-gray-500">{order.items.join(', ')}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {order.status}
                        </Badge>
                        <span className="font-semibold">${order.total.toFixed(2)}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan</label>
                  <p className="mt-1 text-sm text-gray-900">{user.plan}</p>
                </div>
                <Button className="mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Plan: {user.plan}</p>
                      <p className="text-sm text-gray-600">Next billing date: Feb 15, 2024</p>
                    </div>
                    <Button variant="outline">Manage Plan</Button>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>•••• •••• •••• 4242</span>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contact Support</h4>
                    <p className="text-sm text-gray-600 mb-3">Get help with your account or services</p>
                    <Button className="w-full">Start Chat</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Documentation</h4>
                    <p className="text-sm text-gray-600 mb-3">Access guides and tutorials</p>
                    <Button variant="outline" className="w-full">View Docs</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
