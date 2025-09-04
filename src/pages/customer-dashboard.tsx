
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Phone, Users, Clock, TrendingUp, Settings, Bell, FileText } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Total Calls', value: '1,234', change: '+12%', icon: Phone },
    { name: 'Active Agents', value: '8', change: '+2', icon: Users },
    { name: 'Avg Handle Time', value: '3:24', change: '-8%', icon: Clock },
    { name: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', icon: TrendingUp },
  ];

  const recentActivity = [
    { time: '10:30 AM', event: 'Agent training session completed', type: 'training' },
    { time: '09:15 AM', event: 'Quality audit - 98% score achieved', type: 'quality' },
    { time: '08:45 AM', event: 'New campaign launched: Product Support', type: 'campaign' },
    { time: '08:00 AM', event: 'Daily team briefing conducted', type: 'meeting' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Customer'}
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your VictorySync operations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'reports', name: 'Reports', icon: FileText },
              { id: 'settings', name: 'Settings', icon: Settings },
              { id: 'notifications', name: 'Notifications', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-4">
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.event}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs (Placeholder Content) */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-600">
              This section is coming soon. Contact your account manager for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
