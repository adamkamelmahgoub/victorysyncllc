
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "@/lib/apiRequest";
import "./admin.css";

export default function AdminForgot() {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [resetId, setResetId] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationPhrase, setVerificationPhrase] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function startReset() {
    try {
      setError(null);
      const response = await fetch("/api/password/admin/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, orgIdCode: verificationPhrase })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
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
      if (newPassword.length < 12) {
        setError("Admin password must be at least 12 characters");
        return;
      }
      
      const response = await fetch("/api/password/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: otp, newPassword, orgIdCode: verificationPhrase })
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
      <div className="vs-admin min-h-screen grid place-items-center">
        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow border">
          <div className="vs-gradient p-5 text-white">
            <h1 className="text-xl font-semibold">Password Reset Complete</h1>
          </div>
          <div className="p-6 text-center">
            <p className="text-green-700 mb-4">Your admin password has been successfully reset.</p>
            <Link to="/admin/login" className="text-blue-600 hover:underline">
              Sign in with your new password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vs-admin min-h-screen grid place-items-center">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow border">
        <div className="vs-gradient p-5 text-white">
          <h1 className="text-xl font-semibold">Admin Password Reset</h1>
        </div>
        
        {step === "email" ? (
          <div className="p-6 space-y-4">
            {error && <div className="text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Admin Email</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your admin email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization ID Code</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={verificationPhrase}
                onChange={e => setVerificationPhrase(e.target.value)}
                placeholder="Enter organization ID code"
              />
            </div>
            <button
              onClick={startReset}
              className="w-full rounded-md px-3 py-2 text-white"
              style={{ background: "linear-gradient(90deg,#6D28D9,#4F46E5,#2563EB)" }}
            >
              Send Reset Code
            </button>
            <div className="text-center">
              <Link to="/admin/login" className="text-sm text-gray-600 hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {error && <div className="text-sm text-red-700">{error}</div>}
            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md">
              Check your server logs for the OTP code. You'll also need the admin verification phrase.
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">OTP Code</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="6-digit code from server logs"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Verification Phrase</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={verificationPhrase}
                onChange={e => setVerificationPhrase(e.target.value)}
                placeholder="Admin verification phrase"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 12 characters"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            
            <button
              onClick={completeReset}
              className="w-full rounded-md px-3 py-2 text-white"
              style={{ background: "linear-gradient(90deg,#6D28D9,#4F46E5,#2563EB)" }}
            >
              Reset Password
            </button>
            
            <div className="text-center">
              <Link to="/admin/login" className="text-sm text-gray-600 hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
