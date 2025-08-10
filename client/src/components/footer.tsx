
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-victory-dark-gray text-white">
      <div className="victory-container">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Logo className="h-8 w-auto" variant="white" />
            <p className="text-gray-300 leading-relaxed">
              Transform your customer service with AI-powered automation. 
              Reduce costs by 60% while improving customer satisfaction.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/victorysync" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/victorysync" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/victorysync" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/victorysync" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/services" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  AI Call Automation
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Inbound Call Centers
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Outbound Campaigns
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Lead Generation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={handleLinkClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-victory-purple mt-0.5" />
                <span className="text-gray-300">
                  Millstone, New Jersey<br />
                  United States
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-victory-purple" />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-victory-purple" />
                <a 
                  href="mailto:hello@victorysync.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  hello@victorysync.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} VictorySync. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy-policy" 
                onClick={handleLinkClick}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                onClick={handleLinkClick}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/help-center" 
                onClick={handleLinkClick}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
