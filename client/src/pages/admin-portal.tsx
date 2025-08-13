import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';

type UserRow = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  org_name: string | null;
  can_use_api: boolean;
  can_manage_org: boolean;
  can_view_billing: boolean;
  integrations: Record<string, boolean>;
  allow_card: boolean;
  allow_paypal: boolean;
  allow_wire: boolean;
};

export default function AdminPortal() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setUsers(await api('/admin/users'));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(u: UserRow) {
    await api(`/admin/users/${u.id}/policy`, {
      method: 'POST',
      body: JSON.stringify({
        can_use_api: u.can_use_api,
        can_manage_org: u.can_manage_org,
        can_view_billing: u.can_view_billing,
        integrations: u.integrations,
        allow_card: u.allow_card,
        allow_paypal: u.allow_paypal,
        allow_wire: u.allow_wire,
        is_active: u.is_active
      })
    });
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Portal</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && users.map(u => (
        <div key={u.id} className="rounded border p-4 mb-3 bg-white">
          <div className="font-medium">
            {u.full_name} <span className="text-gray-500">({u.email})</span> — {u.org_name || 'No org'}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.can_use_api}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, can_use_api: e.target.checked } : x))}
              />
              API
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.can_manage_org}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, can_manage_org: e.target.checked } : x))}
              />
              Manage Org
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.can_view_billing}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, can_view_billing: e.target.checked } : x))}
              />
              View Billing
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.is_active}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, is_active: e.target.checked } : x))}
              />
              Active
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 my-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.allow_card}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, allow_card: e.target.checked } : x))}
              />
              Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.allow_paypal}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, allow_paypal: e.target.checked } : x))}
              />
              PayPal
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={u.allow_wire}
                onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, allow_wire: e.target.checked } : x))}
              />
              Wire
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3">
            {['hubspot', 'salesforce', 'zohocrm', 'five9', 'talkdesk', 'gohighlevel'].map(k => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!u.integrations?.[k]}
                  onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, integrations: { ...x.integrations, [k]: e.target.checked } } : x))}
                />
                {k}
              </label>
            ))}
          </div>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={() => save(u)}
          >
            Save
          </button>
        </div>
      ))}
    </main>
  );
}