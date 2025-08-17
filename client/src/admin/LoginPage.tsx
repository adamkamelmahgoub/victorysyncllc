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

      // Ensure we only parse JSON; on HTML/other, show generic message
      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      if (!res.ok) {
        const message = isJson ? (await res.json()).error || "Login failed" : "Login failed";
        throw new Error(message);
      }

      const data = isJson ? await res.json() : null;
      if (!data?.token) throw new Error("Login failed");
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
        {err ? (
          <div className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">
            {err}
          </div>
        ) : null}
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
        <div className="text-right mt-3">
            <a className="text-sm underline" href="/admin/forgot">Forgot password?</a>
          </div>
      </form>
    </div>
  );
}