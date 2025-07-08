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

const KpiTracker = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const response = await fetch('/api/kpi/live');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          setError('Failed to load KPI data');
        }
      } catch (err) {
        setError('Failed to load KPI data');
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
    // Poll every 30 seconds
    const interval = setInterval(fetchKpiData, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Active Services */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600 w-6 h-6" />
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
              <span>Revenue Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="font-semibold">${metrics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed Orders</span>
              <span className="font-semibold">{metrics.completedOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Order Value</span>
              <span className="font-semibold">${metrics.avgOrderValue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold">{metrics.customerSatisfaction}%</span>
              </div>
              <Progress value={metrics.customerSatisfaction} className="h-2" />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="font-semibold">{metrics.avgResponseTime}min</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="font-semibold">{metrics.resolutionRate}%</span>
              </div>
              <Progress value={metrics.resolutionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Task Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Task Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed Tasks</span>
              <span className="font-semibold">{metrics.completedTasks}</span>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {((metrics.completedTasks / (metrics.completedTasks + 10)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">Task Completion Rate</div>
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
    return null; // Will redirect to login
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default":
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {activeTab === 'kpi-tracker' && (
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('overview')}
                  className="mb-2"
                >
                  ← Back to Dashboard
                </Button>
              )}
              <h1 className="text-3xl font-bold victory-dark">
                {activeTab === 'kpi-tracker' ? 'KPI Tracker' : 'Welcome back!'}
              </h1>
              <p className="victory-gray">
                {activeTab === 'kpi-tracker' 
                  ? 'Monitor your business metrics and performance indicators'
                  : `Hello ${user?.name || "there"}, manage your VictorySync services here.`
                }
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/api/logout")}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Services */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="victory-purple w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm victory-gray">Active Services</p>
                  <p className="text-2xl font-bold victory-dark">
                    {Array.isArray(orders) ? orders.filter(
                      (order: any) => order.status === "completed",
                    ).length : 0}
                  </p>
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
                  <p className="text-sm victory-gray">Monthly Spend</p>
                  <p className="text-2xl font-bold victory-dark">
                    $
                    {Array.isArray(orders) ? orders
                      .reduce(
                        (sum: number, order: any) =>
                          order.status === "completed"
                            ? sum + parseFloat(order.total)
                            : sum,
                        0,
                      )
                      .toLocaleString() : "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Tickets */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="victory-blue w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm victory-gray">Support Tickets</p>
                  <p className="text-2xl font-bold victory-dark">0</p>
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
                  <p className="text-sm victory-gray">Account Status</p>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === 'kpi-tracker' ? (
          <KpiTracker />
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
                    <Package className="w-12 h-12 victory-gray mx-auto mb-4" />
                    <p className="victory-gray mb-4">No orders yet</p>
                    <Link href="/pricing">
                      <Button className="bg-victory-purple hover:bg-purple-700 text-white">
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Account Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/pricing">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('kpi-tracker')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  KPI Tracker
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="victory-purple w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold victory-dark">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm victory-gray flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {user?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="victory-gray">Member since:</span>
                    <span className="font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="gradient-victory text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Our support team is available 24/7 to assist you with any
                  questions.
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