import { Phone, Megaphone, Bot, BarChart3, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Services() {
  const services = [
    {
      icon: Phone,
      title: "Inbound Call Center",
      features: [
        "24/7 Multilingual Customer Support with native English speakers and fluency in Spanish, French, and Arabic",
        "Advanced Technical Help Desk with tier-1, tier-2, and tier-3 escalation protocols",
        "Complete Order Processing & Billing management with payment gateway integrations",
        "Real-time Live Chat Support with instant response capabilities and chatbot handoffs",
        "Comprehensive Email Support Management with ticketing systems and automated routing",
        "Professional Complaint Resolution with empathy training and satisfaction tracking",
        "Call recording and quality monitoring with performance analytics",
        "CRM integration with Salesforce, HubSpot, and custom systems"
      ],
      benefits: [
        "Reduce average response times by 80% with intelligent call routing",
        "Improve customer satisfaction scores by 45% through empathetic support",
        "Handle peak volumes effortlessly with scalable agent deployment",
        "Decrease operational costs by 60% compared to in-house teams",
        "Increase first-call resolution rates by 35% with proper training",
        "Maintain 99.9% uptime with redundant systems and backup protocols"
      ]
    },
    {
      icon: Megaphone,
      title: "Outbound Sales & Marketing",
      features: [
        "Advanced Lead Generation & Qualification using AI-powered prospect identification",
        "Professional Appointment Setting with calendar integration and automated confirmations",
        "Strategic Cold Calling Campaigns with personalized scripts and objection handling",
        "Automated Follow-up Sequences with drip campaigns and nurture tracks",
        "Comprehensive Market Research including competitor analysis and demographic studies",
        "Detailed Customer Surveys with statistical analysis and reporting",
        "Multi-channel outreach including phone, email, and LinkedIn campaigns",
        "Real-time CRM updates with lead scoring and pipeline management"
      ],
      benefits: [
        "Increase qualified leads by 150% through targeted prospecting",
        "Boost conversion rates by 65% with proven sales methodologies",
        "Expand market reach by 200% with multi-channel approaches",
        "Reduce sales cycle length by 40% through effective nurturing",
        "Improve lead quality scores by 80% with advanced qualification",
        "Generate 300% ROI on marketing spend with optimized campaigns"
      ]
    },
    {
      icon: Bot,
      title: "AI Automation",
      features: [
        "Intelligent AI-Powered Chatbots with natural language processing and machine learning",
        "Custom Automated Workflows with business rule engines and process optimization",
        "Advanced Call Summary Generation with sentiment analysis and action item extraction",
        "Real-time Sentiment Analysis for customer mood detection and response adjustment",
        "Predictive Analytics with forecasting models and trend identification",
        "Sophisticated Voice Recognition with accent adaptation and language detection",
        "Seamless integration with existing systems through robust APIs",
        "24/7 automated operations with human oversight and intervention capabilities"
      ],
      benefits: [
        "Handle 60% more inquiries simultaneously without increasing staff",
        "Reduce operational costs by 70% through intelligent automation",
        "Improve data accuracy by 95% with automated data entry and validation",
        "Decrease response times by 90% with instant AI-powered responses",
        "Increase customer engagement by 120% with personalized interactions",
        "Achieve 24/7 availability with no downtime or breaks required"
      ]
    },
    {
      icon: BarChart3,
      title: "Digital Marketing",
      features: [
        "Full-Service Social Media Management across all major platforms with content calendars",
        "Professional Content Creation including copywriting, graphic design, and video production",
        "Advanced SEO Optimization with keyword research, on-page and off-page strategies",
        "Targeted Email Marketing Campaigns with segmentation and automation workflows",
        "Strategic Pay-Per-Click Advertising on Google, Facebook, and LinkedIn platforms",
        "Comprehensive Analytics & Reporting with ROI tracking and performance insights",
        "Brand strategy development with positioning and messaging frameworks",
        "Conversion rate optimization with A/B testing and user experience improvements"
      ],
      benefits: [
        "Increase brand visibility by 250% across all digital channels",
        "Generate 300% more qualified leads through optimized campaigns",
        "Improve ROI tracking accuracy by 90% with advanced analytics",
        "Boost website traffic by 180% through SEO and content marketing",
        "Increase social media engagement by 400% with strategic content",
        "Achieve 85% email open rates with personalized campaigns"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Complete Business Solutions
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            From customer support to sales growth, we provide end-to-end services that help your business thrive while reducing costs by up to 60%.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-[#6750f0]">
              View Our Packages
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={service.title} className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className={isEven ? 'order-1' : 'order-2'}>
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="victory-purple w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold victory-dark mb-6">{service.title}</h2>

                    <div className="mb-8">
                      <h3 className="font-semibold victory-dark mb-4">Key Features:</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <Check className="text-green-500 w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="text-sm victory-gray">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-semibold victory-dark mb-4">Benefits:</h3>
                      <div className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center">
                            <ArrowRight className="victory-purple w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="text-sm font-medium victory-dark">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/contact">
                      <Button className="bg-victory-purple hover:bg-purple-700 text-white">
                        Learn More
                      </Button>
                    </Link>
                  </div>

                  <div className={isEven ? 'order-2' : 'order-1'}>
                    <Card className="p-8 shadow-lg">
                      <CardContent className="text-center">
                        <IconComponent className="victory-purple w-20 h-20 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold victory-dark mb-4">Ready to Get Started?</h3>
                        <p className="victory-gray mb-6">
                          Discover how our {service.title.toLowerCase()} services can transform your business operations.
                        </p>
                        <div className="space-y-3">
                          <Link href="/pricing">
                            <Button className="w-full bg-victory-purple hover:bg-purple-700 text-white">
                              View Pricing Plans
                            </Button>
                          </Link>
                          <Link href="/contact">
                            <Button variant="outline" className="w-full">
                              Schedule Consultation
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Why Choose VictorySync?
            </h2>
            <p className="text-xl victory-gray max-w-3xl mx-auto">
              We combine Egyptian talent with cutting-edge technology to deliver exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold victory-dark mb-4">Proven Results</h3>
                <p className="victory-gray">
                  Our clients see an average of 60% cost reduction and 40% improvement in customer satisfaction scores.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="victory-blue w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold victory-dark mb-4">Advanced Technology</h3>
                <p className="victory-gray">
                  We leverage the latest AI and automation tools to maximize efficiency and deliver superior results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="victory-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold victory-dark mb-4">24/7 Support</h3>
                <p className="victory-gray">
                  Round-the-clock availability ensures your customers are always taken care of, no matter the time zone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Let's discuss how our services can help you reduce costs, improve efficiency, and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-victory-purple hover:bg-gray-100 bg-[#7046ee]">
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple bg-[#7147ef]">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}