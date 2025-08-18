
import { useEffect, useState } from "react";

export default function Overview(){
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrgs: 0,
    totalRevenue: 0,
    systemHealth: "good"
  });

  useEffect(()=>{
    // Fetch real stats from new API endpoints
    Promise.all([
      fetch('/api/admin/users', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/organizations', { credentials: 'include' }).then(r => r.json())
    ]).then(([usersData, orgsData]) => {
      setStats({
        totalUsers: usersData.users?.length || 0,
        activeOrgs: orgsData.organizations?.length || 0,
        totalRevenue: 125000, // TODO: fetch from billing API
        systemHealth: "good"
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-semibold">{stats.totalUsers}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Active Orgs</div>
          <div className="text-2xl font-semibold">{stats.activeOrgs}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-semibold">${stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">System Health</div>
          <div className="text-2xl font-semibold capitalize">{stats.systemHealth}</div>
        </div>
      </div>
      
      <div className="border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>System initialized with admin account</span>
            <span className="text-sm text-gray-500">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
