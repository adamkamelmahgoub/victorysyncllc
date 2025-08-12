import React, { useState } from 'react';
import { api } from '@/api/client';

export default function Register() {
  const [stage, setStage] = useState<'start'|'verify'>('start');
  const [payload, setPayload] = useState({
    code:'', email:'', phone:'', full_name:'', org_name:'', password:''
  });
  const [token, setToken] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function start(e:React.FormEvent) {
    e.preventDefault(); 
    setMsg('');
    setLoading(true);
    try {
      const r = await api('/auth/register/start', { method:'POST', body:JSON.stringify(payload) });
      setToken(r.token); 
      setStage('verify');
      setMsg('Verification codes sent to your email and phone.');
    } catch (error: any) {
      setMsg(error.message || 'Failed to send verification codes');
    }
    setLoading(false);
  }

  async function verify(e:React.FormEvent) {
    e.preventDefault(); 
    setMsg('');
    setLoading(true);
    try {
      const r = await api('/auth/register/verify', {
        method:'POST',
        body:JSON.stringify({
          token, code:payload.code, email:payload.email, phone:payload.phone,
          full_name:payload.full_name, org_name:payload.org_name, password:payload.password,
          email_code: emailCode, sms_code: smsCode
        })
      });
      setMsg(`Welcome, ${r.user.full_name}! Your account has been created.`);
      // Redirect to dashboard after successful registration
      setTimeout(() => window.location.href = '/customer-dashboard', 2000);
    } catch (error: any) {
      setMsg(error.message || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create your VictorySync account</h1>
      {stage==='start' ? (
        <form onSubmit={start} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Access Code</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Enter your access code" 
              value={payload.code} 
              onChange={e=>setPayload({...payload, code:e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Your full name" 
              value={payload.full_name} 
              onChange={e=>setPayload({...payload, full_name:e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Your organization name" 
              value={payload.org_name} 
              onChange={e=>setPayload({...payload, org_name:e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Your email address" 
              type="email" 
              value={payload.email} 
              onChange={e=>setPayload({...payload, email:e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Your phone number" 
              value={payload.phone} 
              onChange={e=>setPayload({...payload, phone:e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Create a strong password" 
              type="password" 
              value={payload.password} 
              onChange={e=>setPayload({...payload, password:e.target.value})} 
              required 
            />
          </div>
          <button 
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send verification codes'}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to your email and phone.</p>
          <div>
            <label className="block text-sm font-medium mb-1">Email Code</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Enter email verification code" 
              value={emailCode} 
              onChange={e=>setEmailCode(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SMS Code</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Enter SMS verification code" 
              value={smsCode} 
              onChange={e=>setSmsCode(e.target.value)} 
              required 
            />
          </div>
          <button 
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Complete registration'}
          </button>
        </form>
      )}
      {msg && <p className={`mt-4 ${msg.includes('Welcome') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
    </main>
  );
}