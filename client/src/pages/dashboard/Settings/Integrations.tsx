
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ConnectIntegrationModal } from '@/components/ConnectIntegrationModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Settings, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Integration {
  id: number;
  type: string;
  name: string;
  status: 'connected' | 'error' | 'expired';
  created_at: string;
  last_sync?: string;
}

export default function IntegrationsSettings() {
  const { user, isAuthenticated } = useAuth();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['/api/integrations'],
    queryFn: async () => {
      const response = await fetch('/api/integrations');
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const { data: availableIntegrations = [] } = useQuery({
    queryKey: ['/api/integrations/available'],
    queryFn: async () => {
      const response = await fetch('/api/integrations/available');
      if (!response.ok) throw new Error('Failed to fetch available integrations');
      return response.json();
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (integrationId: number) => {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to disconnect integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async (integrationId: number) => {
      const response = await fetch(`/api/integrations/${integrationId}/refresh`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to refresh integration');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
  });

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      case 'expired':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-2">
              Connect your CRM and dialer platforms to sync data with VictorySync.
            </p>
          </div>
          <Button onClick={() => setConnectModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>

        {/* Connected Integrations */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">Loading integrations...</div>
            </CardContent>
          </Card>
        ) : integrations.length === 0 ? (
          <Alert>
            <AlertDescription>
              No integrations connected yet. Click "Add Integration" to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration: Integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {integration.name}
                    </CardTitle>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <div>Connected: {new Date(integration.created_at).toLocaleDateString()}</div>
                      {integration.last_sync && (
                        <div>Last sync: {new Date(integration.last_sync).toLocaleString()}</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshMutation.mutate(integration.id)}
                        disabled={refreshMutation.isPending}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/integrations/${integration.id}/settings`}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Settings
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => disconnectMutation.mutate(integration.id)}
                        disabled={disconnectMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Available Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Available Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableIntegrations.map((integration: any) => (
                <div 
                  key={integration.type}
                  className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setConnectModalOpen(true)}
                >
                  <div className="text-lg font-semibold mb-1">{integration.name}</div>
                  <div className="text-sm text-gray-600">
                    {integration.connected ? 'Connected' : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConnectIntegrationModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </DashboardLayout>
  );
}
