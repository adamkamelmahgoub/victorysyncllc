
import * as React from "react";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login(): JSX.Element {
  const [form, setForm] = React.useState<LoginForm>({ email: "", password: "" });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // include so the server can set the auth cookie
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!res.ok) {
        const msg = (await res.text()) || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // Go to the customer portal (adjust path if your app uses a different route)
      window.location.assign("/customer-dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 p-6 rounded-xl border"
      >
        <h1 className="text-xl font-semibold">Sign in to VictorySync</h1>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md px-3 py-2 bg-indigo-600 text-white disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
