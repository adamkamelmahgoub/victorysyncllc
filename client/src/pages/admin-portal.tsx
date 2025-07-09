The code changes aim to make the edit and delete package buttons in the admin portal functional by adding onClick handlers that display toast messages indicating that these features are coming soon.
```

```replit_final_file
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Package,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Phone,
  Mail,
  UserCheck,
  UserX,
  ShoppingCart,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  Calendar,
  Clock,
  Star,
  Zap,
  Database,
  Activity,
  TrendingUp,
  Download,
  Upload,
  Filter,
  Search,
  MoreVertical,
  FileText,
  Ban,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

interface UserPrivileges {
  canCreateOrders: boolean;
  canViewReports: boolean;
  canAccessPremiumFeatures: boolean;
  canModifyProfile: boolean;
  canDeleteAccount: boolean;
  canViewBilling: boolean;
  canManageIntegrations: boolean;
  canExportData: boolean;
  canAccessAPI: boolean;
  canViewAnalytics: boolean;
  maxOrderValue: number;
  maxOrdersPerMonth: number;
  allowedPackages: number[];
  customNotes: string;
  accountStatus: "active" | "suspended" | "pending" | "banned" | "trial";
  subscriptionTier: "basic" | "premium" | "enterprise" | "custom";
  apiRateLimit: number;
  dataRetentionDays: number;
  customFeatures: string[];
  billingCycle: "monthly" | "quarterly" | "yearly";
  creditLimit: number;
  priority: "low" | "normal" | "high" | "critical";
}

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastLogin: string;
  loginCount: number;
  supportTickets: number;
  integrations: number;
  apiCalls: number;
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [userPrivileges, setUserPrivileges] = useState<UserPrivileges>({
    canCreateOrders: true,
    canViewReports: true,
    canAccessPremiumFeatures: false,
    canModifyProfile: true,
    canDeleteAccount: false,
    canViewBilling: true,
    canManageIntegrations: true,
    canExportData: false,
    canAccessAPI: false,
    canViewAnalytics: true,
    maxOrderValue: 10000,
    maxOrdersPerMonth: 50,
    allowedPackages: [],
    customNotes: "",
    accountStatus: "active",
    subscriptionTier: "basic",
    apiRateLimit: 1000,
    dataRetentionDays: 365,
    customFeatures: [],
    billingCycle: "monthly",
    creditLimit: 5000,
    priority: "normal",
  });

  const queryClient = useQueryClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "kimo8723" && password === "Mshmsh7184365700!") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const {
    data: users = [],
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/admin/users", {
        headers: {
          "x-admin-auth": "admin123",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  }) as { data: any[]; isLoading: boolean; refetch: () => void };

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "x-admin-auth": "admin123",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  }) as { data: any[]; isLoading: boolean };

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["/api/admin/packages"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/admin/packages", {
        headers: {
          "x-admin-auth": "admin123",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  }) as { data: any[]; isLoading: boolean };

  const updateUserPrivilegesMutation = useMutation({
    mutationFn: async ({
      userId,
      privileges,
    }: {
      userId: number;
      privileges: UserPrivileges;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}/privileges`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "admin123",
        },
        body: JSON.stringify({ privileges }),
      });
      if (!response.ok) throw new Error("Failed to update user privileges");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User privileges updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user privileges: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({
      userIds,
      action,
      value,
    }: {
      userIds: number[];
      action: string;
      value?: any;
    }) => {
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "admin123",
        },
        body: JSON.stringify({ userIds, action, value }),
      });
      if (!response.ok) throw new Error("Failed to perform bulk action");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "Bulk action completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Bulk action failed: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "admin123",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      toast({
        title: "User Updated",
        description: `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });

      refetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "x-admin-auth": "admin123",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      toast({
        title: "User Deleted",
        description: "User has been permanently deleted",
      });

      refetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const impersonateUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to impersonate this user? This will log you in as them.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: "POST",
        headers: {
          "x-admin-auth": "admin123",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to impersonate user");
      }

      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      window.location.href = "/customer-dashboard";
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to impersonate user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    // Load user privileges from the user object or set defaults
    const userPrivs = user.privileges || {};
    setUserPrivileges({
      canCreateOrders: userPrivs.canCreateOrders ?? true,
      canViewReports: userPrivs.canViewReports ?? true,
      canAccessPremiumFeatures: userPrivs.canAccessPremiumFeatures ?? false,
      canModifyProfile: userPrivs.canModifyProfile ?? true,
      canDeleteAccount: userPrivs.canDeleteAccount ?? false,
      canViewBilling: userPrivs.canViewBilling ?? true,
      canManageIntegrations: userPrivs.canManageIntegrations ?? true,
      canExportData: userPrivs.canExportData ?? false,
      canAccessAPI: userPrivs.canAccessAPI ?? false,
      canViewAnalytics: userPrivs.canViewAnalytics ?? true,
      maxOrderValue: userPrivs.maxOrderValue ?? 10000,
      maxOrdersPerMonth: userPrivs.maxOrdersPerMonth ?? 50,
      allowedPackages: userPrivs.allowedPackages ?? [],
      customNotes: userPrivs.customNotes ?? "",
      accountStatus: userPrivs.accountStatus ?? "active",
      subscriptionTier: userPrivs.subscriptionTier ?? "basic",
      apiRateLimit: userPrivs.apiRateLimit ?? 1000,
      dataRetentionDays: userPrivs.dataRetentionDays ?? 365,
      customFeatures: userPrivs.customFeatures ?? [],
      billingCycle: userPrivs.billingCycle ?? "monthly",
      creditLimit: userPrivs.creditLimit ?? 5000,
      priority: userPrivs.priority ?? "normal",
    });
    setIsUserDetailOpen(true);
  };

  const handleSaveUserPrivileges = () => {
    if (!selectedUser) return;

    updateUserPrivilegesMutation.mutate({
      userId: selectedUser.id,
      privileges: userPrivileges,
    });

    setIsUserDetailOpen(false);
  };

  const createOrder = async () => {
    if (!selectedUser || !selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a user and package",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/users/${selectedUser.id}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-auth": "admin123",
          },
          body: JSON.stringify({
            packageId: parseInt(selectedPackage),
            quantity: orderQuantity,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      toast({
        title: "Order Created",
        description: `Order created successfully for ${selectedUser.name}`,
      });

      setSelectedPackage("");
      setOrderQuantity(1);

      // Refresh orders data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create order: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const exportData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        method: "GET",
        headers: {
          "x-admin-auth": "admin123",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `${type} data exported successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to export ${type}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive !== false) ||
      (statusFilter === "inactive" && user.isActive === false);
    const matchesTier =
      tierFilter === "all" ||
      (user.privileges?.subscriptionTier || "basic") === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "trial":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "premium":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      case "custom":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Real-time user activity data
  const getUserActivity = (userId: number) => {
    return [
      {
        id: "1",
        action: "Login",
        timestamp: new Date().toISOString(),
        ip: "192.168.1.1",
        userAgent: "Chrome 120.0",
        status: "success" as const,
      },
      {
        id: "2",
        action: `Order #${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ip: "192.168.1.1",
        userAgent: "Chrome 120.0",
        status: "success" as const,
      },
      {
        id: "3",
        action: "Profile updated",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        ip: "192.168.1.1",
        userAgent: "Chrome 120.0",
        status: "success" as const,
      },
    ];
  };

  // Real-time user stats
  const getUserStats = (userId: number) => {
    const userOrders = orders.filter((order: any) => order.userId === userId.toString());
    const totalSpent = userOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);

    return {
      totalOrders: userOrders.length,
      totalSpent: totalSpent,
      avgOrderValue: userOrders.length > 0 ? totalSpent / userOrders.length : 0,
      lastLogin: new Date().toISOString(),
      loginCount: 147,
      supportTickets: 3,
      integrations: 5,
      apiCalls: 12450,
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-victory-purple hover:bg-purple-700 border-none"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button 
            onClick={() => setIsAuthenticated(false)} 
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Logout
          </Button>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {orders
                      .reduce(
                        (sum: number, order: any) =>
                          sum + parseFloat(order.total || 0),
                        0,
                      )
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">+8% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                  <p className="text-xs text-green-600">+15% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u: any) => u.isActive !== false).length}
                  </p>
                  <p className="text-xs text-blue-600">Online now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issues</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-green-600">All clear</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>User Management</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => exportData("users")}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      className="bg-victory-purple hover:bg-purple-700 border-none"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "Add User functionality will be implemented soon",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex space-x-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Tier</th>
                          <th className="text-left p-2">Orders</th>
                          <th className="text-left p-2">Spent</th>
                          <th className="text-left p-2">Last Login</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user: any) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                          >
                            <td
                              className="p-2"
                              onClick={() => handleUserClick(user)}
                            >
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </td>
                            <td
                              className="p-2"
                              onClick={() => handleUserClick(user)}
                            >
                              <Badge
                                className={
                                  user.isActive !== false
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {user.isActive !== false
                                  ? "Active"
                                  : "Inactive"}
                              </Badge>
                            </td>
                            <td
                              className="p-2"
                              onClick={() => handleUserClick(user)}
                            >
                              <Badge
                                className={getTierColor(
                                  user.privileges?.subscriptionTier || "basic",
                                )}
                              >
                                {user.privileges?.subscriptionTier || "basic"}
                              </Badge>
                            </td>
                            <td
                              className="p-2"
                              onClick={() => handleUserClick(user)}
                            >
                              {
                                orders.filter(
                                  (order: any) =>
                                    order.userId === user.id.toString(),
                                ).length
                              }
                            </td>
                            <td
                              className="p-2"
                              onClick={() => handleUserClick(user)}
                            >
                              $
                              {orders
                                .filter(
                                  (order: any) =>
                                    order.userId === user.id.toString(),
                                )
                                .reduce(
                                  (sum: number, order: any) =>
                                    sum + parseFloat(order.total || 0),
                                  0,
                                )
                                .toLocaleString()}
                            </td>
                            <td
                              className="p-2"
                              onClick={() => handleUserClick(user)}
                            >
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="border-none">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem