import { Link } from 'wouter';
import { useState } from 'react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'billing', name: 'Billing & Plans', icon: '💳' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'integration', name: 'Integration', icon: '🔗' },
    { id: 'account', name: 'Account Management', icon: '👤' }
  ];

  const faqData = {
    'getting-started': [
      {
        question: "How do I get started with VictorySync?",
        answer: "Getting started is easy! Simply sign up for an account, choose your service package, and our team will contact you within 24 hours to begin onboarding. We'll help you integrate our services with your existing systems and train your team on the process."
      },
      {
        question: "What services does VictorySync offer?",
        answer: "We provide comprehensive call center solutions including 24/7 inbound customer support, outbound sales and lead generation, AI-powered automation, and digital marketing services. Our solutions are designed to reduce your customer service costs by up to 60%."
      },
      {
        question: "How long does implementation take?",
        answer: "Most implementations are completed within 5-10 business days. This includes system integration, agent training, and quality assurance testing. More complex setups may require 2-3 weeks depending on your specific requirements."
      }
    ],
    'billing': [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), wire transfers, and ACH payments. All payments are processed securely through our encrypted payment system."
      },
      {
        question: "Can I change my plan anytime?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the beginning of your next billing cycle. Contact our support team to discuss plan changes and any applicable pro-rated charges."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for new customers. If you're not satisfied with our service within the first 30 days, we'll provide a full refund. Refunds for subsequent months are handled on a case-by-case basis."
      }
    ],
    'technical': [
      {
        question: "How do I integrate VictorySync with my CRM?",
        answer: "We support integration with all major CRM platforms including Salesforce, HubSpot, Pipedrive, and Zoho. Our technical team will help you set up the integration using our API or direct connectors."
      },
      {
        question: "What are your system requirements?",
        answer: "Our cloud-based platform works with any modern web browser. For phone integrations, we support SIP, VoIP, and traditional phone systems. Our team will assess your current setup during onboarding."
      },
      {
        question: "How do you handle data security?",
        answer: "We maintain SOC 2 Type II compliance and use enterprise-grade encryption for all data transmission and storage. Our facilities are ISO 27001 certified, and we follow strict data handling protocols."
      }
    ],
    'integration': [
      {
        question: "Which platforms can you integrate with?",
        answer: "We integrate with 200+ platforms including CRM systems, helpdesk software, e-commerce platforms, and communication tools. If you have a specific platform, our technical team can assess integration possibilities."
      },
      {
        question: "How long does API integration take?",
        answer: "Basic API integrations typically take 2-5 business days. More complex integrations with custom workflows may require 1-2 weeks. Our technical team provides timeline estimates during the initial consultation."
      },
      {
        question: "Do you provide API documentation?",
        answer: "Yes, we provide comprehensive API documentation with code examples, authentication guides, and testing tools. Our developer portal includes sandbox environments for testing integrations."
      }
    ],
    'account': [
      {
        question: "How do I update my account information?",
        answer: "You can update your account information by logging into your customer dashboard and navigating to Account Settings. Changes to billing information may require verification for security purposes."
      },
      {
        question: "How do I add or remove team members?",
        answer: "Account administrators can manage team members through the Customer Dashboard. Go to Team Management to invite new users, assign roles, or remove access. Each user will receive email instructions to complete setup."
      },
      {
        question: "Can I cancel my account?",
        answer: "Yes, you can cancel your account at any time. Contact our support team or submit a cancellation request through your customer dashboard. We'll process cancellations with 30 days notice as outlined in our terms of service."
      }
    ]
  };

  const quickLinks = [
    { title: "Service Status", description: "Check real-time system status", link: "#" },
    { title: "API Documentation", description: "Developer resources and guides", link: "/docs" },
    { title: "Contact Support", description: "Get help from our team", link: "/contact" },
    { title: "Video Tutorials", description: "Step-by-step video guides", link: "#" }
  ];

  const filteredFAQs = searchQuery
    ? Object.values(faqData).flat().filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-victory-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find answers to common questions and get the support you need to maximize your VictorySync experience.
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-victory-purple"
                />
                <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.link}>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-gray-600 text-sm">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? 'bg-victory-purple text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 categories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0A7.953 7.953 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8a7.953 7.953 0 01-2.343 5.657m0 0A7.962 7.962 0 0112 17.5c-2.137 0-4.146-.832-5.657-2.343m0 0A7.953 7.953 0 014 13c0-4.418 3.582-8 8-8s8 3.582 8 8a7.953 7.953 0 01-2.343 5.657z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-victory-purple hover:bg-victory-purple/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
            </Link>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              Schedule a Call
            </button>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
              <p className="text-gray-600">support@victorysync.com</p>
              <p className="text-sm text-gray-500">Response within 2 hours</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
              <p className="text-gray-600">1-800-VICTORY</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
              <p className="text-gray-600">Available in your dashboard</p>
              <p className="text-sm text-gray-500">Instant response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}