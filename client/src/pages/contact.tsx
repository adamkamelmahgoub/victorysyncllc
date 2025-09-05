import { FormEvent, useState } from "react";
import { apiRequest } from "../lib/api";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | string>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      message: String(form.get("message") || ""),
    };
    setLoading(true);
    setOk(null);
    try {
      await apiRequest("POST", "/contact", payload);
      setOk("Thanks! We'll reach out shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setOk(err.message || "Something went wrong.");
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Get a tailored demo</h1>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-slate-200 p-6 bg-white">
        <Input name="name" label="Full name" required />
        <Input name="email" label="Work email" type="email" required />
        <Input name="company" label="Company" required />
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">What are you looking to solve?</span>
          <textarea name="message" required rows={5}
            className="rounded-xl border border-slate-300 px-3 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
        </label>
        <Button disabled={loading}>{loading ? "Sending…" : "Request Demo"}</Button>
        {ok && <div className="text-sm text-slate-700">{ok}</div>}
      </form>
    </div>
  );
}