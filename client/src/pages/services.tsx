import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Users, Headphones, BarChart3, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Comprehensive business solutions tailored to your needs
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Support</h3>
              <p className="text-gray-600 mb-6">
                24/7 multilingual customer support with dedicated account management.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Headphones className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Call Center</h3>
              <p className="text-gray-600 mb-6">
                Professional call center services with experienced Egyptian talent.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics</h3>
              <p className="text-gray-600 mb-6">
                Advanced analytics and reporting to optimize your operations.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Globe className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Solutions</h3>
              <p className="text-gray-600 mb-6">
                Worldwide service delivery with local expertise and understanding.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
              <p className="text-gray-600 mb-6">
                Enterprise-grade security and compliance for your peace of mind.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Check className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600 mb-6">
                Rigorous quality control processes to ensure excellence.
              </p>
              <Link to="/contact">
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}