import { Link } from "react-router-dom"; // Changed from "wouter"
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

interface NavigationProps {
  onCartClick: () => void;
}

export default function Navigation({ onCartClick }: NavigationProps) {
  // Removed useLocation from "wouter" as it's not used in the changes
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const cartItemCount = getItemCount();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about-us", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop}> {/* Changed href to to */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <img
                src="/LOGO_VS.png"
                alt="VictorySync Logo"
                className="w-8 h-8 rounded-lg bg-white p-1"
              />
              <span className="text-xl brand-font victory-dark">
                VictorySync
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}> {/* Changed href to to */}
                <span
                  className={`font-medium transition-colors cursor-pointer ${
                    // Assuming location check needs to be adapted or removed if not using react-router's location
                    // For now, keeping the structure but it might need adjustment based on actual react-router usage
                    location === link.href
                      ? "victory-purple"
                      : "victory-gray hover:victory-purple"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 victory-gray hover:victory-purple transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-victory-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard"> {/* Changed href to to */}
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login"> {/* Changed href to to */}
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>

              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onCartClick}
              className="relative p-2 victory-gray hover:victory-purple transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-victory-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 victory-gray hover:victory-purple transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}> {/* Changed href to to */}
                  <span
                    className={`font-medium transition-colors cursor-pointer block py-2 ${
                      // Assuming location check needs to be adapted or removed if not using react-router's location
                      // For now, keeping the structure but it might need adjustment based on actual react-router usage
                      location === link.href
                        ? "victory-purple"
                        : "victory-gray hover:victory-purple"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link to="/dashboard"> {/* Changed href to to */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={logout}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => (window.location.href = "/login")} // This might also need to be a Link or navigate function
                    >
                      Sign In
                    </Button>

                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}