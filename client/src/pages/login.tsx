
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('vs_token', data.token);
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to VictorySync
          </h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Email</Label>
            <Input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email" 
              placeholder="your@email.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Password</Label>
            <Input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password" 
              placeholder="Password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              disabled={loading}
            />
          </div>

          <Button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

        <p className="mt-4 text-sm text-gray-600">
          Need to register? Contact your admin for an access code.
        </p>
      </div>
    </main>
  );
}
