import { Link } from 'wouter';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Phone, Megaphone, Bot, Check, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Reduce Customer Service Costs by <span className="text-yellow-300">60%</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Professional call center services, AI automation, and marketing solutions from New Jersey. 24/7 support at a fraction of US costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-[#5d5df2]">
                    View Pricing
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple bg-[#506bf4]">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern call center workspace with professional agents" 
                className="rounded-2xl shadow-2xl w-full" 
              />
              <div className="absolute -bottom-6 -left-6 p-4 rounded-xl shadow-lg text-victory-dark bg-[#5d5df2]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">93% Cost Savings</p>
                    <p className="text-sm text-victory-gray">vs US-based agents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold victory-purple mb-2">60%</div>
              <div className="victory-gray">Cost Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold victory-purple mb-2">24/7</div>
              <div className="victory-gray">Support Coverage</div>
            </div>
            <div>
              <div className="text-3xl font-bold victory-purple mb-2">97%</div>
              <div className="victory-gray">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold victory-purple mb-2">500+</div>
              <div className="victory-gray">Projects Completed</div>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Complete Customer Engagement Solutions
            </h2>
            <p className="text-xl victory-gray max-w-3xl mx-auto">
              From inbound support to outbound sales, AI automation to digital marketing - we've got your customer engagement covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Inbound Services */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="victory-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Inbound Call Center</h3>
                <p className="victory-gray mb-6">
                  Professional customer support, technical assistance, and order processing with multilingual capabilities.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> 24/7 Customer Support</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Technical Help Desk</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Order Processing</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Live Chat Support</li>
                </ul>
              </CardContent>
            </Card>

            {/* Outbound Services */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Megaphone className="victory-blue w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Outbound Sales</h3>
                <p className="victory-gray mb-6">
                  Lead generation, appointment setting, and sales campaigns to grow your business revenue.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Lead Generation</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Appointment Setting</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Cold Calling</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Sales Campaigns</li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Automation */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="victory-light-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">AI Automation</h3>
                <p className="victory-gray mb-6">
                  Intelligent chatbots, automated workflows, and AI-powered customer insights to streamline operations.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> AI Chatbots</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Workflow Automation</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Call Summaries</li>
                  <li className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" /> Reporting Dashboard</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl victory-gray">
              Join hundreds of satisfied businesses who trust VictorySync
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="victory-gray mb-6">
                  "VictorySync helped us reduce our customer service costs by 65% while improving response times. Their team is professional and reliable."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Professional business executive" 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-sm victory-gray">CEO, TechStart Inc.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="victory-gray mb-6">
                  "The AI automation features have streamlined our entire customer support process. Highly recommend their services."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Professional business leader" 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm victory-gray">Operations Director, GrowthCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="victory-gray mb-6">
                  "Outstanding service quality and cost savings. VictorySync has become an essential part of our business operations."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Business executive" 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <div className="font-semibold">David Thompson</div>
                    <div className="text-sm victory-gray">Founder, Digital Solutions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <Link href="/contact">
              <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-[#6950f0]">
                Schedule Demo
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple bg-[#6454f0]">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
