import React, { useState } from 'react';
import { api } from '@/api/client';

export default function Register() {
  const [stage, setStage] = useState<'start'|'verify'>('start');
  const [payload, setPayload] = useState({ code:'', email:'', phone:'', full_name:'', org_name:'', password:'' });
  const [token, setToken] = useState(''); const [emailCode, setEmailCode] = useState(''); const [smsCode, setSmsCode] = useState('');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');

  async function start(e:React.FormEvent){
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const r = await api('/auth/register/start', { method:'POST', body:JSON.stringify(payload) });
      setToken(r.token);
      setStage('verify');
      setMsg('Verification codes sent to your email and phone');
    } catch(error: any) {
      setErr(error.message);
    }
  }

  async function verify(e:React.FormEvent){
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const r = await api('/auth/register/verify',{ method:'POST', body:JSON.stringify({
        token, code:payload.code, email:payload.email, phone:payload.phone, full_name:payload.full_name, org_name:payload.org_name, password:payload.password,
        email_code:emailCode, sms_code:smsCode
      })});
      setMsg(`Welcome, ${r.user.full_name}!`);
    } catch(error: any) {
      setErr(error.message);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create your VictorySync account</h1>
      {stage==='start' ? (
        <form onSubmit={start} className="space-y-3">
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Access code" value={payload.code} onChange={e=>setPayload({...payload, code:e.target.value})} required />
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Full name" value={payload.full_name} onChange={e=>setPayload({...payload, full_name:e.target.value})} required />
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Organization" value={payload.org_name} onChange={e=>setPayload({...payload, org_name:e.target.value})} required />
          <input className="w-full px-3 py-2 border rounded-md" type="email" placeholder="Email" value={payload.email} onChange={e=>setPayload({...payload, email:e.target.value})} required />
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Phone" value={payload.phone} onChange={e=>setPayload({...payload, phone:e.target.value})} required />
          <input className="w-full px-3 py-2 border rounded-md" type="password" placeholder="Password" value={payload.password} onChange={e=>setPayload({...payload, password:e.target.value})} required />
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Send verification codes</button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm text-gray-600">Enter the 6-digit codes we sent to your email and phone.</p>
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Email code" value={emailCode} onChange={e=>setEmailCode(e.target.value)} required />
          <input className="w-full px-3 py-2 border rounded-md" placeholder="SMS code" value={smsCode} onChange={e=>setSmsCode(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Complete registration</button>
        </form>
      )}
      {err && <p className="text-red-600 mt-3">{err}</p>}
      {msg && <p className="text-green-700 mt-3">{msg}</p>}
    </main>
  );
}