
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  CreditCard,
  FileText,
  Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';

interface KPIData {
  callsToday: number;
  callsThisWeek: number;
  callsThisMonth: number;
  activeAgents: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  resolutionRate: number;
  slaCompliance: number;
  avgHandleTime: number;
  occupancyRate: number;
}

interface Order {
  id: number;
  packageName: string;
  status: string;
  startDate: string;
  amount: number;
}

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  type: 'crm' | 'dialer' | 'ticketing';
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: kpiData, isLoading: kpiLoading } = useQuery<KPIData>({
    queryKey: ['kpi'],
    queryFn: () => apiRequest('GET', '/api/kpi'),
    refetchInterval: 30000, // Refresh every 30 seconds
    initialData: {
      callsToday: 0,
      callsThisWeek: 0,
      callsThisMonth: 0,
      activeAgents: 0,
      avgResponseTime: 0,
      customerSatisfaction: 0,
      resolutionRate: 0,
      slaCompliance: 0,
      avgHandleTime: 0,
      occupancyRate: 0
    }
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => apiRequest('GET', '/api/orders'),
    initialData: []
  });

  const { data: integrations = [], isLoading: integrationsLoading } = useQuery<Integration[]>({
    queryKey: ['integrations'],
    queryFn: () => apiRequest('GET', '/api/integrations'),
    initialData: []
  });

  const handleAddSeat = async () => {
    try {
      // Implement seat purchase logic
      const response = await apiRequest('POST', '/api/billing/seats', { quantity: 1 });
      // Redirect to Stripe checkout or handle payment
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Failed to add seat:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/LOGO_VS.png" alt="VictorySync" className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-sm text-gray-600">Customer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Support
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kpi">KPI Tracker</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.activeAgents}</div>
                  <p className="text-xs text-gray-600">Currently online</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
                  <Phone className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.callsToday}</div>
                  <p className="text-xs text-gray-600">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.avgResponseTime}s</div>
                  <p className="text-xs text-gray-600">-5% improvement</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.customerSatisfaction}%</div>
                  <p className="text-xs text-gray-600">+2% this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Service Status & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Contact Center</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">AI Automation</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Maintenance Window</span>
                      </div>
                      <Badge variant="secondary">Scheduled 2 AM EST</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-4">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No orders found</div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{order.packageName}</p>
                            <p className="text-xs text-gray-500">Started {order.startDate}</p>
                          </div>
                          <Badge variant={order.status === 'active' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="kpi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Call Volume Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Call Volume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{kpiData.callsToday}</div>
                      <div className="text-xs text-gray-600">Today</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{kpiData.callsThisWeek}</div>
                      <div className="text-xs text-gray-600">This Week</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{kpiData.callsThisMonth}</div>
                    <div className="text-xs text-gray-600">This Month</div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CSAT Score</span>
                        <span className="font-semibold">{kpiData.customerSatisfaction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${kpiData.customerSatisfaction}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resolution Rate</span>
                        <span className="font-semibold">{kpiData.resolutionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${kpiData.resolutionRate}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SLA Compliance</span>
                        <span className="font-semibold">{kpiData.slaCompliance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${kpiData.slaCompliance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Agent Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Active Agents</span>
                      <span className="font-bold text-lg">{kpiData.activeAgents}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Avg Handle Time</span>
                      <span className="font-bold text-lg">{kpiData.avgHandleTime}s</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Occupancy Rate</span>
                      <span className="font-bold text-lg">{kpiData.occupancyRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
                <p className="text-gray-600">Connect your tools to sync data and improve workflows</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CRM Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CRM Systems</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['HubSpot', 'Salesforce', 'Zoho CRM', 'Pipedrive'].map((crm) => (
                    <div key={crm} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{crm}</span>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dialer Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Twilio Flex', 'Five9', 'RingCentral', 'Aircall'].map((dialer) => (
                    <div key={dialer} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{dialer}</span>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Support Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Support Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Zendesk', 'Freshdesk', 'Intercom', 'Help Scout'].map((tool) => (
                    <div key={tool} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{tool}</span>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Billing & Usage</h2>
                <p className="text-gray-600">Manage your subscription and add team members</p>
              </div>
              <Button onClick={handleAddSeat} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Seat ($125/month)
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Plan</span>
                    <Badge>Professional</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Seats</span>
                    <span className="font-semibold">5 active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Cost</span>
                    <span className="font-semibold">$625.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Next Billing</span>
                    <span className="text-sm text-gray-600">January 15, 2025</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Usage This Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Calls</span>
                    <span className="font-semibold">{kpiData.callsThisMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Call Minutes</span>
                    <span className="font-semibold">2,450 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Automations</span>
                    <span className="font-semibold">148 runs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Integrations Active</span>
                    <span className="font-semibold">3 connected</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Dec 15, 2024', amount: '$625.00', status: 'Paid' },
                    { date: 'Nov 15, 2024', amount: '$500.00', status: 'Paid' },
                    { date: 'Oct 15, 2024', amount: '$500.00', status: 'Paid' }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-gray-600">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {invoice.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      value={user.email || ''} 
                      disabled 
                      className="w-full p-3 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      value={user.name || ''} 
                      disabled 
                      className="w-full p-3 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline">Update Profile</Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Email notifications for new orders',
                  'SMS alerts for critical issues', 
                  'Weekly performance reports',
                  'Integration sync notifications'
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{setting}</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
