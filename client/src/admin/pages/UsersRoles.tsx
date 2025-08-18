
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";

type UserRow = { id:string; email:string; role:string; org?:string; createdAt:string; };
export default function UsersRoles(){
  const token = localStorage.getItem("vs_token")||"";
  const [rows,setRows]=useState<UserRow[]>([]);
  const [email,setEmail]=useState(""); const [role,setRole]=useState("customer"); const [org,setOrg]=useState("");
  const roles = ["superAdmin","admin","manager","agent","customer"];

  function load(){ apiRequest<{users:UserRow[]}>("/api/admin/users",{ token }).then(d=>setRows(d.users)); }
  useEffect(()=>{ load(); },[]);

  async function changeRole(id:string, role:string){
    await apiRequest("/api/admin/users/"+id,{ method:"PATCH", token, body:{ role }});
    load();
  }
  async function invite(){
    await apiRequest("/api/admin/invite",{ method:"POST", token, body:{ email, role, org:org||undefined }});
    setEmail(""); setOrg(""); setRole("customer");
    alert("Invite created (access code logged in server file store).");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Users & Roles</h2>
      <div className="border rounded-xl p-4 space-y-2">
        <div className="text-sm font-medium">Invite with Access Code</div>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded-md px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Org (optional)" value={org} onChange={e=>setOrg(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
            {roles.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={invite} className="rounded-md px-3 py-2 text-white" style={{background:"linear-gradient(90deg,#6D28D9,#4F46E5,#2563EB)"}}>Create Code</button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="p-2 text-left">Email</th><th className="p-2">Role</th><th className="p-2">Org</th><th className="p-2">Created</th></tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t">
                <td className="p-2 text-left">{r.email}</td>
                <td className="p-2">
                  <select className="border rounded-md px-2 py-1" value={r.role} onChange={e=>changeRole(r.id, e.target.value)}>
                    {roles.map(x=><option key={x} value={x}>{x}</option>)}
                  </select>
                </td>
                <td className="p-2">{r.org||"—"}</td>
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
