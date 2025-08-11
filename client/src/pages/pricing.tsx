import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { apiJSON } from "@/lib/http";

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  createdAt: string;
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const { data: packages = [], isLoading, error } = useQuery({
    queryKey: ['packages'],
    queryFn: () => apiJSON<Package[]>('GET', '/api/packages'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-lg">Loading packages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading packages</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scale your call center operations with our flexible pricing options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`relative ${selectedPlan === pkg.name ? 'ring-2 ring-blue-500' : ''}`}>
              {pkg.name.toLowerCase().includes('pro') && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-bold">${pkg.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    Real-time analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    CRM integrations
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    24/7 support
                  </li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={selectedPlan === pkg.name ? "default" : "outline"}
                  onClick={() => setSelectedPlan(pkg.name)}
                >
                  {selectedPlan === pkg.name ? "Selected" : "Choose Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs.
          </p>
        </div>
      </main>
    </div>
  );
}
