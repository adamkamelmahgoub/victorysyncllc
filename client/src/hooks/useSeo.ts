import { useEffect } from 'react';
import { CLUTCH_PROFILE_URL, EMAIL, LINKEDIN_URL, POSTAL_CODE, STREET_ADDRESS, US_PHONE, WHATSAPP } from '@/lib/site-config';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export const siteOrigin = 'https://www.victorysync.com';
export const pageMeta: Record<string, [string, string]> = {
  '/': ['VictorySync | US-Managed Call Center & Appointment Setting', 'US-managed call center with trained agents for appointment setting, cold calling, lead qualification, and inbound support. Serving US SMBs from Millstone, NJ.'],
  '/services': ['Call Center & BPO Services | VictorySync', 'Outbound appointment setting, cold calling, lead qualification, inbound support, and digital marketing for US small and mid-sized businesses.'],
  '/appointment-setting': ['Appointment Setting Services for US Businesses | VictorySync', 'Trained agents book qualified appointments straight into your calendar. US-managed outbound appointment setting for home services, real estate, legal, and SaaS.'],
  '/cold-calling': ['Cold Calling Services | Outbound Sales Calls | VictorySync', 'Professional outbound cold calling with area-code matched caller ID, call recording, and daily reporting. US-managed team, transparent connect and booking rates.'],
  '/inbound-support': ['Inbound Customer Support Outsourcing | VictorySync', 'Stop missing calls. Trained agents answer, qualify, and book your inbound calls with US-led management and full call recording.'],
  '/ai-automation': ['AI Call Qualification & Routing | VictorySync', 'AI-assisted lead qualification and call routing layered on a human team, so every inbound lead is answered and qualified fast.'],
  '/pricing': ['Pricing | Call Center & Appointment Setting Rates | VictorySync', 'Transparent pricing for outbound calling, appointment setting, and inbound support. Paid pilots available so you can test before you commit.'],
  '/platform': ['The VictorySync Platform | Call Tracking & Reporting', 'See every call, booking, and outcome in one dashboard. Call recordings, connect rates, booking rates, and daily performance summaries.'],
  '/about-us': ['About VictorySync | US-Managed, Cairo-Staffed', 'Founded and run from Millstone, NJ with a dedicated Cairo-based agent team. Meet the people answering your calls.'],
  '/contact': ['Contact VictorySync | Millstone, NJ', 'Get in touch with VictorySync. US-managed call center and digital marketing for small and mid-sized businesses.'],
  '/book-call': ['Book a Call with VictorySync', 'Book a free consultation. We will look at your current lead flow and tell you what we would change.'],
  '/help-center': ['Help Center | VictorySync', 'Answers to common questions about VictorySync services, onboarding, and reporting.'],
  '/privacy-policy': ['Privacy Policy | VictorySync', 'How VictorySync collects, uses, and protects your data.'],
  '/terms': ['Terms of Service | VictorySync', 'Terms governing use of VictorySync services.'],
  '/appointment-setting-for-home-services': ['Appointment Setting for Home Services | VictorySync', 'Qualify home service inquiries and book useful estimates with US-managed appointment setting, clear intake rules, and organized handoffs.'],
  '/cold-calling-for-plumbers': ['Cold Calling for Plumbers | VictorySync', 'Reach property managers and commercial prospects with managed cold calling for plumbers, approved scripts, and clear reporting.'],
  '/appointment-setting-for-real-estate': ['Real Estate Appointment Setting | VictorySync', 'Follow up with real estate buyers and sellers, qualify timing and intent, and book useful agent conversations with organized handoffs.'],
  '/inbound-support-for-law-firms': ['Inbound Support for Law Firms | VictorySync', 'Answer law firm calls with trained agents, firm-approved intake questions, and clear routing to the right staff member.'],
};

const services: Record<string, string> = {
  '/appointment-setting': 'Appointment Setting',
  '/cold-calling': 'Cold Calling',
  '/inbound-support': 'Inbound Customer Support',
  '/ai-automation': 'AI Call Qualification and Routing',
  '/appointment-setting-for-home-services': 'Appointment Setting for Home Services',
  '/cold-calling-for-plumbers': 'Cold Calling for Plumbers',
  '/appointment-setting-for-real-estate': 'Appointment Setting for Real Estate',
  '/inbound-support-for-law-firms': 'Inbound Support for Law Firms',
};

