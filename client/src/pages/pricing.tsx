import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type PlanId = 'starter' | 'growth' | 'scale';

const plans: { id: PlanId; name: string; price: number; bullets: string[]; popular?: boolean }[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1200,
    bullets: [
      '1 Dedicated Agent',
      'Business Hours Support',
      'Basic CRM Integration',
      'Email Support',
      'Monthly Reports'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 2500,
    popular: true,
    bullets: [
      '2 Dedicated Agents',
      'Extended Hours Support',
      'Appointment Setting',
      'Advanced CRM Integration',
      'Live Chat Support',
      'Weekly Reports'
    ]
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 4500,
    bullets: [
      '24/7 Blended Team',
      'AI Automation Suite',
      'Dedicated Success Manager',
      'Custom Integrations',
      'Priority Support',
      'Real-time Analytics'
    ]
  }
];

async function startCheckout(planId: PlanId) {
  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ planId })
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || 'Checkout failed');
  }
  const { url } = await res.json();
  window.location.href = url;
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Scale your business with VictorySync</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(plan => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-[#6950f0] shadow-lg' : 'shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#6950f0] text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-3xl font-bold text-gray-900 mt-4">
                  ${plan.price.toLocaleString()}
                  <span className="text-base font-medium text-gray-600">/month</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.bullets.map(bullet => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 text-base font-medium ${
                    plan.popular 
                      ? 'bg-[#6950f0] hover:bg-[#5d4cdb] text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={() => startCheckout(plan.id)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include our core features and 24/7 support. 
            <br />
            Upgrade or downgrade anytime.
          </p>
        </div>
      </div>
    </div>
  );
}