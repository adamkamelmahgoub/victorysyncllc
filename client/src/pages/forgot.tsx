
import { useState, FormEvent } from "react";

export default function Forgot() {
  const [step,setStep]=useState<"start"|"complete">("start");
  const [email,setEmail]=useState(""); const [resetId,setResetId]=useState("");
  const [otp,setOtp]=useState(""); const [newPassword,setNewPassword]=useState("");
  const [msg,setMsg]=useState<string|null>(null); const [err,setErr]=useState<string|null>(null);

  async function start(e:FormEvent){
    e.preventDefault(); setErr(null); setMsg(null);
    const res=await fetch("/api/auth/forgot/start",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
    const data=await res.json(); if(!res.ok) return setErr(data?.error||"Failed");
    setResetId(data.resetId); setMsg("OTP sent. Check server logs (email provider to wire later)."); setStep("complete");
  }
  async function complete(e:FormEvent){
    e.preventDefault(); setErr(null); setMsg(null);
    const res=await fetch("/api/auth/forgot/complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({resetId,otp,newPassword})});
    const data=await res.json(); if(!res.ok) return setErr(data?.error||"Failed");
    setMsg("Password reset. You can sign in now.");
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-3">
        <h1 className="text-lg font-semibold">Reset your password</h1>
        {msg && <div className="text-green-700 text-sm">{msg}</div>}
        {err && <div className="text-red-700 text-sm">{err}</div>}
        {step==="start" ? (
          <form onSubmit={start} className="space-y-3">
            <input className="w-full border rounded-md px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <button className="w-full rounded-md bg-slate-900 text-white px-3 py-2">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={complete} className="space-y-3">
            <input className="w-full border rounded-md px-3 py-2" value={resetId} readOnly />
            <input className="w-full border rounded-md px-3 py-2" placeholder="OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
            <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
            <button className="w-full rounded-md bg-slate-900 text-white px-3 py-2">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
