import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Eye, EyeOff, Shield, User } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get redirect URL from query params
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect') || '/dashboard';
  const loginType = urlParams.get('type') || 'customer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      localStorage.setItem("token", data.token);
      localStorage.removeItem("auth_token"); // Clean up old token key

      // Check user role and redirect appropriately
      const userRole = data.user.role;
      const isAdmin = ['admin', 'super_admin', 'billing', 'crm_manager'].includes(userRole);
      const isCustomer = userRole === 'user' || userRole === 'customer';

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      // Role-based redirect logic
      if (redirectTo === '/admin') {
        if (isAdmin) {
          window.location.href = '/admin';
        } else {
          toast({
            title: "Access Denied",
            description: "Admin privileges required",
            variant: "destructive"
          });
          window.location.href = '/dashboard';
        }
      } else if (redirectTo === '/dashboard') {
        if (isCustomer) {
          window.location.href = '/dashboard';
        } else if (isAdmin) {
          // Admin accessing customer area - allow but show notice
          toast({
            title: "Admin Access",
            description: "You're accessing the customer dashboard as an admin",
          });
          window.location.href = '/dashboard';
        }
      } else {
        // Default redirect based on role
        if (isAdmin) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Pre-fill admin credentials for testing
  const fillAdminCredentials = () => {
    setFormData({
      email: "kimo8723@gmail.com",
      password: "Mshmsh7184365700!"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {loginType === 'admin' ? (
              <Shield className="h-12 w-12 text-purple-600" />
            ) : (
              <User className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {loginType === 'admin' ? 'Admin Portal Login' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {loginType === 'admin' 
              ? 'Access the Victory Sync administration panel'
              : 'Access your Victory Sync customer dashboard'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {loginType === 'admin' ? 'Admin Login' : 'Customer Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {loginType === 'admin' && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillAdminCredentials}
                    className="text-xs"
                  >
                    Fill Admin Credentials (Demo)
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-victory-purple focus:ring-victory-purple border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-victory-purple hover:text-victory-purple/80">
                  Forgot your password?
                </Link>
              </div>
            </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {loginType !== 'admin' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
                    Sign up here
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {loginType === 'admin' ? (
                  <Link href="/login" className="text-purple-600 hover:text-purple-500">
                    Customer Login
                  </Link>
                ) : (
                  <Link href="/login?type=admin" className="text-purple-600 hover:text-purple-500">
                    Admin Login
                  </Link>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}