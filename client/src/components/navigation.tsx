import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCalendly } from "@/hooks/useCalendly";
import { useState } from "react";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { open: openCalendly } = useCalendly();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about-us", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-ink-900/95 dark:bg-ink-900/95 backdrop-blur-sm border-b border-ink-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" onClick={scrollToTop}>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <img 
                src="/LOGO_VS.png" 
                alt="VictorySync Logo" 
                className="w-8 h-8 rounded-lg bg-white p-1 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-white dark:text-white">
                VictorySync
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`font-medium transition-colors cursor-pointer ${
                    location === link.href
                      ? "text-cyan-400 dark:text-cyan-400"
                      : "text-gray-300 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-cyan-400"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              onClick={openCalendly}
              className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-medium"
              data-testid="button-get-quote"
            >
              Get a Quote
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ink-700/50 bg-ink-900 dark:bg-ink-900">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium transition-colors ${
                    location === link.href
                      ? "text-cyan-400 dark:text-cyan-400"
                      : "text-gray-300 dark:text-gray-300"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-ink-700/50 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 dark:text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 dark:text-gray-300"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-300 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
              
              <Button
                onClick={() => {
                  openCalendly();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-medium"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
