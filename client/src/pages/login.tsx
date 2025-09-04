
import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@victorysync.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation() as any;
  const redirect = loc.state?.from || "/customer-dashboard";

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true);
    await login(email, password); nav(redirect, { replace: true });
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-md px-4">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="text-sm">Email
            <input className="mt-1 w-full rounded border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </label>
          <label className="text-sm">Password
            <input type="password" className="mt-1 w-full rounded border px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
          </label>
          <button disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 transition">{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </section>
  );
}
