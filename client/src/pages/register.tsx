import { useState } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import Link from "next/link"; // Use Next.js Link for consistency

type RegisterFormData = z.infer<typeof registerUserSchema>;

export default function Register() {
  const router = useRouter(); // Use Next.js router for navigation
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // --- THIS IS THE MAIN PART WE ARE CHANGING ---
  const registerMutation = useMutation({
    // The mutation function now performs two steps
    mutationFn: async (data: RegisterFormData) => {
      // Step 1: Call the user registration API endpoint
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        throw new Error(error.message || 'Registration failed');
      }

      // Step 2: If registration is successful, call the send OTP API endpoint
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (!otpResponse.ok) {
        throw new Error('Registration succeeded, but failed to send verification email.');
      }

      // Return the user's email to use in the onSuccess callback
      return { email: data.email };
    },
    // The onSuccess callback now redirects to the OTP page
    onSuccess: (data) => {
      toast({
        title: "Account created!",
        description: "We've sent a verification code to your email.",
      });

      // Redirect to the OTP verification page, passing the email in the URL
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    },
    // The onError callback remains the same
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-victory-purple">
            Create Your Account
          </CardTitle>
          <CardDescription>
            Join VictorySync and start saving on customer service costs
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Your form JSX remains exactly the same */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...form.register("name")}
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...form.register("password")}
                  className={form.formState.errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
               <p className="text-xs text-gray-500">
                 Password must be at least 8 characters and contain at least one number
               </p>
            </div>

            {registerMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(registerMutation.error as any)?.message || "Registration failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#6950f0] hover:bg-[#5d4cdb] text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-victory-purple hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
