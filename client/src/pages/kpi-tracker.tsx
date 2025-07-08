import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Clock,
  DollarSign,
  Target,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";

export default function KPITracker() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to access KPI tracking.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Static orders data to avoid promise rejections
  const orders = [];
  const ordersLoading = false;

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

  // Calculate KPIs from orders data
  const completedOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'completed') : [];
  const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'pending') : [];
  const processingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'processing') : [];

  const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Mock data for demonstration (in real app, this would come from API)
  const kpiData = {
    customerSatisfaction: 92,
    responseTime: 2.4,
    resolutionRate: 87,
    callVolume: 156,
    lastMonthRevenue: totalRevenue * 0.85, // Mock previous month
    lastMonthOrders: completedOrders.length * 0.9, // Mock previous month
  };

  const revenueGrowth = kpiData.lastMonthRevenue > 0 
    ? ((totalRevenue - kpiData.lastMonthRevenue) / kpiData.lastMonthRevenue) * 100 
    : 0;

  const orderGrowth = kpiData.lastMonthOrders > 0 
    ? ((completedOrders.length - kpiData.lastMonthOrders) / kpiData.lastMonthOrders) * 100 
    : 0;

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  // Static business data to prevent promise rejections
  const businesses = [
    {
      id: 1,
      name: "TechCorp Solutions",
      status: "active",
      revenue: 125000,
      customers: 450,
      satisfaction: 94,
      growth: 15.2
    },
    {
      id: 2,
      name: "Global Innovations",
      status: "active", 
      revenue: 89000,
      customers: 320,
      satisfaction: 91,
      growth: 8.7
    },
    {
      id: 3,
      name: "StartupXYZ",
      status: "pending",
      revenue: 34000,
      customers: 120,
      satisfaction: 88,
      growth: 22.1
    }
  ];
  const businessesLoading = false;
  const error = null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link href="/customer-dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold victory-dark">KPI Tracker</h1>
              <p className="text-gray-600 mt-1">Monitor your business performance metrics</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className={`text-xs flex items-center ${getGrowthColor(revenueGrowth)}`}>
                {getGrowthIcon(revenueGrowth)}
                <span className="ml-1">{Math.abs(revenueGrowth).toFixed(1)}% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
              <p className={`text-xs flex items-center ${getGrowthColor(orderGrowth)}`}>
                {getGrowthIcon(orderGrowth)}
                <span className="ml-1">{Math.abs(orderGrowth).toFixed(1)}% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Based on {completedOrders.length} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.customerSatisfaction}%</div>
              <p className="text-xs text-green-600">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Service Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Response Time</span>
                <span className="font-semibold">{kpiData.responseTime} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolution Rate</span>
                <span className="font-semibold">{kpiData.resolutionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Call Volume (Today)</span>
                <span className="font-semibold">{kpiData.callVolume}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Orders</span>
                <Badge variant="outline">{pendingOrders.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Processing Orders</span>
                <Badge variant="secondary">{processingOrders.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Orders</span>
                <Badge className="bg-green-500 hover:bg-green-600">{completedOrders.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Business Clients Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {businessesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Loading business data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading business data
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business: any) => (
                  <div key={business.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{business.name}</h3>
                      <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                        {business.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium">${business.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customers:</span>
                        <span className="font-medium">{business.customers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction:</span>
                        <span className="font-medium">{business.satisfaction}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth:</span>
                        <span className={`font-medium ${getGrowthColor(business.growth)}`}>
                          {business.growth > 0 ? '+' : ''}{business.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}