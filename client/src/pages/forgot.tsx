
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
import { useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/apiRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Forgot() {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [resetId, setResetId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function startReset() {
    try {
      setError(null);
      const response = await fetch("/api/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email })
      });
      await response.json();
      setStep("verify");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function completeReset() {
    try {
      setError(null);
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      
      const response = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: otp, newPassword })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-victory-purple">
              Password Reset Complete
            </CardTitle>
            <CardDescription>
              Your password has been successfully updated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button className="w-full bg-[#6950f0] hover:bg-[#5d4cdb] text-white">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-victory-purple">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            {step === "email" 
              ? "Enter your email to receive a reset code"
              : "Enter the code from your server logs and your new password"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === "email" ? (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              
              <Button
                onClick={startReset}
                className="w-full bg-[#6950f0] hover:bg-[#5d4cdb] text-white"
              >
                Send Reset Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Check your server logs for the 6-digit verification code.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Reset Token</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter reset token from email"
                />
              </div></old_str>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button
                onClick={completeReset}
                className="w-full bg-[#6950f0] hover:bg-[#5d4cdb] text-white"
              >
                Reset Password
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
