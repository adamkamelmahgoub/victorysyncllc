import { Phone, Megaphone, Bot, BarChart3, Check, ArrowRight, Users, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Services() {
  const services = [
    {
      icon: Phone,
      title: "Inbound Call Center",
      description: "24/7 professional support in English and Arabic—your brand's human voice around the clock",
      features: [
        "24/7/365 bilingual agents",
        "Tier-1 & Tier-2 technical help desk",
        "Secure order processing & billing",
        "Omnichannel live chat & email hub",
        "Intelligent complaint triage & root-cause tagging"
      ],
      benefits: [
        "80% faster response times",
        "25-point CSAT lift",
        "Effortless handling of launch- and holiday-spikes"
      ]
    },
    {
      icon: Megaphone,
      title: "Outbound Sales & Marketing",
      description: "Data-driven outreach that fills your pipeline and books meetings for your reps",
      features: [
        "ICP-targeted lead generation",
        "Appointment setting & calendar sync",
        "AI-guided cold-call campaigns",
        "Sequenced follow-ups (email, LinkedIn, SMS)",
        "Market research & NPS surveys"
      ],
      benefits: [
        "Predictable MRR growth",
        "Higher win-rates and larger deal sizes",
        "Rapid market-share expansion"
      ]
    },
    {
      icon: Bot,
      title: "AI Automation",
      description: "Smart workflows that cut costs and scale service—no code required",
      features: [
        "AI chatbots (English & Arabic)",
        "Robotic process automation (RPA)",
        "Auto call-summary & sentiment analysis",
        "Predictive analytics dashboards",
        "Voice recognition & IVR routing"
      ],
      benefits: [
        "Handle 60% more tickets with the same staff",
        "Lower error rates—data accuracy up 98%",
        "Payback period < 6 months"
      ]
    },
    {
      icon: BarChart3,
      title: "Digital Marketing",
      description: "End-to-end growth engine: strategy, creative, execution, analytics",
      features: [
        "Social media management & paid amplification",
        "SEO content clusters & technical fixes",
        "Automated email nurtures & drip campaigns",
        "PPC & paid social with real-time bid optimization",
        "GA4 / Looker Studio dashboards"
      ],
      benefits: [
        "Larger qualified-lead pipeline",
        "Brand visibility in new markets",
        "Marketing dollars tracked to every sale"
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
                    <h2 className="text-3xl font-bold victory-dark mb-4">{service.title}</h2>
                    <p className="text-lg victory-gray mb-6">{service.description}</p>

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