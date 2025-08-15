import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="VictorySync - Strategic Business Solutions for Growth"
        description="Empowering businesses with strategic solutions that drive growth, efficiency, and lasting success in today's competitive marketplace."
        canonical="https://victorysync.com/"
        ogTitle="VictorySync - Strategic Business Solutions for Growth"
        ogDescription="Empowering businesses with strategic solutions that drive growth, efficiency, and lasting success in today's competitive marketplace."
        ogImage="/LOGO_VS.png"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Strategic Solutions for
                <span className="text-blue-600 block">Business Victory</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Empowering businesses with strategic solutions that drive growth, efficiency, and lasting success in today's competitive marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    Get Started Today
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose VictorySync?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We deliver comprehensive solutions that transform challenges into opportunities for sustainable growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <CardTitle>Strategic Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive strategic planning that aligns with your business goals and market opportunities.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle>Growth Acceleration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Proven methodologies to accelerate your business growth and maximize market penetration.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <CardTitle>Operational Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Streamline operations and optimize processes for maximum efficiency and productivity.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive solutions tailored to meet your unique business challenges and opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Strategy</h3>
                <p className="text-gray-600 mb-4">
                  Develop winning strategies that position your business for long-term success and competitive advantage.
                </p>
                <Link to="/services" className="text-blue-600 hover:text-blue-700 font-medium">
                  Learn More →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Digital Transformation</h3>
                <p className="text-gray-600 mb-4">
                  Modernize your operations with cutting-edge technology solutions and digital innovations.
                </p>
                <Link to="/services" className="text-blue-600 hover:text-blue-700 font-medium">
                  Learn More →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Optimization</h3>
                <p className="text-gray-600 mb-4">
                  Maximize efficiency and productivity through data-driven performance optimization strategies.
                </p>
                <Link to="/services" className="text-blue-600 hover:text-blue-700 font-medium">
                  Learn More →
                </Link>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link to="/services">
                <Button size="lg" variant="outline">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful businesses that have achieved victory with our strategic solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="px-8 py-3">
                  Get Free Consultation
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}