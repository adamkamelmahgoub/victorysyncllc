
import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "@/lib/apiRequest";
import "./admin.css";

export default function AdminLogin(){
  const nav = useNavigate();
  const [email,setEmail]=useState("admin@victorysync.com");
  const [password,setPassword]=useState("victorysync2025");
  const [err,setErr]=useState<string|null>(null);

  async function submit(e:FormEvent){
    e.preventDefault(); setErr(null);
    try{
      const { token } = await apiRequest<{token:string}>("/api/auth/login",{ method:"POST", body:{ email, password }});
      localStorage.setItem("vs_token", token);
      nav("/admin/overview");
    }catch(e:any){ setErr(e.message); }
  }

  return (
    <div className="vs-admin min-h-screen grid place-items-center">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow border">
        <div className="vs-gradient p-5 text-white">
          <h1 className="text-xl font-semibold">Sign in to VictorySync Admin</h1>
        </div>
        <form onSubmit={submit} className="p-6 space-y-3">
          {err && <div className="text-sm text-red-700">{err}</div>}
          <input className="w-full border rounded-md px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input type="password" className="w-full border rounded-md px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          <button className="w-full rounded-md px-3 py-2 text-white" style={{background:"linear-gradient(90deg,#6D28D9,#4F46E5,#2563EB)"}}>Sign In</button>
          <div className="flex justify-between text-sm">
            <Link to="/register" className="underline">Customer Sign Up</Link>
            <Link to="/admin/forgot" className="underline">Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
