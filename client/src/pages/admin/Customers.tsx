
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, Plus } from 'lucide-react';

export function AdminCustomers() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/api/admin/customers'],
    queryFn: async () => {
      const token = localStorage.getItem('vs_admin_token');
      const response = await fetch('/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Users className="w-8 h-8 mr-3" />
            Customer Management
          </h1>
          <p className="text-white/70 mt-2">
            Manage all customer accounts and their settings.
          </p>
        </div>
        <Button className="bg-white text-gray-900 hover:bg-gray-100">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-white/70">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              No customers found.
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer: any) => (
                <div 
                  key={customer.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{customer.name}</h3>
                      <p className="text-white/70 text-sm">{customer.email}</p>
                      <p className="text-white/50 text-xs">
                        Joined {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {customer.plan || 'Starter'}
                      </Badge>
                      <Button size="sm" variant="outline" className="text-white border-white/20">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
