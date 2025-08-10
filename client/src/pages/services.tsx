
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  DollarSign, 
  Brain, 
  Phone, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  Check,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const benefits = [
    {
      icon: <Clock className="w-12 h-12 text-blue-500" />,
      title: "24/7 Coverage",
      description: "Round-the-clock customer support with AI-powered assistance and human oversight",
      features: ["24/7 availability", "Multi-timezone support", "Emergency escalation", "Weekend coverage"]
    },
    {
      icon: <DollarSign className="w-12 h-12 text-green-500" />,
      title: "60% Cost Savings",
      description: "Reduce operational costs while maintaining high-quality customer service",
      features: ["Lower staffing costs", "Reduced training time", "Automated workflows", "Efficient routing"]
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Advanced analytics and machine learning to optimize customer interactions",
      features: ["Predictive analytics", "Sentiment analysis", "Performance optimization", "Real-time insights"]
    }
  ];

  const services = [
    {
      icon: <Phone className="w-8 h-8 text-blue-500" />,
      title: "Inbound Call Management",
      description: "Professional handling of all incoming customer calls with intelligent routing and priority management."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Customer Support",
      description: "Comprehensive customer support across multiple channels including phone, email, and chat."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      title: "Performance Analytics",
      description: "Detailed reporting and analytics to track performance metrics and optimize operations."
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: "Quality Assurance",
      description: "Rigorous quality control processes to ensure consistent, high-quality customer interactions."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Workflow Automation",
      description: "Automated processes and intelligent routing to maximize efficiency and reduce response times."
    },
    {
      icon: <Brain className="w-8 h-8 text-indigo-500" />,
      title: "AI Integration",
      description: "Advanced AI tools for sentiment analysis, predictive insights, and enhanced customer experience."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 500 calls/month",
        "Basic analytics",
        "Email support",
        "CRM integration",
        "Standard business hours"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 2,000 calls/month",
        "Advanced analytics",
        "Priority support",
        "Multiple CRM integrations",
        "24/7 coverage",
        "Custom workflows",
        "Quality assurance"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$599",
      period: "/month",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited calls",
        "Full analytics suite",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 premium support",
        "Advanced AI features",
        "SLA guarantees",
        "White-label options"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Customer Service
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            VictorySync combines AI-powered automation with human expertise to deliver 
            exceptional customer service that scales with your business.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VictorySync?
            </h2>
            <p className="text-xl text-gray-600">
              Proven benefits that drive real business results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{benefit.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Service Portfolio
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to deliver exceptional customer experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {service.icon}
                    <CardTitle className="text-xl ml-3">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-xl' : 'shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-xl text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-lg mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of businesses already saving 60% on customer service costs 
            while improving customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
