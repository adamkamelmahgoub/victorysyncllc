
import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';

type UserRow = {
  id:string; email:string; phone:string; full_name:string; role:string; is_active:boolean;
  email_verified:boolean; phone_verified:boolean; org_name:string|null;
  can_use_api:boolean; can_manage_org:boolean; can_view_billing:boolean; integrations:Record<string,boolean>;
  allow_card:boolean; allow_paypal:boolean; allow_wire:boolean;
};

export default function AdminPortal(){
  const [users,setUsers] = useState<UserRow[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  async function load(){
    try{ 
      setLoading(true); 
      const userData = await api('/admin/users'); 
      setUsers(userData.map((u: any) => ({
        ...u,
        integrations: u.integrations || {}
      })));
    } catch(e:any){ 
      setError(e.message); 
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(()=>{ load(); },[]);

  async function save(u:UserRow){
    setSaving(u.id);
    try {
      await api(`/admin/users/${u.id}/policy`,{
        method:'POST',
        body:JSON.stringify({
          can_use_api:u.can_use_api, 
          can_manage_org:u.can_manage_org, 
          can_view_billing:u.can_view_billing,
          integrations:u.integrations, 
          allow_card:u.allow_card, 
          allow_paypal:u.allow_paypal, 
          allow_wire:u.allow_wire,
          is_active:u.is_active
        })
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>
      {loading && <p className="text-gray-600">Loading users...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && users.length === 0 && <p className="text-gray-600">No users found.</p>}
      {!loading && users.map(u=>(
        <div key={u.id} className="rounded border p-6 mb-4 bg-white shadow-sm">
          <div className="font-semibold text-lg mb-2">
            {u.full_name} 
            <span className="text-gray-500 font-normal ml-2">({u.email})</span>
            {u.org_name && <span className="text-blue-600 font-normal ml-2">— {u.org_name}</span>}
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.can_use_api} 
                  onChange={e=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x,can_use_api:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">API Access</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.can_manage_org} 
                  onChange={e=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x,can_manage_org:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">Manage Org</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.can_view_billing} 
                  onChange={e=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x,can_view_billing:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">View Billing</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.is_active} 
                  onChange={e=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x,is_active:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Payment Methods</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.allow_card} 
                  onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,allow_card:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">Card</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.allow_paypal} 
                  onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,allow_paypal:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">PayPal</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={u.allow_wire} 
                  onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,allow_wire:e.target.checked}:x))}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm">Wire Transfer</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Integrations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['hubspot','salesforce','zohocrm','five9','talkdesk','gohighlevel'].map(k=>(
                <label key={k} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={!!u.integrations?.[k]} 
                    onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,integrations:{...x.integrations,[k]:e.target.checked}}:x))}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm capitalize">{k}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={()=>save(u)}
            disabled={saving === u.id}
          >
            {saving === u.id ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ))}
    </main>
  );
}
