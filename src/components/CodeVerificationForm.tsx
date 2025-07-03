import { useState } from "react";

export default function CodeVerificationForm({
  email,
  type,
}: {
  email: string;
  type: "signup" | "login";
}) {
  const [code, setCode] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (data.verified) {
      if (type === "signup") {
        window.location.href = "/complete-signup";
      } else {
        window.location.href = "/customer-dashboard";
      }
    } else {
      alert("Invalid or expired code");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input
        type="text"
        placeholder="Enter the 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        required
      />
      <button type="submit">Verify Code</button>
    </form>
  );
}
