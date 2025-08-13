
import React, { useState } from 'react';
import { api } from '@/api/client';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const nav = useNavigate();
  const [stage, setStage] = useState<'start' | 'verify'>('start');
  const [params, setParams] = useState({
    code: '',
    email: '',
    phone: '',
    full_name: '',
    org_name: '',
    password: ''
  });
  const [token, setToken] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await api('/auth/register/start', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      
      setToken(result.token);
      setStage('verify');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await api('/auth/register/verify', {
        method: 'POST',
        body: JSON.stringify({
          token,
          code: params.code,
          email: params.email,
          phone: params.phone,
          full_name: params.full_name,
          org_name: params.org_name,
          password: params.password,
          email_code: emailCode,
          sms_code: smsCode
        })
      });
      
      localStorage.setItem('vs_token', result.token);
      nav('/admin');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-semibold mb-6">Create your VictorySync account</h1>
      
      {stage === 'start' ? (
        <form onSubmit={start} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Access Code</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Access code from admin"
              value={params.code} 
              onChange={e => setParams({ ...params, code: e.target.value })} 
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
              value={params.full_name} 
              onChange={e => setParams({ ...params, full_name: e.target.value })} 
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Organization</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Company"
              value={params.org_name} 
              onChange={e => setParams({ ...params, org_name: e.target.value })} 
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email" 
              placeholder="john@company.com"
              value={params.email} 
              onChange={e => setParams({ ...params, email: e.target.value })} 
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
              value={params.phone} 
              onChange={e => setParams({ ...params, phone: e.target.value })} 
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password" 
              placeholder="Strong password"
              value={params.password} 
              onChange={e => setParams({ ...params, password: e.target.value })} 
              required
              disabled={loading}
            />
          </div>
          
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending verification codes...' : 'Send verification codes'}
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-4 text-sm text-gray-600">
            We've sent verification codes to your email and phone. Enter both codes below to complete registration.
          </p>
          
          <form onSubmit={verify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Code</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit code from email"
                value={emailCode} 
                onChange={e => setEmailCode(e.target.value)} 
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">SMS Code</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit code from SMS"
                value={smsCode} 
                onChange={e => setSmsCode(e.target.value)} 
                required
                disabled={loading}
              />
            </div>
            
            <button 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Completing registration...' : 'Complete registration'}
            </button>
          </form>
        </div>
      )}
      
      {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
    </main>
  );
}
