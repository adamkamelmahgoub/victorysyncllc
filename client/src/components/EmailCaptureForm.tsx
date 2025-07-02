import { useState } from "react";
import CodeVerificationForm from "./CodeVerificationForm";

export default function EmailCaptureForm({ type }: { type: "signup" | "login" }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = type === "signup" ? "/api/send-signup-code" : "/api/send-login-code";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) setStep("code");
    else alert("Error sending verification code");
  };

  return step === "email" ? (
    <form onSubmit={handleEmailSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Verification Code</button>
    </form>
  ) : (
    <CodeVerificationForm email={email} type={type} />
  );
}
