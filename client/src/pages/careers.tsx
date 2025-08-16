import { Link } from 'wouter';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, TrendingUp, Heart } from 'lucide-react';
import SmartLink from '@/components/SmartLink';

export default function Careers() {
  const positions = [
    {
      title: "Customer Service Representative",
      department: "Operations",
      location: "Remote / Millstone, NJ",
      type: "Full-time",
      description: "Join our team of dedicated professionals providing exceptional customer support to US businesses.",
      requirements: [
        "Excellent written and verbal communication skills",
        "Previous customer service experience preferred",
        "Ability to work flexible hours including evenings and weekends",
        "Strong problem-solving abilities",
        "Comfortable with technology and learning new systems"
      ]
    },
    {
      title: "AI Automation Specialist",
      department: "Technology",
      location: "Millstone, NJ / Remote",
      type: "Full-time",
      description: "Lead the development and implementation of AI-powered automation solutions for our clients.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "Experience with AI/ML technologies and chatbot development",
        "Knowledge of workflow automation tools",
        "Strong analytical and problem-solving skills",
        "Experience with customer service platforms"
      ]
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      description: "Drive business growth by connecting with potential clients and showcasing our call center solutions.",
      requirements: [
        "2+ years of B2B sales experience",
        "Strong communication and presentation skills",
        "Experience with CRM systems",
        "Self-motivated and goal-oriented",
        "Understanding of call center or BPO industry preferred"
      ]
    },
    {
      title: "Team Lead - Operations",
      department: "Operations",
      location: "Millstone, NJ",
      type: "Full-time",
      description: "Lead and mentor a team of customer service representatives while ensuring quality standards.",
      requirements: [
        "3+ years of team leadership experience",
        "Strong background in customer service operations",
        "Excellent coaching and training abilities",
        "Experience with quality assurance processes",
        "Ability to work in a fast-paced environment"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-victory-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Build your career with VictorySync and help transform how businesses deliver exceptional customer service.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Work With Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose VictorySync?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-victory-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast-Growing Company</h3>
              <p className="text-gray-600">Join a rapidly expanding team that's transforming the customer service industry.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-victory-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Competitive Benefits</h3>
              <p className="text-gray-600">Comprehensive health insurance, retirement plans, and performance bonuses.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-victory-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Development</h3>
              <p className="text-gray-600">Ongoing training, certification programs, and career advancement opportunities.</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 bg-victory-purple hover:bg-victory-purple/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{position.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Application Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-victory-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-victory-purple font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit Application</h3>
              <p className="text-gray-600 text-sm">Send us your resume and cover letter through our careers portal.</p>
            </div>
            <div className="text-center">
              <div className="bg-victory-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-victory-purple font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Initial Screening</h3>
              <p className="text-gray-600 text-sm">Our HR team will review your application and conduct a phone screening.</p>
            </div>
            <div className="text-center">
              <div className="bg-victory-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-victory-purple font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interview Process</h3>
              <p className="text-gray-600 text-sm">Meet with team members and hiring managers through video or in-person interviews.</p>
            </div>
            <div className="text-center">
              <div className="bg-victory-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-victory-purple font-bold text-lg">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Welcome Aboard</h3>
              <p className="text-gray-600 text-sm">Complete onboarding and start your journey with VictorySync.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Join Our Team?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't see a position that fits? We're always looking for talented individuals to join our growing team.
          </p>
          <div className="space-x-4">
            <SmartLink to="/contact" className="btn btn-lg btn-primary">
              Apply Now
            </SmartLink>
            <Link href="/about-us">
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                Learn More About Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}