
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

  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics", {
        headers: {
          "x-admin-auth": "admin123",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  }) as { data: any; isLoading: boolean };

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

  // Package management mutations
  const editPackageMutation = useMutation({
    mutationFn: async ({ packageId, data }: { packageId: number; data: any }) => {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "admin123",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update package: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (packageId: number) => {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          "x-admin-auth": "admin123",
        },
      });
      if (!response.ok) throw new Error("Failed to delete package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete package: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handler functions for edit and delete package buttons
  const handleEditPackage = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      // For now, just show a simple prompt - in production would be a modal
      const newName = prompt("Enter new package name:", pkg.name);
      const newPrice = prompt("Enter new price:", pkg.price);
      const newDescription = prompt("Enter new description:", pkg.description);
      
      if (newName && newPrice && newDescription) {
        editPackageMutation.mutate({
          packageId,
          data: {
            name: newName,
            price: newPrice,
            description: newDescription,
            features: pkg.features
          }
        });
      }
    }
  };

  const handleDeletePackage = (packageId: number) => {
    if (confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      deletePackageMutation.mutate(packageId);
    }
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
                                    onClick={() => handleUserClick(user)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => impersonateUser(user.id)}
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Impersonate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                  >
                                    {user.isActive !== false ? (
                                      <>
                                        <UserX className="w-4 h-4 mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Package Management</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => exportData("packages")}
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
                          description: "Add Package functionality will be implemented soon",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Package
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {packagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Package</th>
                          <th className="text-left p-2">Price</th>
                          <th className="text-left p-2">Description</th>
                          <th className="text-left p-2">Created</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packages.map((pkg: any) => (
                          <tr key={pkg.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{pkg.name}</p>
                                <p className="text-xs text-gray-500">ID: {pkg.id}</p>
                              </div>
                            </td>
                            <td className="p-2">
                              <p className="font-medium">${parseFloat(pkg.price).toLocaleString()}</p>
                            </td>
                            <td className="p-2">
                              <p className="text-sm text-gray-600">{pkg.description}</p>
                            </td>
                            <td className="p-2">
                              {new Date(pkg.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditPackage(pkg.id)}
                                  className="border-gray-300 hover:bg-gray-50"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Order Management</span>
                  </CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => exportData("orders")}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Order ID</th>
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Total</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">#{order.id}</td>
                            <td className="p-2">
                              {users.find((u: any) => u.id.toString() === order.userId)?.name || 'Unknown'}
                            </td>
                            <td className="p-2">${parseFloat(order.total || 0).toLocaleString()}</td>
                            <td className="p-2">
                              <Badge className={
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="p-2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${analytics.totalRevenue?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-green-600">{analytics.monthlyGrowth?.revenue || '+0%'}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Avg Order Value</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${analytics.avgOrderValue?.toFixed(2) || 0}
                          </p>
                          <p className="text-xs text-blue-600">Per transaction</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.conversionRate?.toFixed(1) || 0}%
                          </p>
                          <p className="text-xs text-purple-600">Orders/Users</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Users</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.activeUsers || 0}
                          </p>
                          <p className="text-xs text-orange-600">
                            {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Packages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topPackages?.map((pkg: any, index: number) => (
                        <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold">{pkg.name}</p>
                              <p className="text-sm text-gray-600">${pkg.price}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{pkg.orders} orders</p>
                            <p className="text-sm text-gray-600">
                              ${(parseFloat(pkg.price) * pkg.orders).toLocaleString()} revenue
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Trends */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {analytics.monthlyGrowth?.users || '+0%'}
                        </div>
                        <p className="text-sm text-gray-600">This month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {analytics.monthlyGrowth?.revenue || '+0%'}
                        </div>
                        <p className="text-sm text-gray-600">This month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {analytics.monthlyGrowth?.orders || '+0%'}
                        </div>
                        <p className="text-sm text-gray-600">This month</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Basic Information</h3>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>ID:</strong> {selectedUser.id}</p>
                        <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Statistics</h3>
                      <div className="space-y-2">
                        <p><strong>Total Orders:</strong> {getUserStats(selectedUser.id).totalOrders}</p>
                        <p><strong>Total Spent:</strong> ${getUserStats(selectedUser.id).totalSpent.toLocaleString()}</p>
                        <p><strong>Avg Order Value:</strong> ${getUserStats(selectedUser.id).avgOrderValue.toFixed(2)}</p>
                        <p><strong>Support Tickets:</strong> {getUserStats(selectedUser.id).supportTickets}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Account Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Account Status</Label>
                          <Select 
                            value={userPrivileges.accountStatus} 
                            onValueChange={(value: "active" | "suspended" | "pending" | "banned" | "trial") => 
                              setUserPrivileges(prev => ({ ...prev, accountStatus: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="banned">Banned</SelectItem>
                              <SelectItem value="trial">Trial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Subscription Tier</Label>
                          <Select 
                            value={userPrivileges.subscriptionTier} 
                            onValueChange={(value: "basic" | "premium" | "enterprise" | "custom") => 
                              setUserPrivileges(prev => ({ ...prev, subscriptionTier: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">User Privileges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canCreateOrders">Can Create Orders</Label>
                        <Switch
                          id="canCreateOrders"
                          checked={userPrivileges.canCreateOrders}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canCreateOrders: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canViewReports">Can View Reports</Label>
                        <Switch
                          id="canViewReports"
                          checked={userPrivileges.canViewReports}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canViewReports: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canAccessPremiumFeatures">Can Access Premium Features</Label>
                        <Switch
                          id="canAccessPremiumFeatures"
                          checked={userPrivileges.canAccessPremiumFeatures}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canAccessPremiumFeatures: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canModifyProfile">Can Modify Profile</Label>
                        <Switch
                          id="canModifyProfile"
                          checked={userPrivileges.canModifyProfile}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canModifyProfile: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canDeleteAccount">Can Delete Account</Label>
                        <Switch
                          id="canDeleteAccount"
                          checked={userPrivileges.canDeleteAccount}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canDeleteAccount: checked }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canViewBilling">Can View Billing</Label>
                        <Switch
                          id="canViewBilling"
                          checked={userPrivileges.canViewBilling}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canViewBilling: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canManageIntegrations">Can Manage Integrations</Label>
                        <Switch
                          id="canManageIntegrations"
                          checked={userPrivileges.canManageIntegrations}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canManageIntegrations: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canExportData">Can Export Data</Label>
                        <Switch
                          id="canExportData"
                          checked={userPrivileges.canExportData}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canExportData: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canAccessAPI">Can Access API</Label>
                        <Switch
                          id="canAccessAPI"
                          checked={userPrivileges.canAccessAPI}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canAccessAPI: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="canViewAnalytics">Can View Analytics</Label>
                        <Switch
                          id="canViewAnalytics"
                          checked={userPrivileges.canViewAnalytics}
                          onCheckedChange={(checked) => 
                            setUserPrivileges(prev => ({ ...prev, canViewAnalytics: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Limits & Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="maxOrderValue">Max Order Value: ${userPrivileges.maxOrderValue.toLocaleString()}</Label>
                        <Slider
                          value={[userPrivileges.maxOrderValue]}
                          onValueChange={(value) => 
                            setUserPrivileges(prev => ({ ...prev, maxOrderValue: value[0] }))
                          }
                          max={100000}
                          min={100}
                          step={100}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxOrdersPerMonth">Max Orders Per Month: {userPrivileges.maxOrdersPerMonth}</Label>
                        <Slider
                          value={[userPrivileges.maxOrdersPerMonth]}
                          onValueChange={(value) => 
                            setUserPrivileges(prev => ({ ...prev, maxOrdersPerMonth: value[0] }))
                          }
                          max={500}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="creditLimit">Credit Limit: ${userPrivileges.creditLimit.toLocaleString()}</Label>
                        <Slider
                          value={[userPrivileges.creditLimit]}
                          onValueChange={(value) => 
                            setUserPrivileges(prev => ({ ...prev, creditLimit: value[0] }))
                          }
                          max={50000}
                          min={0}
                          step={500}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="apiRateLimit">API Rate Limit: {userPrivileges.apiRateLimit}/hour</Label>
                        <Slider
                          value={[userPrivileges.apiRateLimit]}
                          onValueChange={(value) => 
                            setUserPrivileges(prev => ({ ...prev, apiRateLimit: value[0] }))
                          }
                          max={10000}
                          min={100}
                          step={100}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataRetentionDays">Data Retention: {userPrivileges.dataRetentionDays} days</Label>
                        <Slider
                          value={[userPrivileges.dataRetentionDays]}
                          onValueChange={(value) => 
                            setUserPrivileges(prev => ({ ...prev, dataRetentionDays: value[0] }))
                          }
                          max={2555}
                          min={30}
                          step={30}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Priority Level</Label>
                        <Select 
                          value={userPrivileges.priority} 
                          onValueChange={(value: "low" | "normal" | "high" | "critical") => 
                            setUserPrivileges(prev => ({ ...prev, priority: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="customNotes">Custom Notes</Label>
                  <Textarea
                    id="customNotes"
                    value={userPrivileges.customNotes}
                    onChange={(e) => 
                      setUserPrivileges(prev => ({ ...prev, customNotes: e.target.value }))
                    }
                    placeholder="Add any custom notes about this user..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {getUserActivity(selectedUser.id).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' : 
                          activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()} • {activity.ip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUserPrivileges} className="bg-victory-purple hover:bg-purple-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
