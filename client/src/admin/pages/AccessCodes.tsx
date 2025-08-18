
import { useEffect, useState } from "react";

type Code = { id:number; code:string; email?:string; orgId?:number; role?:string; maxUses:number; usedCount:number; createdAt:string; expiresAt?:string; };
export default function AccessCodes(){
  const [rows,setRows]=useState<Code[]>([]);

  function load(){ 
    fetch('/api/admin/access-codes', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setRows(d.accessCodes || []))
      .catch(console.error);
  }
  useEffect(()=>{ load(); },[]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Access Codes</h2>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="p-2 text-left">Code</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Max Uses</th><th className="p-2">Used</th><th className="p-2">Created</th></tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t">
                <td className="p-2 text-left font-mono">{r.code}</td>
                <td className="p-2">{r.email||"—"}</td>
                <td className="p-2">{r.role||"customer"}</td>
                <td className="p-2">{r.maxUses}</td>
                <td className="p-2">{r.usedCount}</td>
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
