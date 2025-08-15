
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignIn(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  
  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form className="space-y-3" onSubmit={e=>{e.preventDefault(); navigate("/");}}>
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 rounded bg-black text-white">Sign In</button>
      </form>
      <div className="mt-4 text-sm">Have an access code? <Link className="underline" to="/signup">Create your account</Link></div>
    </section>
  );
}
