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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-victory py-20 text-white vs-hero text-center py-20 px-6">
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

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {packages && packages.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg: any, index: number) => {
                const isPopular = index === 1; // Make middle plan popular
                return (
                  <Card key={pkg.id} className={`relative hover:shadow-lg transition-shadow ${isPopular ? 'border-victory-purple border-2' : 'border-slate-200'}`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-victory-purple text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold victory-dark mb-2">{pkg.name}</h3>
                        <div className="text-4xl font-bold victory-purple mb-2">
                          ${parseFloat(pkg.price).toLocaleString()}
                          <span className="text-base font-normal victory-gray">/month</span>
                        </div>
                        <p className="victory-gray">{pkg.description}</p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center">
                            <Check className="text-green-500 w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        onClick={() => handleAddToCart(pkg)}
                        className={`w-full ${isPopular ? 'bg-victory-purple hover:bg-purple-700' : 'bg-victory-purple hover:bg-purple-700'} text-white`}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl victory-gray">Loading pricing packages...</p>
            </div>
          )}
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
              See how much you can save with our Egypt-based team
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
                <div className="text-4xl font-bold text-green-600 mb-4">~$6.25/hour</div>
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
      <section className="bg-slate-50 py-20 vs-section-alt py-20 px-6">
        <div className="max-w-4xl mx-auto">
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
            <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-[#6a4def]">
              Schedule Free Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple bg-[#6454f0]">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}