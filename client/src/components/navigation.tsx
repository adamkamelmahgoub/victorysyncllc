import { Link, useLocation } from 'wouter';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCalendly } from '@/hooks/useCalendly';
import { useEffect, useRef, useState } from 'react';

const serviceLinks = [
  { href: '/inbound-support', label: 'Inbound Support' },
  { href: '/appointment-setting', label: 'Appointment Setting' },
  { href: '/cold-calling', label: 'Cold Calling' },
  { href: '/ai-automation', label: 'AI-Assisted Operations' },
  { href: '/services', label: 'All Services →' },
];

const navLinks = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/about-us', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { open } = useCalendly();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesActive = serviceLinks.some(link => link.href === location);
  const closeAndScroll = () => { setMobileOpen(false); setServicesOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  useEffect(() => {
    const close = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setServicesOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const linkClass = (active: boolean) => `text-sm font-medium transition-colors ${active ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={closeAndScroll} className="flex items-center gap-3">
          <img src="/LOGO_VS.png" alt="VictorySync" className="h-9 w-9 rounded-lg border border-slate-200 bg-white p-1" />
          <span className="text-lg font-bold tracking-tight text-slate-900">VictorySync</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/" onClick={closeAndScroll} className={linkClass(location === '/')}>Home</Link>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setServicesOpen(value => !value)} className={`flex items-center gap-1 ${linkClass(servicesActive)}`}>Services <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} /></button>
            {servicesOpen && <div className="absolute left-0 top-full mt-3 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">{serviceLinks.map(link => <Link key={link.href} href={link.href} onClick={closeAndScroll} className={`block rounded-md px-3 py-2.5 text-sm ${location === link.href ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}>{link.label}</Link>)}</div>}
          </div>
          {navLinks.map(link => <Link key={link.href} href={link.href} onClick={closeAndScroll} className={linkClass(location === link.href)}>{link.label}</Link>)}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? <><Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600">Dashboard</Link><button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-blue-600">Sign out</button></> : <a href="https://dashboard.victorysync.com" className="text-sm font-medium text-slate-600 hover:text-blue-600">Sign in</a>}
          <button onClick={open} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Book a Call</button>
        </div>

        <button onClick={() => setMobileOpen(value => !value)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Toggle navigation">{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>

      {mobileOpen && <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden"><div className="space-y-1"><Link href="/" onClick={closeAndScroll} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link><button onClick={() => setServicesOpen(value => !value)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Services <ChevronDown className={`h-4 w-4 ${servicesOpen ? 'rotate-180' : ''}`} /></button>{servicesOpen && <div className="ml-3 border-l border-slate-200 pl-3">{serviceLinks.map(link => <Link key={link.href} href={link.href} onClick={closeAndScroll} className="block px-3 py-2 text-sm text-slate-600 hover:text-blue-600">{link.label}</Link>)}</div>}{navLinks.map(link => <Link key={link.href} href={link.href} onClick={closeAndScroll} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{link.label}</Link>)}</div><div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">{isAuthenticated ? <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Sign out</button> : <a href="https://dashboard.victorysync.com" className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700">Sign in</a>}<button onClick={() => { open(); setMobileOpen(false); }} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Book a Call</button></div></div>}
    </nav>
  );
}
