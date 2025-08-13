import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/api/client';
import { apiRequest } from '@/lib/api';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest<{token:string}>('POST','/api/auth/login',{ email, password });
      localStorage.setItem('vs_token', data.token);
      nav('/admin-portal');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Sign in to VictorySync</h1>

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
    </main>
  );
}