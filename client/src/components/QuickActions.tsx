
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Settings, 
  CreditCard, 
  Users, 
  MessageSquare,
  Zap
} from 'lucide-react';

interface QuickActionsProps {
  enabledFeatures: string[];
  onKPITrackerOpen: () => void;
}

export function QuickActions({ enabledFeatures, onKPITrackerOpen }: QuickActionsProps) {
  const isFeatureEnabled = (feature: string) => enabledFeatures.includes(feature);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isFeatureEnabled('kpi_tracker') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onKPITrackerOpen}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View KPIs
          </Button>
        )}
        
        {isFeatureEnabled('integrations') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/settings/integrations'}
          >
            <Zap className="w-4 h-4 mr-2" />
            Manage Integrations
          </Button>
        )}
        
        {isFeatureEnabled('billing') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/billing'}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Billing & Plans
          </Button>
        )}
        
        {isFeatureEnabled('team_members') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/team'}
          >
            <Users className="w-4 h-4 mr-2" />
            Team Members
          </Button>
        )}
        
        {isFeatureEnabled('support_tickets') && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/support'}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Support Tickets
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => window.location.href = '/dashboard/settings'}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </CardContent>
    </Card>
  );
}
