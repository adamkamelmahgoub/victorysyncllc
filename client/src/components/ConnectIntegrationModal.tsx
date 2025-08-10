
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Zap, Phone, Users } from 'lucide-react';

interface Integration {
  type: string;
  name: string;
}

interface ConnectIntegrationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConnectIntegrationModal({ open, onClose }: ConnectIntegrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState<string | null>(null);

  const { data: availableIntegrations = [] } = useQuery<Integration[]>({
    queryKey: ['/api/integrations/available'],
  });

  const { data: connectedIntegrations = [] } = useQuery<any[]>({
    queryKey: ['/api/integrations'],
  });

  const connectMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await fetch(`/api/integrations/${type}/connect`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to get OAuth URL');
      return response.json();
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast({
        title: 'Connection Error',
        description: 'Failed to initiate integration connection',
        variant: 'destructive'
      });
      setConnecting(null);
    }
  });

  const handleConnect = (type: string) => {
    setConnecting(type);
    connectMutation.mutate(type);
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'hubspot': return <Users className="w-8 h-8 text-orange-500" />;
      case 'five9': return <Phone className="w-8 h-8 text-blue-500" />;
      default: return <Zap className="w-8 h-8 text-purple-500" />;
    }
  };

  const isConnected = (type: string) => {
    return connectedIntegrations.some(integration => 
      integration.type === type && integration.is_active
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Connect Your Tools</DialogTitle>
          <DialogDescription>
            Connect your CRM and dialer tools to see live KPIs and metrics in your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.type} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  {getIntegrationIcon(integration.type)}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>
                      {integration.type === 'hubspot' && 'CRM & Marketing Platform'}
                      {integration.type === 'five9' && 'Cloud Contact Center'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isConnected(integration.type) ? (
                  <Button disabled className="w-full">
                    ✓ Connected
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(integration.type)}
                    disabled={connecting === integration.type}
                    className="w-full"
                  >
                    {connecting === integration.type ? (
                      'Connecting...'
                    ) : (
                      <>
                        Connect {integration.name}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Why Connect Integrations?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• View real-time KPIs and performance metrics</li>
            <li>• Get insights across all your customer touchpoints</li>
            <li>• Monitor team performance and optimization opportunities</li>
            <li>• Make data-driven decisions with unified reporting</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
