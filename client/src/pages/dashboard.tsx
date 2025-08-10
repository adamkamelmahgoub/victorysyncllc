import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFeatures } from '@/hooks/useFeatures';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { QuickActions } from '@/components/QuickActions';
import { KPITracker } from '@/components/KPITracker';
import { DashboardOverview } from './dashboard/Overview';
import { TeamUsers } from './dashboard/TeamUsers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Zap, 
  CreditCard, 
  MessageSquare 
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: enabledFeatures = [], isLoading: featuresLoading } = useFeatures(user?.id);
  const [kpiTrackerOpen, setKpiTrackerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  const isFeatureEnabled = (feature: string) => enabledFeatures.includes(feature);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      enabled: true,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Zap,
      enabled: isFeatureEnabled('integrations'),
    },
    {
      id: 'team',
      label: 'Team & Users',
      icon: Users,
      enabled: isFeatureEnabled('team_members'),
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      enabled: isFeatureEnabled('billing'),
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageSquare,
      enabled: isFeatureEnabled('support_tickets'),
    },
  ];

  const enabledTabs = tabs.filter(tab => tab.enabled);

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          {enabledTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="integrations">
          <div className="text-center py-8">
            <p className="text-gray-500">
              Integrations management - coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <TeamUsers />
        </TabsContent>

        <TabsContent value="billing">
          <div className="text-center py-8">
            <p className="text-gray-500">
              Billing management - coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="text-center py-8">
            <p className="text-gray-500">
              Support center - coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <KPITracker 
        isOpen={kpiTrackerOpen}
        onClose={() => setKpiTrackerOpen(false)}
      />
    </DashboardLayout>
  );
}