
import { useState, useEffect } from "react"

export default function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrgs: 0,
    totalRevenue: 0,
    systemHealth: "good"
  })

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalUsers: 150,
      activeOrgs: 45,
      totalRevenue: 125000,
      systemHealth: "good"
    })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Active Orgs</h3>
          <p className="text-3xl font-bold">{stats.activeOrgs}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">System Health</h3>
          <p className="text-3xl font-bold capitalize">{stats.systemHealth}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>New user registration: john@example.com</span>
            <span className="text-sm text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Payment received: $299</span>
            <span className="text-sm text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>New organization created: TechCorp</span>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";

export default function Overview(){
  const [kpi,setKpi]=useState<any>(null); const token=localStorage.getItem("vs_token")||"";
  useEffect(()=>{ apiRequest<{kpi:any}>("/api/kpi",{ token }).then(setKpi).catch(()=>setKpi(null)); },[]);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["callsToday","callsThisWeek","callsThisMonth","activeAgents","avgResponseTime","avgHandleTime","customerSatisfaction","resolutionRate","slaCompliance","occupancyRate"].map(key=>(
          <div key={key} className="border rounded-xl p-4">
            <div className="text-sm text-gray-500">{key}</div>
            <div className="text-2xl font-semibold">{kpi?.kpi?.[key] ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
