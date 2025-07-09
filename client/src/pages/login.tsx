import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Eye, EyeOff, Shield, User } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
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
      const endpoint = loginType === 'admin' ? '/api/admin/auth/login' : '/api/auth/login';
      const payload = loginType === 'admin' 
        ? { username: formData.username, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);

      // Redirect based on login type
      if (loginType === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
        toast({
          title: "Login Failed",
          description: err.message || 'An error occurred during login',
          variant: "destructive"
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
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

            {loginType === 'admin' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  <Link href="/login" className="text-purple-600 hover:text-purple-500">
                    Customer Login
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}