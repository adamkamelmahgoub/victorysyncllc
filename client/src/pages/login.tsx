import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/features/auth/login-form";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      if (user.isSuperAdmin) {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </Link>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Have an access code?{' '}
            <Link href="/register-with-code" className="font-medium text-purple-600 hover:text-purple-500">
              Register with code
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}