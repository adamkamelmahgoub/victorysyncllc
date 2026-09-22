import { Link } from 'wouter';
import { SiFacebook, SiFiverr, SiGoogle, SiInstagram, SiUpwork } from 'react-icons/si';
import closeBadge from '@assets/Close_PartnerBadge_Since25_1765323409008.webp';
import { CLUTCH_PROFILE_URL, EMAIL, HOURS, US_PHONE, US_PHONE_HREF, WHATSAPP, WHATSAPP_HREF } from '@/lib/site-config';
import { siteFacts, starterPriceLabel } from '@/config/siteFacts';

const groups = [
  { title: 'Services', links: [['Inbound Support','/inbound-support'],['Appointment Setting','/appointment-setting'],['Cold Calling','/cold-calling'],['AI Automation','/ai-automation'],['Digital Marketing','/digital-marketing']] },
  { title: 'Industries', links: [['Home Services','/appointment-setting-for-home-services'],['Plumber Answering','/answering-service-for-plumbers'],['Plumber Outreach','/cold-calling-for-plumbers'],['HVAC','/appointment-setting-for-hvac'],['Real Estate','/appointment-setting-for-real-estate'],['Law Firms','/inbound-support-for-law-firms']] },
  { title: 'Company', links: [['About','/about-us'],['Pricing','/pricing'],['Contact','/contact']] },
  { title: 'Resources', links: [['Help Center','/help-center'],['Reviews','/reviews'],['Privacy','/privacy-policy'],['Terms','/terms']] },
];

const profiles = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61578278896132', icon: SiFacebook, color: '#1877F2' },
  { label: 'Instagram', href: 'https://www.instagram.com/victorysyncllc/', icon: SiInstagram, color: '#E4405F' },
  { label: 'Google Business', href: 'https://share.google/SRBDGigTm0XPhvLk3', icon: SiGoogle, color: '#4285F4' },
  { label: 'Upwork', href: 'https://www.upwork.com/agencies/1956546855026415688/', icon: SiUpwork, color: '#14A800' },
  { label: 'Fiverr', href: 'https://www.fiverr.com/s/NeNrP98', icon: SiFiverr, color: '#1DBF73' },
];

export default function Footer() {
  return <footer className="relative overflow-hidden border-t border-white/10 bg-[#0A0F1E] py-20 text-white">
    <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" aria-hidden="true" />
    <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3"><img src="/LOGO_VS.webp" alt="VictorySync" width="1024" height="1024" className="h-10 w-10 rounded-xl bg-white p-1 shadow-lg shadow-violet-950/40"/><span className="text-lg font-bold tracking-tight text-white">VictorySync</span></Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">US-managed contact center services delivered by trained Cairo-based agents, supported by practical AI tools.</p>
          <p className="mt-4 text-xs text-slate-400">Millstone, NJ · Cairo, Egypt</p>
          <address className="mt-3 space-y-1 text-xs not-italic leading-5 text-slate-400">
            <p>{siteFacts.address}</p>
            <p><a href={US_PHONE_HREF} className="hover:text-violet-300">{US_PHONE}</a> · <a href={`mailto:${EMAIL}`} className="hover:text-violet-300">{EMAIL}</a></p>
            <p>{HOURS}</p>
            <p><a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="hover:text-violet-300">WhatsApp {WHATSAPP}</a></p>
          </address>
          <p className="mt-3 text-xs text-slate-400">Starter pricing {starterPriceLabel.toLowerCase()} per agent.</p>
          <div className="mt-5">
            <p className="text-sm font-semibold text-white">Close CRM partner</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">VictorySync is partnered with Close CRM to support organized sales workflows.</p>
            <img src={closeBadge} alt="Close partner since 2025" width="600" height="288" loading="lazy" className="mt-3 h-auto w-40 max-w-full" />
          </div>
        </div>
        {groups.map(group=><div key={group.title}><h3 className="text-sm font-semibold text-white">{group.title}</h3><ul className="mt-4 space-y-2.5">{group.links.map(([label,href])=><li key={label}><Link href={href} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="text-sm text-slate-400 transition-colors hover:text-violet-300">{label}</Link></li>)}</ul></div>)}
      </div>
      <div className="mt-14 border-t border-white/10 pt-8">
        <nav aria-label="VictorySync profiles" className="flex flex-wrap items-center gap-x-3 gap-y-3 text-sm">
          <span className="w-full font-semibold text-white sm:w-auto">Find us</span>
          {profiles.map(({ label, href, icon: Icon, color }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`VictorySync on ${label}`} title={label} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400" style={{ color }}><Icon aria-hidden="true" className="h-5 w-5" /></a>)}
          <a href={CLUTCH_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="VictorySync on Clutch" title="Clutch" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"><span aria-hidden="true" className="text-xl font-black text-red-600">C</span></a>
        </nav>
        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} {siteFacts.legalName}. All rights reserved.</p><a href={`mailto:${EMAIL}`} className="hover:text-violet-300">{EMAIL}</a></div>
      </div>
    </div>
  </footer>;
}
