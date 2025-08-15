
import { useState } from "react";

type VerifyPayload={accessCode:string; name:string; email:string; phone:string; orgNumber:string;};

export default function SignUp(){
  const [step,setStep]=useState<"verify"|"otp"|"done">("verify");
  const [form,setForm]=useState<VerifyPayload>({accessCode:"",name:"",email:"",phone:"",orgNumber:""});
  const [otp,setOtp]=useState("");
  const [error,setError]=useState<string|null>(null);
  const [debugOtp,setDebugOtp]=useState<string|null>(null);
  
  const on=(k:keyof VerifyPayload)=> (e:any)=> setForm({...form,[k]:e.target.value});
  
  async function verify(){
    setError(null);
    const r=await fetch("/api/access/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d=await r.json();
    if(!r.ok||!d.ok){setError(d.error||"Verification failed");return;}
    
    const r2=await fetch("/api/access/request-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:form.accessCode,email:form.email,phone:form.phone})});
    const d2=await r2.json();
    if(!r2.ok||!d2.ok){setError(d2.error||"Could not send OTP");return;}
    
    if(d2.devOtp) setDebugOtp(d2.devOtp);
    setStep("otp");
  }
  
  async function confirm(e:any){
    e.preventDefault();
    setError(null);
    const r=await fetch("/api/access/confirm-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:form.accessCode,email:form.email,otp})});
    const d=await r.json();
    if(!r.ok||!d.ok){setError(d.error||"Invalid OTP");return;}
    setStep("done");
  }
  
  if(step==="done") return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Account Verified</h1>
      <p className="mb-4">Your access code was verified and OTP confirmed.</p>
      <a className="underline" href="/signin">Continue to Sign In</a>
    </section>
  );
  
  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
      
      {step==="verify" && (
        <form className="space-y-3" onSubmit={e=>{e.preventDefault(); verify();}}>
          <input className="w-full border p-2 rounded" placeholder="Access Code" value={form.accessCode} onChange={on("accessCode")} required />
          <input className="w-full border p-2 rounded" placeholder="Full Name" value={form.name} onChange={on("name")} required />
          <input className="w-full border p-2 rounded" placeholder="Work Email" value={form.email} onChange={on("email")} required />
          <input className="w-full border p-2 rounded" placeholder="Phone Number" value={form.phone} onChange={on("phone")} required />
          <input className="w-full border p-2 rounded" placeholder="Organization Number" value={form.orgNumber} onChange={on("orgNumber")} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full py-2 rounded bg-black text-white">Verify & Send OTP</button>
        </form>
      )}
      
      {step==="otp" && (
        <form className="space-y-3" onSubmit={confirm}>
          <input className="w-full border p-2 rounded" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} required />
          {debugOtp && <p className="text-xs text-gray-500">Dev OTP: {debugOtp}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full py-2 rounded bg-black text-white">Confirm OTP</button>
        </form>
      )}
    </section>
  );
}
