
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">VictorySync</h3>
            <p className="text-gray-400">Professional call center services and AI automation solutions.</p>
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/services" className="hover:text-white">Call Center</a></li>
              <li><a href="/services" className="hover:text-white">AI Automation</a></li>
              <li><a href="/services" className="hover:text-white">Marketing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about-us" className="hover:text-white">About Us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help-center" className="hover:text-white">Help Center</a></li>
              <li><a href="/docs" className="hover:text-white">Documentation</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 VictorySync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
