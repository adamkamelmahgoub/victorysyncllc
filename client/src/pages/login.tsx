import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('demo@victorysync.com');
  const [password, setPassword] = useState('VictoryScale123!');
  const [err, setErr] = useState<string | null>(null);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const loginMut = useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['/api/session/me'] });
      navigate('/customer-dashboard');
    },
    onError: (e: any) => setErr(e?.message || 'Login failed'),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    loginMut.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loginMut.isPending}
          className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 disabled:opacity-70"
        >
          {loginMut.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}