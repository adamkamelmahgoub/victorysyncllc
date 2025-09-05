
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    await register(email, password);
    nav("/login");
  }
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Create an account</h1>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-slate-200 p-6 bg-white">
        <Input label="Email" type="email" name="email" required />
        <Input label="Password" type="password" name="password" required />
        <Button disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
      </form>
    </div>
  );
}
