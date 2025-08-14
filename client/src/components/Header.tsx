
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onCartClick?: () => void;
  cartItemCount?: number;
  showCart?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, cartItemCount = 0, showCart = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-victory-card border-b border-gray-100' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="victory-container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" onClick={handleLinkClick} className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleLinkClick}
                  className={`font-medium transition-colors duration-200 ${
                    isActiveLink(link.href)
                      ? 'text-victory-purple font-semibold'
                      : 'text-victory-gray hover:text-victory-purple'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={handleLinkClick}>
                  <button className="victory-btn-primary">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={handleLinkClick}>
                    <button className="victory-btn-outline">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register" onClick={handleLinkClick}>
                    <button className="victory-btn-primary">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-victory-gray hover:text-victory-purple transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-victory-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleLinkClick}
                  className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                    isActiveLink(link.href)
                      ? 'text-victory-purple bg-victory-light-gray font-semibold'
                      : 'text-victory-gray hover:text-victory-purple hover:bg-victory-light-gray'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 space-y-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={handleLinkClick}>
                    <button className="w-full victory-btn-primary">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={handleLinkClick}>
                      <button className="w-full victory-btn-outline">
                        Sign In
                      </button>
                    </Link>
                    <Link to="/register" onClick={handleLinkClick}>
                      <button className="w-full victory-btn-primary">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
