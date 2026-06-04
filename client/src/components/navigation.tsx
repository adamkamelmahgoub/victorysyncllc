import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCalendly } from "@/hooks/useCalendly";
import { useState, useRef, useEffect } from "react";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const serviceLinks = [
  { href: "/inbound-support", label: "Inbound Support" },
  { href: "/appointment-setting", label: "Appointment Setting" },
  { href: "/cold-calling", label: "Cold Calling" },
  { href: "/ai-automation", label: "AI Automation" },
  { href: "/services", label: "All Services →" },
];

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { open: openCalendly } = useCalendly();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isServicesActive = ["/services", "/inbound-support", "/appointment-setting", "/cold-calling", "/ai-automation"].includes(location);

  return (
    <nav className="sticky top-0 z-50 bg-ink-900/90 backdrop-blur-md border-b border-ink-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={scrollToTop}>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <img
                src="/LOGO_VS.png"
                alt="VictorySync Logo"
                className="w-8 h-8 rounded-lg bg-white p-1 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-white">VictorySync</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/" onClick={scrollToTop}>
              <span className={`font-medium transition-colors cursor-pointer text-sm ${location === "/" ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`}>
                Home
              </span>
            </Link>

            {/* Services dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1 font-medium transition-colors text-sm ${isServicesActive ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 rounded-xl bg-ink-800 border border-ink-700 shadow-xl py-2 z-50">
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        onClick={() => { scrollToTop(); setServicesOpen(false); }}
                        className={`block px-4 py-2 text-sm transition-colors cursor-pointer ${
                          location === link.href
                            ? "text-cyan-400 bg-cyan-500/5"
                            : "text-slate-300 hover:text-cyan-400 hover:bg-ink-700/50"
                        } ${link.href === "/services" ? "border-t border-ink-700 mt-1 pt-3 text-cyan-400/80" : ""}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/pricing" onClick={scrollToTop}>
              <span className={`font-medium transition-colors cursor-pointer text-sm ${location === "/pricing" ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`}>
                Pricing
              </span>
            </Link>

            <Link href="/about-us" onClick={scrollToTop}>
              <span className={`font-medium transition-colors cursor-pointer text-sm ${location === "/about-us" ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`}>
                About
              </span>
            </Link>

            <Link href="/blog" onClick={scrollToTop}>
              <span className={`font-medium transition-colors cursor-pointer text-sm ${location === "/blog" ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`}>
                Blog
              </span>
            </Link>

            <Link href="/contact" onClick={scrollToTop}>
              <span className={`font-medium transition-colors cursor-pointer text-sm ${location === "/contact" ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"}`}>
                Contact
              </span>
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={scrollToTop}>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-300 hover:text-white">
                  Sign Out
                </Button>
              </>
            ) : (
              <a href="https://dashboard.victorysync.com">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </a>
            )}
            <Button
              onClick={openCalendly}
              className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
              data-testid="button-get-quote"
            >
              Book a Call
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ink-700/50 bg-ink-800/95">
          <div className="px-4 py-4 space-y-1">
            <Link href="/">
              <div onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className={`block py-2.5 px-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${location === "/" ? "text-cyan-400 bg-cyan-500/5" : "text-slate-300"}`}>
                Home
              </div>
            </Link>

            {/* Services group */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg font-medium text-sm transition-colors ${isServicesActive ? "text-cyan-400" : "text-slate-300"}`}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServicesOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-ink-700 pl-4">
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div
                        onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}
                        className={`block py-2 text-sm transition-colors cursor-pointer ${location === link.href ? "text-cyan-400" : "text-slate-400 hover:text-cyan-400"}`}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/pricing">
              <div onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className={`block py-2.5 px-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${location === "/pricing" ? "text-cyan-400 bg-cyan-500/5" : "text-slate-300"}`}>
                Pricing
              </div>
            </Link>

            <Link href="/about-us">
              <div onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className={`block py-2.5 px-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${location === "/about-us" ? "text-cyan-400 bg-cyan-500/5" : "text-slate-300"}`}>
                About
              </div>
            </Link>

            <Link href="/blog">
              <div onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className={`block py-2.5 px-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${location === "/blog" ? "text-cyan-400 bg-cyan-500/5" : "text-slate-300"}`}>
                Blog
              </div>
            </Link>

            <Link href="/contact">
              <div onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className={`block py-2.5 px-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${location === "/contact" ? "text-cyan-400 bg-cyan-500/5" : "text-slate-300"}`}>
                Contact
              </div>
            </Link>

            <div className="pt-4 border-t border-ink-700/50 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}>
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <a href="https://dashboard.victorysync.com">
                  <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Button>
                </a>
              )}
              <Button
                onClick={() => { openCalendly(); setMobileMenuOpen(false); }}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold mt-2"
              >
                Book a Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
