import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useSeo } from "@/hooks/useSeo";
import { useCalendly } from "@/hooks/useCalendly";

export default function HelpCenter() {
  const { open: openCalendly } = useCalendly();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  useSeo({
    title: 'Help Center | VictorySync Support & Documentation',
    description: 'Get help with VictorySync services. Browse guides, FAQs, and support articles on inbound support, appointment setting, and AI automation.',
    canonical: 'https://victorysync.com/help-center',
  });

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "billing", name: "Billing & Plans", icon: "💳" },
    { id: "technical", name: "Technical Support", icon: "🔧" },
    { id: "integration", name: "Integration", icon: "🔗" },
    { id: "account", name: "Account Management", icon: "👤" },
  ];

  const faqData: Record<string, { question: string; answer: string }[]> = {
    "getting-started": [
      {
        question: "How do I get started with VictorySync?",
        answer:
          "Getting started is easy! Simply sign up for an account, choose your service package, and our team will contact you within 24 hours to begin onboarding. We'll help you integrate our services with your existing systems and train your team on the process.",
      },
      {
        question: "What services does VictorySync offer?",
        answer:
          "We provide human-led contact center services including inbound customer support, outbound calling, lead qualification, appointment setting, and follow-up. Our agents use AI-assisted tools for summaries, routing, and reporting while people remain responsible for every conversation.",
      },
      {
        question: "How long does implementation take?",
        answer:
          "Most implementations are completed within 5-10 business days. This includes system integration, agent training, and quality assurance testing. More complex setups may require 2-3 weeks depending on your specific requirements.",
      },
    ],
    billing: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), wire transfers, and ACH payments. All payments are processed securely through our encrypted payment system.",
      },
      {
        question: "Can I change my plan anytime?",
        answer:
          "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the beginning of your next billing cycle. Contact our support team to discuss plan changes and any applicable pro-rated charges.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for new customers. If you're not satisfied with our service within the first 30 days, we'll provide a full refund. Refunds for subsequent months are handled on a case-by-case basis.",
      },
    ],
    technical: [
      {
        question: "How do I integrate VictorySync with my CRM?",
        answer:
          "We support integration with all major CRM platforms including Salesforce, HubSpot, Pipedrive, and Zoho. Our technical team will help you set up the integration using our API or direct connectors.",
      },
      {
        question: "What are your system requirements?",
        answer:
          "Our cloud-based platform works with any modern web browser. For phone integrations, we support SIP, VoIP, and traditional phone systems. Our team will assess your current setup during onboarding.",
      },
      {
        question: "How do you handle data security?",
        answer:
          "We maintain SOC 2 Type II compliance and use enterprise-grade encryption for all data transmission and storage. Our facilities are ISO 27001 certified, and we follow strict data handling protocols.",
      },
    ],
    integration: [
      {
        question: "Which platforms can you integrate with?",
        answer:
          "We integrate with 200+ platforms including CRM systems, helpdesk software, e-commerce platforms, and communication tools. If you have a specific platform, our technical team can assess integration possibilities.",
      },
      {
        question: "How long does API integration take?",
        answer:
          "Basic API integrations typically take 2-5 business days. More complex integrations with custom workflows may require 1-2 weeks. Our technical team provides timeline estimates during the initial consultation.",
      },
      {
        question: "Do you provide API documentation?",
        answer:
          "Yes, we provide comprehensive API documentation with code examples, authentication guides, and testing tools. Our developer portal includes sandbox environments for testing integrations.",
      },
    ],
    account: [
      {
        question: "How do I update my account information?",
        answer:
          "You can update your account information by logging into your customer dashboard and navigating to Account Settings. Changes to billing information may require verification for security purposes.",
      },
      {
        question: "How do I add or remove team members?",
        answer:
          "Account administrators can manage team members through the Customer Dashboard. Go to Team Management to invite new users, assign roles, or remove access. Each user will receive email instructions to complete setup.",
      },
      {
        question: "Can I cancel my account?",
        answer:
          "Yes, you can cancel your account at any time. Contact our support team or submit a cancellation request through your customer dashboard. We'll process cancellations with 30 days notice as outlined in our terms of service.",
      },
    ],
  };

  const quickLinks = [
    {
      title: "Service Status",
      description: "Check real-time system status",
      link: "#",
    },
    {
      title: "Service Overview",
      description: "Explore our services",
      link: "/services",
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      link: "/contact",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      link: "#",
    },
  ];

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && categories.find(c => c.id === hash)) {
      setActiveCategory(hash);
    }
  }, []);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    window.location.hash = id;
  };

  const allFaqs = Object.values(faqData).flat();
  const searchResults = searchQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 border-b border-ink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find answers to common questions and get the support you need to
              maximize your VictorySync experience.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-white bg-ink-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <svg
                  className="absolute right-4 top-4 w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.link}>
                <div className="bg-ink-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <h3 className="font-semibold text-white mb-2">
                    {link.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search results — rendered when query active */}
        {searchQuery && (
          <div className="mb-12">
            <div className="bg-ink-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Search Results for "{searchQuery}"
              </h2>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                  <p className="text-gray-300">Try adjusting your search terms or browse our categories below.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {searchResults.map((faq, index) => (
                    <div key={index} className="border-b border-ink-700 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`grid lg:grid-cols-4 gap-8 ${searchQuery ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Categories Sidebar — anchor links for crawlability */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <nav aria-label="Help center categories" className="space-y-2">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  onClick={(e) => { e.preventDefault(); handleCategoryClick(category.id); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? "bg-cyan-500 text-white"
                      : "bg-ink-800 text-gray-300 hover:bg-ink-900"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* FAQ Content — all categories rendered in HTML for crawlability */}
          <div className="lg:col-span-3 space-y-0">
            {categories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className={activeCategory !== category.id ? 'hidden' : ''}
              >
                <div className="bg-ink-800 rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">{category.name}</h2>
                  <div className="space-y-6">
                    {faqData[category.id].map((faq, index) => (
                      <div key={index} className="border-b border-ink-700 pb-6 last:border-b-0">
                        <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-ink-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
            </Link>
            <button onClick={openCalendly} className="border border-ink-600 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 px-8 py-3 rounded-lg font-semibold transition-colors">
              Schedule a Call
            </button>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-semibold text-white mb-2">Email Support</h4>
              <p className="text-gray-300">info@victorysync.com</p>
              <p className="text-sm text-gray-400">Response within 2 hours</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Phone Support</h4>
              <p className="text-gray-300">+20 107 039 4707</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Live Chat</h4>
              <p className="text-gray-300">Available in your dashboard</p>
              <p className="text-sm text-gray-400">Instant response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
