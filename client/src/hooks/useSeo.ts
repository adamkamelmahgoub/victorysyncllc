import { useEffect } from 'react';

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
};

const services: Record<string, string> = {
  '/appointment-setting': 'Appointment Setting',
  '/cold-calling': 'Cold Calling',
  '/inbound-support': 'Inbound Customer Support',
  '/ai-automation': 'AI Call Qualification and Routing',
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
        address: { '@type': 'PostalAddress', addressLocality: 'Millstone', addressRegion: 'NJ', addressCountry: 'US' },
        contactPoint: { '@type': 'ContactPoint', telephone: '+201070394707', contactType: 'sales', availableLanguage: 'English', areaServed: 'US' },
        sameAs: [
          'https://www.facebook.com/profile.php?id=61578278896132',
          'https://www.instagram.com/victorysyncllc/',
          'https://share.google/SRBDGigTm0XPhvLk3',
          'https://www.upwork.com/agencies/1956546855026415688/',
          'https://www.fiverr.com/s/NeNrP98',
        ],
        // TODO(owner): add the verified LinkedIn profile URL if one exists.
      });
      schema.push({
        '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': `${siteOrigin}/#localbusiness`,
        name: 'VictorySync LLC', url: siteOrigin + '/', telephone: '+201070394707',
        address: { '@type': 'PostalAddress', addressLocality: 'Millstone', addressRegion: 'NJ', addressCountry: 'US' },
        areaServed: { '@type': 'Country', name: 'United States' },
        openingHoursSpecification: { '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00', closes: '18:00' },
        // TODO(owner): confirm the 9 AM–6 PM ET hours shown on /book-call are the public business hours.
        // TODO(owner): provide a public street address if the business wants it in LocalBusiness schema.
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
