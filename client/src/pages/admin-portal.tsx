
import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import AdminDashboard from '@/admin/admin-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function AdminPortal() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If user is logged in and is admin, show dashboard
  if (user && ['admin', 'super_admin', 'billing', 'crm_manager'].includes(user.role)) {
    return <AdminDashboard />;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user && ['admin', 'super_admin', 'billing', 'crm_manager'].includes(result.user.role)) {
        toast({
          title: "Welcome to Admin Portal",
          description: "Successfully logged in as administrator",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Admin privileges required",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or insufficient privileges",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <img src="/LOGO_VS.png" alt="VictorySync" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Portal</CardTitle>
            <CardDescription className="text-center">
              Administrator access required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@victorysync.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in to Admin Portal"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Admin Access</h4>
              <p className="text-xs text-blue-600 mb-2">
                Use these credentials for demo access:
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Email:</strong> admin@victorysync.com</div>
                <div><strong>Password:</strong> AdminDemo123!</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => window.location.href = '/'}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to main site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
