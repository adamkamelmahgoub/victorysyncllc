import { Link, useLocation } from 'wouter';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const services = [
  ['All services', '/services'],
  ['Digital marketing', '/digital-marketing'],
  ['Appointment setting', '/appointment-setting'],
  ['Cold calling', '/cold-calling'],
  ['Live transfers', '/live-transfers'],
  ['Sales closers', '/sales-closers'],
  ['Inbound support', '/inbound-support'],
  ['AI and CRM workflows', '/ai-automation'],
];
const links = [
  ['How It Works', '/how-it-works'],
  ['Pricing', '/pricing'],
  ['FAQ', '/faq'],
  ['About us', '/about-us'],
  ['Contact', '/contact'],
];

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  const active = (path: string) => `vs-nav-link${location === path ? ' active' : ''}`;
  return <nav className={`vs-nav${open ? ' vs-nav-open' : ''}`} aria-label="Main navigation">
    <div className="vs-wrap vs-nav-inner">
      <Link href="/" className="vs-brand"><img src="/LOGO_VS.webp" alt="" width="44" height="44" /><span>VictorySync</span></Link>
      <div className="vs-nav-desktop">
        <div className="vs-nav-service">
          <Link href="/services" className={active('/services')}>Services</Link>
          <button type="button" aria-label="Show services" aria-expanded={servicesOpen} aria-controls="desktop-services" onClick={() => setServicesOpen(value => !value)}><ChevronDown size={15} /></button>
          {servicesOpen && <div id="desktop-services" className="vs-nav-dropdown">{services.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>}
        </div>
        {links.map(([label, href]) => <Link key={href} href={href} className={active(href)}>{label}</Link>)}
      </div>
      <div className="vs-nav-right">
        {isAuthenticated ? <><Link href="/dashboard" className="vs-nav-link">Dashboard</Link><button type="button" className="vs-nav-link" onClick={logout}>Sign out</button></> : <a href="https://dashboard.victorysync.com" className="vs-nav-link">Sign in</a>}
        <Link href="/book-call" className="vs-nav-cta">Book a Consultation <ArrowUpRight size={15} /></Link>
      </div>
      <button type="button" className="vs-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
    </div>
    {open && <div id="mobile-navigation" className="vs-mobile-menu"><div className="vs-wrap">
      <div className="vs-mobile-services"><Link href="/services" onClick={() => setOpen(false)}>Services</Link><button type="button" aria-label="Show service pages" aria-expanded={mobileServicesOpen} aria-controls="mobile-services" onClick={() => setMobileServicesOpen(value => !value)}><ChevronDown size={18} /></button></div>
      {mobileServicesOpen && <div id="mobile-services" className="vs-mobile-submenu">{services.slice(1).map(([label, href]) => <Link className="vs-mobile-sub" href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}</div>}
      {links.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
      {isAuthenticated ? <><Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link><button type="button" className="vs-mobile-link" onClick={() => { logout(); setOpen(false); }}>Sign out</button></> : <a href="https://dashboard.victorysync.com">Sign in</a>}
      <Link href="/book-call" className="vs-nav-cta" onClick={() => setOpen(false)}>Book a Consultation <ArrowUpRight size={16} /></Link>
    </div></div>}
  </nav>;
}
