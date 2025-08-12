
import React, { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  role: 'admin'|'staff'|'customer';
  is_active: boolean;
  privileges: string[];
  allowed_payment_methods: string[];
};

async function jfetch(url: string, opts: RequestInit = {}) {
  const r = await fetch(url, { headers: { 'Content-Type':'application/json' }, ...opts });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export default function AccessControlCenter() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await jfetch('/api/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (u: User) => {
    try {
      await jfetch(`/api/admin/users/${u.id}/access`, {
        method:'POST',
        body: JSON.stringify({ isActive: !u.is_active })
      });
      load();
    } catch (error) {
      console.error('Failed to toggle user active status:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Access Control</h2>
      {loading ? <div>Loading…</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Active</th>
                <th className="p-2 border">Payments</th>
                <th className="p-2 border">Privileges</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 border">{u.email}</td>
                  <td className="text-center py-2 px-2 border">{u.role}</td>
                  <td className="text-center py-2 px-2 border">{u.is_active ? 'Yes' : 'No'}</td>
                  <td className="text-center py-2 px-2 border">{u.allowed_payment_methods.join(', ')}</td>
                  <td className="text-center py-2 px-2 border">{u.privileges.join(', ')}</td>
                  <td className="text-center py-2 px-2 border">
                    <button 
                      className="px-2 py-1 border rounded bg-white hover:bg-gray-50" 
                      onClick={()=>toggleActive(u)}
                    >
                      {u.is_active ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
