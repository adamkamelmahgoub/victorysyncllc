import { Link } from 'wouter';
import closeBadge from '@assets/Close_PartnerBadge_Since25_1765323409008.webp';

const groups = [
  { title: 'Services', links: [['Inbound Support','/inbound-support'],['Appointment Setting','/appointment-setting'],['Cold Calling','/cold-calling'],['AI Automation','/ai-automation']] },
  { title: 'Industries', links: [['Home Services','/appointment-setting-for-home-services'],['Plumbers','/cold-calling-for-plumbers'],['Real Estate','/appointment-setting-for-real-estate'],['Law Firms','/inbound-support-for-law-firms']] },
  { title: 'Company', links: [['About','/about-us'],['Pricing','/pricing'],['Contact','/contact']] },
  { title: 'Resources', links: [['Help Center','/help-center'],['Privacy','/privacy-policy'],['Terms','/terms']] },
];

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-white py-16 text-slate-900">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3"><img src="/LOGO_VS.webp" alt="VictorySync" width="1024" height="1024" className="h-9 w-9 rounded-lg bg-white p-1"/><span className="text-lg font-bold">VictorySync</span></Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">US-managed contact center services delivered by trained Cairo-based agents, supported by practical AI tools.</p>
          <p className="mt-4 text-xs text-slate-600">Millstone, NJ · Cairo, Egypt</p>
          <img src={closeBadge} alt="Close Partner Since 2025" width="600" height="288" loading="lazy" className="mt-5 h-14" />
        </div>
        {groups.map(group=><div key={group.title}><h3 className="text-sm font-semibold text-slate-900">{group.title}</h3><ul className="mt-4 space-y-2.5">{group.links.map(([label,href])=><li key={label}><Link href={href} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="text-sm text-slate-600 hover:text-blue-600">{label}</Link></li>)}</ul></div>)}
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} VictorySync LLC. All rights reserved.</p><a href="mailto:info@victorysync.com" className="hover:text-blue-600">info@victorysync.com</a></div>
    </div>
  </footer>;
}
