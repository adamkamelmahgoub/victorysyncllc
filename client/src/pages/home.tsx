
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Phone, Users, TrendingUp, Clock, Star, PlayCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/footer';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-victory-purple" />,
      title: 'AI-Powered Call Automation',
      description: 'Handle customer calls 24/7 with advanced AI that understands context and provides human-like responses.'
    },
    {
      icon: <Users className="w-8 h-8 text-victory-purple" />,
      title: 'Scalable Team Management',
      description: 'Manage unlimited agents and scale your operations without the traditional overhead costs.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-victory-purple" />,
      title: 'Real-Time Analytics',
      description: 'Get instant insights into call performance, customer satisfaction, and ROI metrics.'
    },
    {
      icon: <Clock className="w-8 h-8 text-victory-purple" />,
      title: '24/7 Availability',
      description: 'Never miss a call again with our always-on AI agents that work around the clock.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      role: 'CEO',
      content: 'VictorySync reduced our customer service costs by 65% while improving response times. It\'s been a game-changer for our business.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Growth Solutions',
      role: 'Operations Director',
      content: 'The AI automation is incredibly sophisticated. Our customers can\'t tell the difference between AI and human agents.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      company: 'SmartCommerce',
      role: 'Customer Success Manager',
      content: 'Implementation was seamless and the results were immediate. We saw a 40% increase in customer satisfaction scores.',
      rating: 5
    }
  ];

  const stats = [
    { value: '60%', label: 'Cost Reduction' },
    { value: '24/7', label: 'Availability' },
    { value: '99.9%', label: 'Uptime' },
    { value: '500+', label: 'Happy Clients' }
  ];

  const handleScrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-victory-light-gray to-white">
        <div className="victory-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="victory-heading-xl mb-6">
                Transform Your Customer Service with{' '}
                <span className="bg-victory-gradient bg-clip-text text-transparent">
                  AI Automation
                </span>
              </h1>
              <p className="victory-text-lg mb-8">
                Reduce costs by 60% while improving customer satisfaction. 
                Our AI-powered call center automation handles inbound and outbound calls 
                with human-like intelligence, 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register">
                  <button className="victory-btn-primary w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
                <button 
                  onClick={handleScrollToDemo}
                  className="victory-btn-secondary w-full sm:w-auto flex items-center justify-center"
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-victory-gray">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No setup fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cancel anytime
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  24/7 support
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in">
              <div className="bg-victory-gradient rounded-2xl p-8 text-white shadow-victory-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-victory-light-gray">Live Call Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Calls Handled Today</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <span className="font-semibold">0.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-semibold">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost Savings</span>
                      <span className="font-semibold text-green-300">$12,450</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="victory-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="victory-heading-lg text-victory-purple mb-2">
                  {stat.value}
                </div>
                <p className="text-victory-gray font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="victory-section bg-victory-light-gray">
        <div className="victory-container">
          <div className="text-center mb-16">
            <h2 className="victory-heading-lg mb-6">
              Why Choose VictorySync?
            </h2>
            <p className="victory-text-lg max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven call center expertise 
              to deliver exceptional results for businesses of all sizes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="victory-card text-center group hover:shadow-victory-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-victory-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-victory-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="victory-section">
        <div className="victory-container">
          <div className="text-center mb-16">
            <h2 className="victory-heading-lg mb-6">
              How It Works
            </h2>
            <p className="victory-text-lg max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-victory-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                1
              </div>
              <h3 className="victory-heading-md mb-4">
                Connect Your Systems
              </h3>
              <p className="victory-text-base">
                Integrate with your existing CRM, phone system, and tools in minutes using our simple setup wizard.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-victory-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                2
              </div>
              <h3 className="victory-heading-md mb-4">
                Train Your AI Agent
              </h3>
              <p className="victory-text-base">
                Customize your AI agent with your brand voice, knowledge base, and specific business processes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-victory-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                3
              </div>
              <h3 className="victory-heading-md mb-4">
                Go Live & Scale
              </h3>
              <p className="victory-text-base">
                Launch your automated call center and watch as your costs decrease while satisfaction increases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="victory-section bg-victory-light-gray">
        <div className="victory-container">
          <div className="text-center mb-16">
            <h2 className="victory-heading-lg mb-6">
              What Our Customers Say
            </h2>
            <p className="victory-text-lg">
              Join hundreds of businesses that have transformed their customer service with VictorySync.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="victory-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-victory-gray mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-victory-black">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-victory-gray">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="victory-section bg-victory-gradient">
        <div className="victory-container text-center">
          <h2 className="victory-heading-lg text-white mb-6">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="victory-text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have reduced costs by 60% while improving 
            customer satisfaction. Start your free trial today.
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
                Schedule Demo
              </button>
            </Link>
          </div>
          <p className="text-gray-200 text-sm mt-6">
            No credit card required • Setup in under 10 minutes • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
