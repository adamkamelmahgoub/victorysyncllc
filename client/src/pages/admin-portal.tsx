
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
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const result = await api('/admin/users');
      setUsers(result);
      setError('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(user: UserRow) {
    setSaving(user.id);
    try {
      await api(`/admin/users/${user.id}/policy`, {
        method: 'POST',
        body: JSON.stringify({
          can_use_api: user.can_use_api,
          can_manage_org: user.can_manage_org,
          can_view_billing: user.can_view_billing,
          integrations: user.integrations,
          allow_card: user.allow_card,
          allow_paypal: user.allow_paypal,
          allow_wire: user.allow_wire,
          is_active: user.is_active
        })
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  if (error && /Unauthenticated|Invalid session|Forbidden/i.test(error)) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Portal</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 mb-2">Authentication required</p>
          <a 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            href="/login"
          >
            Sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
        <p className="text-gray-600 mt-2">Manage user permissions, integrations, and payment policies</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading users...</span>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="space-y-6">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.phone} • {user.org_name || 'No organization'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    {user.email_verified && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Email ✓
                      </span>
                    )}
                    {user.phone_verified && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Phone ✓
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => save(user)}
                  disabled={saving === user.id}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving === user.id ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.can_use_api}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, can_use_api: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">API Access</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.can_manage_org}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, can_manage_org: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Manage Org</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.can_view_billing}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, can_view_billing: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">View Billing</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.is_active}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, is_active: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Account Active</span>
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Payment Methods</h4>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.allow_card}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, allow_card: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Credit Card</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.allow_paypal}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, allow_paypal: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">PayPal</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.allow_wire}
                      onChange={e => setUsers(prev => prev.map(u => 
                        u.id === user.id ? { ...u, allow_wire: e.target.checked } : u
                      ))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Wire Transfer</span>
                  </label>
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Integration Access</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {['hubspot', 'salesforce', 'zohocrm', 'five9', 'talkdesk', 'gohighlevel'].map(integration => (
                    <label key={integration} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!user.integrations?.[integration]}
                        onChange={e => setUsers(prev => prev.map(u => 
                          u.id === user.id ? { 
                            ...u, 
                            integrations: { 
                              ...u.integrations, 
                              [integration]: e.target.checked 
                            } 
                          } : u
                        ))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize">{integration}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !error.match(/Unauthenticated|Invalid session|Forbidden/i) && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </main>
  );
}
