import React, { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminRoutes } from './admin/AdminRoutes';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Zap,
  DollarSign,
  Activity,
  LogOut,
  UserCog,
  Shield
} from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('overview');

  // Check admin authentication
  const { data: adminUser, isLoading: authLoading } = useQuery({
    queryKey: ['/api/admin/auth/me'],
    queryFn: async () => {
      const token = localStorage.getItem('vs_admin_token');
      if (!token) throw new Error('No admin token');

      const response = await fetch('/api/admin/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        localStorage.removeItem('vs_admin_token');
        throw new Error('Invalid admin token');
      }

      return response.json();
    },
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const token = localStorage.getItem('vs_admin_token');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!adminUser,
  });

  React.useEffect(() => {
    if (!authLoading && !adminUser) {
      window.location.href = '/admin/login';
    }
  }, [adminUser, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('vs_admin_token');
    window.location.href = '/admin/login';
  };

  const [location] = useLocation();
  
  const sidebarItems = [
    { href: '/admin', label: 'Overview', icon: BarChart3 },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/users', label: 'Users', icon: UserCog },
    { href: '/admin/features', label: 'Features', icon: Settings },
    { href: '/admin/integrations', label: 'Integrations', icon: Zap },
    { href: '/admin/billing', label: 'Billing', icon: DollarSign },
    { href: '/admin/settings', label: 'Settings', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
              <p className="text-white/70">Welcome back, {adminUser.name}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 rounded-lg p-4">
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        location === item.href
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {location === '/admin' ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Total Customers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        {stats?.totalCustomers || 0}
                      </div>
                      <p className="text-white/70 text-sm">Active accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Monthly Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        ${stats?.monthlyRevenue || '0'}
                      </div>
                      <p className="text-white/70 text-sm">+15% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Active Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        {stats?.totalIntegrations || 0}
                      </div>
                      <p className="text-white/70 text-sm">Across all customers</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400">99.9%</div>
                      <p className="text-white/70 text-sm">Uptime this month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-white/70 text-center py-8">
                      No recent activity to display
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
                <AdminRoutes />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}