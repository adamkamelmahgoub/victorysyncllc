import { Link } from 'wouter';
import { SiFacebook, SiFiverr, SiGoogle, SiInstagram, SiUpwork } from 'react-icons/si';
import closeBadge from '@assets/Close_PartnerBadge_Since25_1765323409008.webp';
import { CLUTCH_PROFILE_URL, CLOSE_PARTNER_URL, EMAIL, HOURS, US_PHONE, US_PHONE_HREF, WHATSAPP, WHATSAPP_HREF } from '@/lib/site-config';
import { siteFacts } from '@/config/siteFacts';

const groups = [
  { title: 'Services', links: [['Inbound Support','/inbound-support'],['Appointment Setting','/appointment-setting'],['Cold Calling','/cold-calling'],['Live Transfers','/live-transfers'],['Sales Closers','/sales-closers'],['AI Automation','/ai-automation'],['Digital Marketing','/digital-marketing']] },
  { title: 'Industries', links: [['Home Services','/appointment-setting-for-home-services'],['Plumber Answering','/answering-service-for-plumbers'],['Plumber Outreach','/cold-calling-for-plumbers'],['HVAC','/appointment-setting-for-hvac'],['Real Estate','/appointment-setting-for-real-estate'],['Law Firms','/inbound-support-for-law-firms']] },
  { title: 'Company', links: [['About','/about-us'],['How It Works','/how-it-works'],['Pricing','/pricing'],['Contact','/contact'],['Reviews','/reviews']] },
  { title: 'Resources', links: [['FAQ','/faq'],['Help Center','/help-center'],['Privacy Policy','/privacy-policy'],['Terms of Service','/terms']] },
];
const profiles = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61578278896132', icon: SiFacebook },
  { label: 'Instagram', href: 'https://www.instagram.com/victorysyncllc/', icon: SiInstagram },
  { label: 'Google Business', href: 'https://share.google/SRBDGigTm0XPhvLk3', icon: SiGoogle },
  { label: 'Upwork', href: 'https://www.upwork.com/agencies/1956546855026415688/', icon: SiUpwork },
  { label: 'Fiverr', href: 'https://www.fiverr.com/s/NeNrP98', icon: SiFiverr },
];
export default function Footer() {
  return <footer className="vs-footer"><div className="vs-wrap"><div className="vs-footer-grid"><div className="vs-footer-brand"><Link href="/" className="vs-footer-logo"><img src="/LOGO_VS.webp" alt="VictorySync" width="46" height="46" />VictorySync</Link><p>U.S.-managed growth partner connecting digital marketing with human-led calling, booking, support, and sales.</p><address><span>{siteFacts.address}</span><a href={US_PHONE_HREF}>{US_PHONE}</a><a href="tel:+17323286846">+1 (732) 328-6846</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><span>{HOURS}</span><a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">WhatsApp {WHATSAPP}</a></address><div className="vs-footer-badges"><a href={CLUTCH_PROFILE_URL} target="_blank" rel="noopener noreferrer">clutch<span>.</span></a><a href={CLOSE_PARTNER_URL} target="_blank" rel="noopener noreferrer" aria-label="View VictorySync in the Close Partner Directory"><img src={closeBadge} alt="Close CRM partner" width="120" height="58" loading="lazy" /></a></div></div>{groups.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></div>)}</div><div className="vs-footer-bottom"><div className="vs-socials">{profiles.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon /></a>)}<a href={CLUTCH_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="Clutch">C</a></div><a href="https://join.victorysync.com" target="_blank" rel="noopener noreferrer">Jobs ↗</a><button type="button" onClick={() => window.dispatchEvent(new Event('vs:privacy-settings'))}>Your Privacy Choices</button><span>© 2026 Victory Sync LLC. All rights reserved.</span></div></div></footer>;
}
