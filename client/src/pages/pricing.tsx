
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/footer';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$1,200',
      period: '/month',
      description: 'Perfect for small businesses getting started with AI automation',
      features: [
        'Up to 1,000 calls/month',
        'Basic AI call handling',
        'CRM integration',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$2,500',
      period: '/month',
      description: 'Ideal for growing businesses that need advanced features',
      features: [
        'Up to 5,000 calls/month',
        'Advanced AI with context awareness',
        'Multiple CRM integrations',
        'Priority phone & chat support',
        'Advanced analytics & reporting',
        'Custom AI training',
        'Team management tools',
        'API access'
      ],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with custom requirements',
      features: [
        'Unlimited calls',
        'Custom AI models',
        'Enterprise integrations',
        'Dedicated account manager',
        'Advanced security & compliance',
        'Custom reporting',
        'SLA guarantees',
        'White-label options',
        'On-premise deployment'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'Most customers are up and running within 24 hours. Our setup wizard guides you through connecting your existing systems and training your AI agent.'
    },
    {
      question: 'What happens to my existing phone system?',
      answer: 'VictorySync integrates seamlessly with your current phone system. No need to replace your infrastructure - we work with what you have.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, absolutely. There are no long-term contracts and you can cancel your subscription at any time with no penalties.'
    },
    {
      question: 'Do you offer a money-back guarantee?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied, we\'ll refund your first month.'
    },
    {
      question: 'How does billing work for additional calls?',
      answer: 'If you exceed your plan limits, additional calls are billed at competitive per-minute rates. We\'ll notify you before any overages occur.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and GDPR compliance to protect your data.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="victory-container text-center">
          <h1 className="victory-heading-xl mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="victory-text-lg max-w-3xl mx-auto mb-8">
            Choose the plan that fits your business. All plans include our core AI automation features 
            with no setup fees or hidden costs. Start your free trial today.
          </p>
          <div className="inline-flex items-center space-x-2 bg-victory-light-gray rounded-lg p-1">
            <button className="px-4 py-2 bg-white rounded-md shadow-sm font-medium text-victory-black">
              Monthly
            </button>
            <button className="px-4 py-2 text-victory-gray font-medium">
              Annual (Save 20%)
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 lg:pb-24">
        <div className="victory-container">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`victory-card relative ${
                  plan.popular 
                    ? 'ring-2 ring-victory-purple transform scale-105 shadow-victory-xl' 
                    : 'hover:shadow-victory-lg transition-shadow'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-victory-purple text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-victory-black mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-victory-black">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-victory-gray ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-victory-gray">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-victory-gray">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.name === 'Enterprise' ? (
                    <Link to="/contact">
                      <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'victory-btn-primary'
                          : 'victory-btn-secondary'
                      }`}>
                        {plan.buttonText}
                      </button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'victory-btn-primary'
                          : 'victory-btn-secondary'
                      }`}>
                        {plan.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="victory-section bg-victory-light-gray">
        <div className="victory-container">
          <div className="text-center mb-16">
            <h2 className="victory-heading-lg mb-6">
              Why VictorySync Delivers ROI
            </h2>
            <p className="victory-text-lg max-w-3xl mx-auto">
              Our customers typically see a 60% reduction in call center costs within the first month, 
              while improving customer satisfaction scores.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-victory-purple mb-4">
                60%
              </div>
              <h3 className="text-xl font-semibold text-victory-black mb-2">
                Cost Reduction
              </h3>
              <p className="text-victory-gray">
                Average savings compared to traditional call centers
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-victory-purple mb-4">
                24/7
              </div>
              <h3 className="text-xl font-semibold text-victory-black mb-2">
                Always Available
              </h3>
              <p className="text-victory-gray">
                Never miss a call with round-the-clock AI agents
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-victory-purple mb-4">
                98.5%
              </div>
              <h3 className="text-xl font-semibold text-victory-black mb-2">
                Satisfaction Rate
              </h3>
              <p className="text-victory-gray">
                Customer satisfaction scores from our AI agents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="victory-section">
        <div className="victory-container">
          <div className="text-center mb-16">
            <h2 className="victory-heading-lg mb-6">
              Frequently Asked Questions
            </h2>
            <p className="victory-text-lg">
              Have questions? We have answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="victory-card">
                <h3 className="text-lg font-semibold text-victory-black mb-3">
                  {faq.question}
                </h3>
                <p className="text-victory-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="victory-section bg-victory-gradient">
        <div className="victory-container text-center">
          <h2 className="victory-heading-lg text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="victory-text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have transformed their customer service. 
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="bg-white text-victory-purple hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-colors shadow-victory-card">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="border-2 border-white text-white hover:bg-white hover:text-victory-purple font-semibold py-4 px-8 rounded-lg transition-all">
                Talk to Sales
              </button>
            </Link>
          </div>
          <p className="text-gray-200 text-sm mt-6">
            30-day money-back guarantee • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
