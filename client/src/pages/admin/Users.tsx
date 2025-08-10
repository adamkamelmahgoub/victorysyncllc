
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

export function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <UserCog className="w-8 h-8 mr-3" />
          User Management
        </h1>
        <p className="text-white/70 mt-2">
          Manage all users across all customer accounts.
        </p>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/70">
            User management interface coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
