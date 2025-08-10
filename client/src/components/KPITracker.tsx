
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPITrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KPIMetric {
  name: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  source?: string;
}

export function KPITracker({ isOpen, onClose }: KPITrackerProps) {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return response.json();
    },
    enabled: isOpen,
  });

  const renderTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KPI Tracker</DialogTitle>
        </DialogHeader>
        
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {error && (
          <Alert>
            <AlertDescription>
              Failed to load KPI data. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        {metrics && (
          <>
            {metrics.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {metrics.message || "No integrations configured. Connect a CRM or dialer to see live KPIs."}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric: KPIMetric, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        {metric.name}
                        {renderTrendIcon(metric.trend)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      {metric.change && (
                        <div className={`text-sm ${
                          metric.change > 0 ? 'text-green-600' : 
                          metric.change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </div>
                      )}
                      {metric.source && (
                        <div className="text-xs text-gray-400 mt-1">
                          from {metric.source}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
