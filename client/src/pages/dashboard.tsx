import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFeatures } from '@/hooks/useFeatures';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { QuickActions } from '@/components/QuickActions';
import { KPITracker } from '@/components/KPITracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Users, 
  MessageSquare, 
  Settings,
  Calendar,
  FileText,
  Shield
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: enabledFeatures = [], isLoading: featuresLoading } = useFeatures(user?.id);
  const [kpiTrackerOpen, setKpiTrackerOpen] = useState(false);

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  const isFeatureEnabled = (feature: string) => enabledFeatures.includes(feature);

  const accountActions = [
    {
      title: 'Billing & Subscription',
      description: 'Manage your plan, payment methods, and billing history',
      icon: CreditCard,
      href: '/dashboard/billing',
      enabled: isFeatureEnabled('billing')
    },
    {
      title: 'Team Members',
      description: 'Invite team members and manage permissions',
      icon: Users,
      href: '/dashboard/team',
      enabled: isFeatureEnabled('team_members')
    },
    {
      title: 'Support Tickets',
      description: 'View and manage your support requests',
      icon: MessageSquare,
      href: '/dashboard/support',
      enabled: isFeatureEnabled('support_tickets')
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and account preferences',
      icon: Settings,
      href: '/dashboard/settings',
      enabled: true
    },
    {
      title: 'Scheduled Reports',
      description: 'Configure automated reports and notifications',
      icon: Calendar,
      href: '/dashboard/reports',
      enabled: isFeatureEnabled('scheduled_reports')
    },
    {
      title: 'API Documentation',
      description: 'Access API keys and integration documentation',
      icon: FileText,
      href: '/dashboard/api',
      enabled: isFeatureEnabled('api_access')
    },
    {
      title: 'Security Settings',
      description: 'Manage two-factor authentication and security',
      icon: Shield,
      href: '/dashboard/security',
      enabled: isFeatureEnabled('security_settings')
    }
  ];

  const enabledActions = accountActions.filter(action => action.enabled);

  return (
    <DashboardLayout 
      sidebar={
        !featuresLoading && (
          <QuickActions 
            enabledFeatures={enabledFeatures}
            onKPITrackerOpen={() => setKpiTrackerOpen(true)}
          />
        )
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'there'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your VictorySync account and services from your dashboard.
          </p>
        </div>

        {/* Account Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enabledActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <action.icon className="w-5 h-5 mr-3 text-purple-600" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = action.href}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-center py-8">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>

      <KPITracker 
        isOpen={kpiTrackerOpen}
        onClose={() => setKpiTrackerOpen(false)}
      />
    </DashboardLayout>
  );
}