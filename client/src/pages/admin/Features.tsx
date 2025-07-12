
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function AdminFeatures() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Settings className="w-8 h-8 mr-3" />
          Feature Management
        </h1>
        <p className="text-white/70 mt-2">
          Control feature flags for all customers.
        </p>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/70">
            Feature flag management interface coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