export function useSeo({ title, description, ogImage, structuredData }: SeoProps) {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const [pageTitle, pageDescription] = pageMeta[path] || [title, description];
    const canonical = siteOrigin + path;
    document.title = pageTitle;
    const setTag = (selector: string, tag: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector);
      if (!element) { element = document.createElement(tag); document.head.appendChild(element); }
      Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    };
    setTag('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical });
    setTag('meta[name="description"]', 'meta', { name: 'description', content: pageDescription });
    setTag('meta[property="og:title"]', 'meta', { property: 'og:title', content: pageTitle });
    setTag('meta[property="og:description"]', 'meta', { property: 'og:description', content: pageDescription });
    setTag('meta[property="og:url"]', 'meta', { property: 'og:url', content: canonical });
    setTag('meta[name="twitter:title"]', 'meta', { name: 'twitter:title', content: pageTitle });
    setTag('meta[name="twitter:description"]', 'meta', { name: 'twitter:description', content: pageDescription });
    if (ogImage) {
      setTag('meta[property="og:image"]', 'meta', { property: 'og:image', content: ogImage });
      setTag('meta[name="twitter:image"]', 'meta', { name: 'twitter:image', content: ogImage });
    }
    document.querySelector('script[data-victorysync-schema="page"]')?.remove();
    const schema: Record<string, unknown>[] = structuredData ? (Array.isArray(structuredData) ? [...structuredData] : [structuredData]) : [];
    if (path === '/' || path === '/contact') {
      schema.push({
        '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteOrigin}/#organization`,
        name: 'VictorySync LLC', url: siteOrigin + '/', logo: `${siteOrigin}/LOGO_VS.png`,
        description: 'US-managed contact center with trained Cairo-based agents for appointment setting, cold calling, lead qualification, and inbound support.',
        address: { '@type': 'PostalAddress', streetAddress: STREET_ADDRESS, addressLocality: 'Millstone Township', addressRegion: 'NJ', postalCode: POSTAL_CODE, addressCountry: 'US' },
        email: EMAIL,
        contactPoint: [
          { '@type': 'ContactPoint', telephone: US_PHONE, contactType: 'sales', availableLanguage: 'English', areaServed: 'US' },
          { '@type': 'ContactPoint', telephone: WHATSAPP, contactType: 'customer support', contactOption: 'WhatsApp', availableLanguage: 'English', areaServed: 'US' },
        ],
        sameAs: [
          'https://www.facebook.com/profile.php?id=61578278896132',
          'https://www.instagram.com/victorysyncllc/',
          'https://share.google/SRBDGigTm0XPhvLk3',
          'https://www.upwork.com/agencies/1956546855026415688/',
          'https://www.fiverr.com/s/NeNrP98',
          LINKEDIN_URL,
          CLUTCH_PROFILE_URL,
        ],
      });
      schema.push({
        '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': `${siteOrigin}/#professionalservice`,
        name: 'VictorySync LLC', url: siteOrigin + '/', telephone: US_PHONE, email: EMAIL, priceRange: 'From $10/hr',
        address: { '@type': 'PostalAddress', streetAddress: STREET_ADDRESS, addressLocality: 'Millstone Township', addressRegion: 'NJ', postalCode: POSTAL_CODE, addressCountry: 'US' },
        areaServed: { '@type': 'Country', name: 'United States' },
        openingHoursSpecification: { '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00', closes: '18:00' },
      });
    }
    if (services[path]) {
      schema.push({ '@context': 'https://schema.org', '@type': 'Service', name: services[path],
        serviceType: services[path], provider: { '@id': `${siteOrigin}/#organization` },
        areaServed: { '@type': 'Country', name: 'United States' }, url: canonical });
    }
    if (path !== '/') {
      schema.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin + '/' },
        { '@type': 'ListItem', position: 2, name: pageMeta[path]?.[0].split(' | ')[0] || path.slice(1).replace(/-/g, ' '), item: canonical },
      ] });
    }
    if (schema.length) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.victorysyncSchema = 'page';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.querySelector('script[data-victorysync-schema="page"]')?.remove(); };
  }, [title, description, ogImage, structuredData]);
}
