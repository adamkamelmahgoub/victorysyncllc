
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Megaphone, Bot, Check, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Save 60% on Customer Service
              <span className="block text-purple-200">Without Compromising Quality</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Our Cairo-based team delivers exceptional customer support, lead generation, and technical assistance at a fraction of the cost of US-based alternatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-white">
                  Schedule Free Demo
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Complete Customer Service Solutions
            </h2>
            <p className="text-xl victory-gray max-w-3xl mx-auto">
              From inbound support to outbound lead generation, we handle it all with professional excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="victory-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold victory-dark mb-4">Customer Support</h3>
                <p className="victory-gray">
                  24/7 inbound customer service with native English speakers trained on your specific products and processes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="victory-blue w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold victory-dark mb-4">Lead Generation</h3>
                <p className="victory-gray">
                  Outbound calling campaigns that generate qualified leads and schedule appointments for your sales team.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold victory-dark mb-4">Technical Support</h3>
                <p className="victory-gray">
                  Tier 1 and Tier 2 technical support with escalation protocols and comprehensive knowledge base management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-6">
                Why Choose VictorySync?
              </h2>
              <div className="space-y-4">
                {[
                  'Save 60% compared to US-based alternatives',
                  'Native English speakers with American accents',
                  'Comprehensive training on your business processes',
                  '24/7 availability across all time zones',
                  'Advanced CRM and dialer system integration',
                  'Real-time performance monitoring and reporting'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="text-green-600 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="victory-gray">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold victory-dark mb-6">Cost Comparison</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="victory-gray">US-Based Agent</span>
                  <span className="text-2xl font-bold text-red-600">$15-25/hr</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="victory-gray">VictorySync Agent</span>
                  <span className="text-2xl font-bold text-green-600">$6-10/hr</span>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-600">60%</span>
                    <p className="text-green-800 font-medium">Average Savings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                company: "TechStart Solutions",
                rating: 5,
                text: "VictorySync has been incredible. We cut our customer service costs by 65% while actually improving our customer satisfaction scores."
              },
              {
                name: "Mike Chen",
                company: "E-commerce Plus",
                rating: 5,
                text: "The team feels like an extension of our company. Their English is perfect and they understand our products better than some of our own staff."
              },
              {
                name: "Lisa Rodriguez",
                company: "HealthTech Innovations",
                rating: 5,
                text: "24/7 support that actually works. Our customers love the quick response times and professional service they receive."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="victory-gray mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold victory-dark">{testimonial.name}</p>
                    <p className="text-sm victory-gray">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Save 60% on Customer Service?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join our next webinar to learn how other businesses are cutting costs while improving service quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-white">
                Schedule Demo
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
