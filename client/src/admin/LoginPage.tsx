
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./auth";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@victorysync.com");
  const [password, setPassword] = useState("victorysync2025");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!data?.token) throw new Error("Missing token");
      setToken(data.token);
      nav("/admin/overview", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white text-slate-900">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border px-6 py-6 shadow-sm space-y-4"
      >
        <h1 className="text-lg font-semibold">Sign in to VictorySync Admin</h1>
        {err ? <div className="text-red-600 text-sm">{err}</div> : null}
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button
          disabled={loading}
          className="w-full rounded-md px-3 py-2 font-medium bg-slate-900 text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
