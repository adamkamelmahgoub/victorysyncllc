import { Link, useLocation } from 'wouter';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCalendly } from '@/hooks/useCalendly';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const serviceLinks = [
  { href: '/inbound-support', label: 'Inbound Support' },
  { href: '/appointment-setting', label: 'Appointment Setting' },
  { href: '/cold-calling', label: 'Cold Calling' },
  { href: '/ai-automation', label: 'AI-Assisted Operations' },
  { href: '/digital-marketing', label: 'Digital Marketing' },
  { href: '/services', label: 'All Services →' },
];

const navLinks = [
  { id: 'how-it-works', href: '/#how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { id: 'faq', href: '/#faq', label: 'FAQ' },
];

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { open } = useCalendly();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesActive = serviceLinks.some(link => link.href === location);
  const closeAndScroll = () => { setMobileOpen(false); setServicesOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setMobileOpen(false);
    setServicesOpen(false);

    if (location !== '/') return;

    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/#${id}`);
  };

  useEffect(() => {
    const close = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setServicesOpen(false); };
    const updateScroll = () => setScrolled(window.scrollY > 12);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => { document.removeEventListener('mousedown', close); window.removeEventListener('scroll', updateScroll); };
  }, []);

  const linkClass = (active: boolean) => `relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-violet-600 after:transition-transform ${active ? 'text-violet-700 after:scale-x-100' : 'text-slate-600 after:scale-x-0 hover:text-slate-950 hover:after:scale-x-100'}`;

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5 backdrop-blur-xl' : 'border-transparent bg-white/80 backdrop-blur-lg'}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 sm:px-8 ${scrolled ? 'h-16' : 'h-20'}`}>
        <Link href="/" onClick={closeAndScroll} className="flex items-center gap-3">
          <img src="/LOGO_VS.webp" alt="VictorySync" width="1024" height="1024" className="h-10 w-10 rounded-xl border border-violet-100 bg-white p-1 shadow-sm" />
          <span className="text-lg font-bold tracking-[-0.03em] text-slate-950">VictorySync</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/" onClick={closeAndScroll} className={linkClass(location === '/')}>Home</Link>
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-1"><Link href="/services" onClick={closeAndScroll} className={linkClass(servicesActive || location === '/services')}>Services</Link><button type="button" onClick={() => setServicesOpen(value => !value)} aria-label="Show services menu" aria-expanded={servicesOpen} className="rounded p-1 text-slate-600 hover:text-blue-600"><ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} /></button></div>
            <AnimatePresence>{servicesOpen && <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.18 }} className="absolute left-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">{serviceLinks.map(link => <Link key={link.href} href={link.href} onClick={closeAndScroll} className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${location === link.href ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>{link.label}</Link>)}</motion.div>}</AnimatePresence>
          </div>
          {navLinks.map(link => link.id ? <a key={link.href} href={link.href} onClick={(event) => goToSection(event, link.id!)} className={linkClass(false)}>{link.label}</a> : <Link key={link.href} href={link.href} onClick={closeAndScroll} className={linkClass(location === link.href)}>{link.label}</Link>)}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? <><Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600">Dashboard</Link><button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-blue-600">Sign out</button></> : <a href="https://dashboard.victorysync.com" className="text-sm font-medium text-slate-600 hover:text-blue-600">Sign in</a>}
          <button onClick={open} className="rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:from-violet-700 hover:to-violet-600">Get Started</button>
        </div>

        <button onClick={() => setMobileOpen(value => !value)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Toggle navigation">{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>

      <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden border-t border-slate-200/80 bg-white/95 px-5 backdrop-blur-xl md:hidden"><div className="space-y-1 py-4"><Link href="/" onClick={closeAndScroll} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link><div className="flex items-center justify-between"><Link href="/services" onClick={closeAndScroll} className="flex-1 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Services</Link><button type="button" onClick={() => setServicesOpen(value => !value)} aria-label="Show services menu" aria-expanded={servicesOpen} className="rounded-xl px-3 py-2.5 text-slate-700"><ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} /></button></div>{servicesOpen && <div className="ml-3 border-l border-violet-200 pl-3">{serviceLinks.map(link => <Link key={link.href} href={link.href} onClick={closeAndScroll} className="block px-3 py-2 text-sm text-slate-600 hover:text-violet-700">{link.label}</Link>)}</div>}{navLinks.map(link => link.id ? <a key={link.href} href={link.href} onClick={(event) => goToSection(event, link.id!)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{link.label}</a> : <Link key={link.href} href={link.href} onClick={closeAndScroll} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{link.label}</Link>)}</div><div className="mb-4 grid gap-2 border-t border-slate-200 pt-4">{isAuthenticated ? <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Sign out</button> : <a href="https://dashboard.victorysync.com" className="rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700">Sign in</a>}<button onClick={() => { open(); setMobileOpen(false); }} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white">Get Started</button></div></motion.div>}</AnimatePresence>
    </nav>
  );
}
