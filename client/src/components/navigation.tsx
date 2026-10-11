import { Link, useLocation } from 'wouter';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const services = [
  { label: 'All services', href: '/services' },
  { label: 'Digital marketing', href: '/digital-marketing' },
  { label: 'Appointment setting', href: '/appointment-setting' },
  { label: 'Cold calling', href: '/cold-calling' },
  { label: 'Live transfers', href: '/live-transfers' },
  { label: 'Sales closers', href: '/sales-closers' },
  { label: 'Inbound support', href: '/inbound-support' },
  { label: 'AI and CRM workflows', href: '/ai-automation' },
];
const links = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Clients', href: '/clients' },
  { label: 'FAQ', href: '/faq' },
];

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  useEffect(() => { setOpen(false); setServicesOpen(false); }, [location]);
  const linkClass = (path: string) => `vs-nav-link${location === path ? ' active' : ''}`;
  return <nav className="vs-nav" aria-label="Main navigation"><div className="vs-wrap vs-nav-inner"><Link href="/" className="vs-brand"><img src="/LOGO_VS.webp" alt="" width="44" height="44" /><span>VictorySync</span></Link><div className="vs-nav-desktop"><div className="vs-nav-service"><Link href="/services" className={linkClass('/services')}>Services</Link><button type="button" aria-label="Show services" aria-expanded={servicesOpen} onClick={() => setServicesOpen(value => !value)}><ChevronDown size={15} /></button>{servicesOpen && <div className="vs-nav-dropdown">{services.map(item => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div>}</div>{links.map(item => <Link key={item.href} href={item.href} className={linkClass(item.href)}>{item.label}</Link>)}</div><div className="vs-nav-right">{isAuthenticated ? <><Link href="/dashboard" className="vs-nav-link">Dashboard</Link><button type="button" className="vs-nav-link" onClick={logout}>Sign out</button></> : <a href="https://dashboard.victorysync.com" className="vs-nav-link">Sign in</a>}<Link href="/book-call" className="vs-nav-cta">Book a Consultation <ArrowUpRight size={15}/></Link></div><button type="button" className="vs-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? <X size={24}/> : <Menu size={24}/>}</button></div>{open && <div className="vs-mobile-menu"><div className="vs-wrap"><Link href="/services">Services</Link>{services.map(item => <Link className="vs-mobile-sub" href={item.href} key={item.href}>{item.label}</Link>)}{links.map(item => <Link href={item.href} key={item.href}>{item.label}</Link>)}<Link href="/about-us">About us</Link><Link href="/contact">Contact</Link>{isAuthenticated ? <Link href="/dashboard">Dashboard</Link> : <a href="https://dashboard.victorysync.com">Sign in</a>}<Link href="/book-call" className="vs-nav-cta">Book a Consultation <ArrowUpRight size={16}/></Link></div></div>}</nav>;
}
