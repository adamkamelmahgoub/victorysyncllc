
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const totpSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type TOTPFormData = z.infer<typeof totpSchema>;

export function LoginForm() {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const totpForm = useForm<TOTPFormData>({
    resolver: zodResolver(totpSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.requires2FA) {
        setStep('2fa');
      } else {
        login(response.user, response.token);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (data: TOTPFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiRequest('/api/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ code: data.code }),
      });

      login(response.user, response.token);
    } catch (err: any) {
      setError(err.message || '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === '2fa') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={totpForm.handleSubmit(handle2FA)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>Enter 6-digit code from your authenticator app</Label>
              <InputOTP
                maxLength={6}
                value={totpForm.watch('code') || ''}
                onChange={(value) => totpForm.setValue('code', value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {totpForm.formState.errors.code && (
                <p className="text-sm text-red-500">
                  {totpForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('login')}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...loginForm.register('email')}
              placeholder="Enter your email"
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...loginForm.register('password')}
              placeholder="Enter your password"
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-500">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
