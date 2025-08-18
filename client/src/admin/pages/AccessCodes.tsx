
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";

type Code = { code:string; email?:string; org?:string; role?:string; maxUses:number; usedCount:number; isActive:boolean; createdAt:string; expiresAt?:string; };
export default function AccessCodes(){
  const token = localStorage.getItem("vs_token")||"";
  const [rows,setRows]=useState<Code[]>([]);
  const [edit,setEdit]=useState<Record<string,{maxUses:number;isActive:boolean}>>({});

  function load(){ apiRequest<{codes:Code[]}>("/api/access-codes",{ token }).then(d=>setRows(d.codes)); }
  useEffect(()=>{ load(); },[]);

  async function patch(code:string){
    const c = edit[code]; if(!c) return;
    await apiRequest("/api/access-codes/"+code,{ method:"PATCH", token, body:{ maxUses:c.maxUses, isActive:c.isActive }});
    setEdit(s=>{ const n={...s}; delete n[code]; return n; });
    load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Access Codes</h2>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="p-2 text-left">Code</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Max</th><th className="p-2">Used</th><th className="p-2">Active</th><th className="p-2">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map(r=>{
              const e = edit[r.code] ?? { maxUses:r.maxUses, isActive:r.isActive };
              return (
                <tr key={r.code} className="border-t">
                  <td className="p-2 text-left">{r.code}</td>
                  <td className="p-2">{r.email||"—"}</td>
                  <td className="p-2">{r.role||"customer"}</td>
                  <td className="p-2"><input type="number" className="w-20 border rounded-md px-2 py-1" value={e.maxUses} onChange={ev=>setEdit(s=>({...s,[r.code]:{...e,maxUses:Number(ev.target.value)}}))} /></td>
                  <td className="p-2">{r.usedCount}</td>
                  <td className="p-2">
                    <input type="checkbox" checked={e.isActive} onChange={ev=>setEdit(s=>({...s,[r.code]:{...e,isActive:ev.target.checked}}))}/>
                  </td>
                  <td className="p-2">
                    <button onClick={()=>patch(r.code)} className="rounded-md px-3 py-1 text-white" style={{background:"linear-gradient(90deg,#6D28D9,#4F46E5,#2563EB)"}}>Save</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
