
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <img
                className="h-8 w-auto"
                src="/LOGO_VS.png"
                alt="VictorySync"
              />
              <span className="text-xl font-bold text-gray-900">VictorySync</span>
            </NavLink>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={linkClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </NavLink>
            <NavLink to="/contact">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </NavLink>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="border-t pt-4">
                <NavLink
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/contact"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
