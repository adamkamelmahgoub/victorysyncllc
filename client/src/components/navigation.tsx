
import React from 'react';

interface NavigationProps {
  onCartClick?: () => void;
}

export default function Navigation({ onCartClick }: NavigationProps) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">VictorySync</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/services" className="text-gray-700 hover:text-blue-600">Services</a>
            <a href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
