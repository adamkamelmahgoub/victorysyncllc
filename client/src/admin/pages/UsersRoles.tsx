
import { useEffect, useState } from "react";

type UserRow = { id:number; email:string; role:string; orgId?:number; fullName:string; createdAt:string; };
export default function UsersRoles(){
  const [rows,setRows]=useState<UserRow[]>([]);
  const [email,setEmail]=useState(""); const [role,setRole]=useState("customer"); const [fullName,setFullName]=useState("");
  const roles = ["superAdmin","admin","manager","agent","customer"];

  function load(){ 
    fetch('/api/admin/users', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setRows(d.users || []))
      .catch(console.error);
  }
  useEffect(()=>{ load(); },[]);

  async function changeRole(id:number, role:string){
    await fetch(`/api/admin/users/${id}`, { 
      method: 'PATCH', 
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    load();
  }

  async function createAccessCode(){
    if(!email || !fullName) return alert('Email and full name required');
    const code = 'VS-' + Math.random().toString(36).slice(2,8).toUpperCase();
    await fetch('/api/admin/access-codes', { 
      method: 'POST', 
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        orgId: 1, // TODO: get from current user context
        code, 
        role, 
        maxUses: 1, 
        email, 
        fullName 
      })
    });
    setEmail(""); setFullName(""); setRole("customer");
    alert(`Access code created: ${code}`);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Users & Roles</h2>
      <div className="border rounded-xl p-4 space-y-2">
        <div className="text-sm font-medium">Create Access Code</div>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded-md px-3 py-2" placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
            {roles.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={createAccessCode} className="rounded-md px-3 py-2 text-white" style={{background:"linear-gradient(90deg,#6D28D9,#4F46E5,#2563EB)"}}>Create Code</button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2">Role</th><th className="p-2">Org ID</th><th className="p-2">Created</th></tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t">
                <td className="p-2 text-left">{r.fullName}</td>
                <td className="p-2 text-left">{r.email}</td>
                <td className="p-2">
                  <select className="border rounded-md px-2 py-1" value={r.role} onChange={e=>changeRole(r.id, e.target.value)}>
                    {roles.map(x=><option key={x} value={x}>{x}</option>)}
                  </select>
                </td>
                <td className="p-2">{r.orgId||"—"}</td>
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
