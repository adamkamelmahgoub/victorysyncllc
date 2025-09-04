import { Link } from "wouter";
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
export default function Pricing() {
  const { addItem } = useCart();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['/api/packages'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAddToCart = (pkg: any) => {
    addItem({
      packageId: pkg.id,
      name: pkg.name,
      price: parseFloat(pkg.price),
    });
  };

  // Removed original pricing cards and related sections.
  // Replaced with the new pricing structure.
  const tiers = [
    { name: "Starter", price: "$1,200/mo", bullets: ["1 dedicated agent", "Business hours", "Email/Chat/Voice", "Monthly report"] },
    { name: "Growth", price: "$2,500/mo", bullets: ["2 agents", "Extended hours", "Appointment setting", "Weekly report"] },
    { name: "Scale", price: "$4,500/mo", bullets: ["24/7 blended team", "Automations suite", "Success manager", "Custom reporting"] }
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transparent Pricing Plans
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business needs. No hidden fees, no long-term contracts. Scale up or down as your business grows.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg font-semibold">💰 Save up to 60% compared to US-based services</p>
          </div>
        </div>
      </section>

      {/* New Pricing Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-2 text-slate-600">Add-ons: after-hours, QA program, advanced dashboards, custom integrations.</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {tiers.map(t => (
              <div key={t.name} className="rounded-2xl border p-6 flex flex-col">
                <h3 className="font-semibold">{t.name}</h3>
                <div className="text-3xl font-bold mt-2">{t.price}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {t.bullets.map(b => <li key={b}>• {b}</li>)}
                </ul>
                <a href="/contact" className="mt-6 rounded-lg bg-primary px-4 py-2 text-white text-center hover:bg-primary-600 transition">Get a Demo</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Cost Comparison: VictorySync vs. Traditional Solutions
            </h2>
            <p className="text-xl victory-gray">
              See how much you can save with our New Jersey-based team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-red-600 mb-4">US-Based Agents</h3>
                <div className="text-4xl font-bold text-red-600 mb-4">$18.25/hour</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• High labor costs</p>
                  <p>• Limited availability</p>
                  <p>• Additional overhead</p>
                  <p>• Expensive benefits</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-4">VictorySync (Egypt)</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">$6.25/hour</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 66% cost savings</p>
                  <p>• 24/7 availability</p>
                  <p>• English fluency</p>
                  <p>• Professional quality</p>
                </div>
                <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                  Save $12+ per hour!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              What's Included in Every Plan
            </h2>
            <p className="text-xl victory-gray">
              All plans include our core features and dedicated support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="victory-purple w-8 h-8" />
              </div>
              <h3 className="font-semibold victory-dark mb-2">Quality Assurance</h3>
              <p className="text-sm victory-gray">Continuous monitoring and quality control</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="victory-blue w-8 h-8" />
              </div>
              <h3 className="font-semibold victory-dark mb-2">Dedicated Manager</h3>
              <p className="text-sm victory-gray">Personal account manager for all plans</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="font-semibold victory-dark mb-2">Security & Compliance</h3>
              <p className="text-sm victory-gray">Enterprise-grade security standards</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="victory-purple w-8 h-8" />
              </div>
              <h3 className="font-semibold victory-dark mb-2">Detailed Reporting</h3>
              <p className="text-sm victory-gray">Comprehensive analytics and insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">Can I change my plan later?</h3>
                <p className="victory-gray">Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">Are there any setup fees?</h3>
                <p className="victory-gray">No setup fees! We'll have your account up and running within 48 hours of signup.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">What if I need custom features?</h3>
                <p className="victory-gray">We offer custom solutions for enterprise clients. Contact us to discuss your specific requirements.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">How do you ensure quality?</h3>
                <p className="victory-gray">We maintain strict quality standards with regular training, monitoring, and performance reviews for all our agents.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Join hundreds of businesses that trust VictorySync for their customer engagement needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-victory-purple hover:bg-purple-700 text-white">
                Schedule Free Demo
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple bg-[#6454f0]">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}