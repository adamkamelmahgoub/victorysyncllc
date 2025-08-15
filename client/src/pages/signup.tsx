
import { useState } from "react";

type VerifyPayload = {
  accessCode: string;
  name: string;
  email: string;
  phone: string;
  orgNumber: string;
};

export default function SignUp() {
  const [step, setStep] = useState<"verify"|"otp"|"done">("verify");
  const [form, setForm] = useState<VerifyPayload>({ accessCode:"", name:"", email:"", phone:"", orgNumber:"" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null); // shows in dev

  const onChange = (k: keyof VerifyPayload) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function verify() {
    setError(null);
    const res = await fetch("/api/access/verify", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) { setError(data.error || "Verification failed"); return; }

    const res2 = await fetch("/api/access/request-otp", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ accessCode: form.accessCode, email: form.email, phone: form.phone })
    });
    const data2 = await res2.json();
    if (!res2.ok || !data2.ok) { setError(data2.error || "Could not send OTP"); return; }

    if (data2.devOtp) setDebugOtp(data2.devOtp); // shown only in dev
    setStep("otp");
  }

  async function confirmOtp(e: any) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/access/confirm-otp", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ accessCode: form.accessCode, email: form.email, otp })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) { setError(data.error || "Invalid OTP"); return; }
    setStep("done");
  }

  if (step === "done") {
    return (
      <section className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Account Verified</h1>
        <p className="mb-4">Your access code was verified and OTP confirmed.</p>
        <a className="underline" href="/signin">Continue to Sign In</a>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>

      {step === "verify" && (
        <form className="space-y-3" onSubmit={(e)=>{e.preventDefault(); verify();}}>
          <input className="w-full border p-2 rounded" placeholder="Access Code" value={form.accessCode} onChange={onChange("accessCode")} required />
          <input className="w-full border p-2 rounded" placeholder="Full Name" value={form.name} onChange={onChange("name")} required />
          <input className="w-full border p-2 rounded" placeholder="Work Email" value={form.email} onChange={onChange("email")} required />
          <input className="w-full border p-2 rounded" placeholder="Phone Number" value={form.phone} onChange={onChange("phone")} required />
          <input className="w-full border p-2 rounded" placeholder="Organization Number" value={form.orgNumber} onChange={onChange("orgNumber")} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full py-2 rounded bg-black text-white">Verify & Send OTP</button>
        </form>
      )}

      {step === "otp" && (
        <form className="space-y-3" onSubmit={confirmOtp}>
          <input className="w-full border p-2 rounded" placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} required />
          {debugOtp && <p className="text-xs text-gray-500">Dev OTP: {debugOtp}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full py-2 rounded bg-black text-white">Confirm OTP</button>
        </form>
      )}
    </section>
  );
}
