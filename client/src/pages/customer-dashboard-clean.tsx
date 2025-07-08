import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useKpi } from "@/hooks/useKpi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import {
  User,
  Package,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Settings,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

const KpiTrackerComponent = () => {
  const { metrics, loading, error } = useKpi();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Error loading KPI data: {error}</p>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Live KPI Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Active Services */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Spend */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Spend</p>
                <p className="text-2xl font-bold text-gray-900">${metrics.monthlySpend.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Support Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.supportTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-lg font-semibold text-green-600">{metrics.accountStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Revenue Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Total Revenue</span>
                <span className="font-semibold">${metrics.totalRevenue.toLocaleString()}</span>
              </div>
              <Progress value={Math.min((metrics.totalRevenue / 50000) * 100, 100)} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Completed Orders</span>
                <span className="font-semibold">{metrics.completedOrders}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg Order Value</span>
                <span className="font-semibold">${metrics.avgOrderValue}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Service Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Service Quality</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span className="font-semibold">{metrics.customerSatisfaction}%</span>
              </div>
              <Progress value={metrics.customerSatisfaction} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg Response Time</span>
                <span className="font-semibold">{metrics.avgResponseTime}m</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Resolution Rate</span>
                <span className="font-semibold">{metrics.resolutionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Operations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Completed Tasks</span>
                <span className="font-semibold">{metrics.completedTasks}</span>
              </div>
              <Progress value={Math.min((metrics.completedTasks / 100) * 100, 100)} className="mt-2" />
            </div>
            <div className="text-center pt-4">
              <Badge variant="secondary">
                All systems operational
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function CustomerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  }) as { data: any[], isLoading: boolean };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || 'Customer'}! Manage your services and view performance metrics.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-victory-purple text-victory-purple'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('kpi-tracker')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kpi-tracker'
                  ? 'border-victory-purple text-victory-purple'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Live KPI Tracker
            </button>
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-victory-purple to-victory-blue text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Quick Action</p>
                  <p className="text-lg font-semibold">View Services</p>
                </div>
                <Package className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Link href="/pricing" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Quick Action</p>
                    <p className="text-lg font-semibold victory-dark">Add Services</p>
                  </div>
                  <Settings className="w-8 h-8 victory-purple" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Link href="/contact" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Quick Action</p>
                    <p className="text-lg font-semibold victory-dark">Contact Support</p>
                  </div>
                  <Phone className="w-8 h-8 victory-purple" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Account</p>
                  <p className="text-lg font-semibold victory-dark">Settings</p>
                </div>
                <User className="w-8 h-8 victory-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === 'kpi-tracker' ? (
          <KpiTrackerComponent />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Recent Orders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : Array.isArray(orders) && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order: any) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-semibold victory-dark">
                                Order #{order.id}
                              </p>
                              <p className="text-sm victory-gray">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <p className="text-sm font-semibold victory-dark mt-1">
                              ${parseFloat(order.total).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                      <Link href="/pricing">
                        <Button className="mt-4 bg-victory-purple hover:bg-victory-purple/90">
                          Browse Services
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Account Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Need help? Our support team is available 24/7 to assist you.
                  </p>
                  <Link href="/contact">
                    <Button className="bg-white text-victory-purple hover:bg-gray-100 w-full">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;