import { Phone, Megaphone, Bot, BarChart3, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Services() {
  const services = [
    {
      icon: Phone,
      title: "Inbound Call Center",
      description: "Our comprehensive inbound call center services provide round-the-clock customer support with native English-speaking agents from our New Jersey facility. We handle everything from basic inquiries to complex technical support issues, ensuring your customers receive professional, empathetic assistance every time they call. Our multilingual capabilities extend to Spanish, French, and Arabic, allowing us to serve diverse customer bases across North America and beyond.",
      features: [
        "24/7 Customer Support",
        "Technical Help Desk",
        "Order Processing & Billing",
        "Live Chat Support",
        "Email Support Management",
        "Complaint Resolution"
      ],
      benefits: [
        "Reduce response times by 80%",
        "Improve customer satisfaction scores",
        "Handle peak volumes effortlessly"
      ]
    },
    {
      icon: Megaphone,
      title: "Outbound Sales & Marketing",
      description: "Transform your sales pipeline with our sophisticated outbound marketing strategies. Our experienced sales professionals use proven methodologies to identify, qualify, and convert high-value prospects into loyal customers. We leverage advanced CRM systems, predictive analytics, and personalized scripting to maximize conversion rates while maintaining your brand's integrity. Our team specializes in B2B lead generation, appointment setting, and nurturing campaigns that consistently deliver measurable ROI improvements.",
      features: [
        "Lead Generation & Qualification",
        "Appointment Setting",
        "Cold Calling Campaigns",
        "Follow-up Sequences",
        "Market Research",
        "Customer Surveys"
      ],
      benefits: [
        "Increase qualified leads by 150%",
        "Boost conversion rates",
        "Expand market reach"
      ]
    },
    {
      icon: Bot,
      title: "AI Automation",
      description: "Revolutionize your business operations with cutting-edge artificial intelligence and automation technologies. Our AI-powered solutions include intelligent chatbots that handle routine inquiries, automated workflow systems that eliminate manual processes, and predictive analytics that anticipate customer needs. We integrate seamlessly with your existing systems to create a unified, intelligent ecosystem that operates 24/7, reducing response times by up to 90% while maintaining the personal touch your customers expect.",
      features: [
        "AI-Powered Chatbots",
        "Automated Workflows",
        "Call Summary Generation",
        "Sentiment Analysis",
        "Predictive Analytics",
        "Voice Recognition"
      ],
      benefits: [
        "Handle 60% more inquiries",
        "Reduce operational costs",
        "Improve data accuracy"
      ]
    },
    {
      icon: BarChart3,
      title: "Digital Marketing",
      description: "Amplify your brand's digital presence with our comprehensive marketing suite designed for modern businesses. Our data-driven approach combines content creation, social media management, search engine optimization, and targeted advertising campaigns to maximize your online visibility and engagement. We create compelling narratives that resonate with your target audience while leveraging advanced analytics to continuously optimize performance and ensure every marketing dollar delivers maximum impact across all digital channels.",
      features: [
        "Social Media Management",
        "Content Creation",
        "SEO Optimization",
        "Email Marketing Campaigns",
        "Pay-Per-Click Advertising",
        "Analytics & Reporting"
      ],
      benefits: [
        "Increase brand visibility",
        "Generate more qualified leads",
        "Improve ROI tracking"
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
