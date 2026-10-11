import { useEffect } from 'react';
import { openingHours, postalAddress, siteFacts, siteOrigin, starterPriceLabel } from '@/config/siteFacts';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export { siteOrigin } from '@/config/siteFacts';
export const pageMeta: Record<string, [string, string]> = {
  '/': ['VictorySync | Digital Marketing, Calling & Growth Operations', 'U.S.-managed growth partner: digital marketing and trained human agents who call, qualify, book, and help close leads.'],
  '/services': ['Call Center, BPO & Digital Marketing Services | VictorySync', 'Inbound support, appointment setting, cold calling, lead qualification, AI-assisted operations, and digital marketing for US businesses.'],
  '/how-it-works': ['How It Works | VictorySync', 'How VictorySync plans, launches, and reviews connected marketing and human-led calling workflows.'],
  '/faq': ['FAQ | VictorySync', 'Answers about VictorySync services, pricing, digital marketing, U.S. management, Cairo-based agents, and CRM workflows.'],
  '/clients': ['Clients | VictorySync', 'Featured VictorySync clients across home services, investment, and credit intelligence software.'],
  '/appointment-setting': ['Appointment Setting Services for US Businesses | VictorySync', 'Trained agents book qualified appointments straight into your calendar. US-managed outbound appointment setting for home services, real estate, legal, and SaaS.'],
  '/cold-calling': ['Cold Calling Services | Outbound Sales Calls | VictorySync', 'Professional outbound cold calling with area-code matched caller ID, call recording, and daily reporting. US-managed team, transparent connect and booking rates.'],
  '/live-transfers': ['Live Transfers & Lead Reactivation | VictorySync', 'Reconnect with eligible leads, qualify current interest, and transfer ready prospects to your team using approved rules.'],
  '/sales-closers': ['Sales Closers & Sales Conversations | VictorySync', 'Human-led sales conversations, approved offer guidance, qualified lead handoffs, and documented next steps.'],
  '/inbound-support': ['Inbound Customer Support Outsourcing | VictorySync', 'Stop missing calls. Trained agents answer, qualify, and book your inbound calls with US-led management and full call recording.'],
  '/ai-automation': ['AI Call Qualification & Routing | VictorySync', 'AI-assisted lead qualification and call routing layered on a human team, so every inbound lead is answered and qualified fast.'],
  '/digital-marketing': ['Digital Marketing Services | VictorySync', 'SEO, paid search, paid social, content, email marketing, websites, landing pages, and analytics connected to your lead follow-up process.'],
  '/pricing': ['Pricing | Call Center & Appointment Setting Rates | VictorySync', `Transparent pricing from $${siteFacts.starterRateUsd}/hr per agent for outbound calling, appointment setting, and inbound support.`],
  '/platform': ['Campaign Dashboard & Daily Reports | VictorySync', 'See every call, booking, and outcome from your VictorySync campaign: call recordings, connect and booking rates, and a daily summary in your inbox.'],
  '/about-us': ['About VictorySync | US-Managed, Cairo-Staffed', 'Founded and run from Millstone, NJ with a dedicated Cairo-based agent team. Meet the people answering your calls.'],
  '/contact': ['Contact VictorySync | Millstone, NJ', 'Contact VictorySync about inbound support, appointment setting, cold calling, lead qualification, AI-assisted operations, or digital marketing.'],
  '/book-call': ['Book a Call with VictorySync', 'Book a free consultation. We will look at your current lead flow and tell you what we would change.'],
  '/help-center': ['Help Center | VictorySync', 'Answers to common questions about VictorySync services, onboarding, and reporting.'],
  '/reviews': ['Reviews | VictorySync', 'Share your experience working with VictorySync on Google or Clutch.'],
  '/privacy-policy': ['Privacy Policy | VictorySync', 'How VictorySync collects, uses, and protects your data.'],
  '/terms': ['Terms of Service | VictorySync', 'Terms governing use of VictorySync services.'],
  '/appointment-setting-for-home-services': ['Appointment Setting for Home Services | VictorySync', 'Qualify home service inquiries and book useful estimates with US-managed appointment setting, clear intake rules, and organized handoffs.'],
  '/cold-calling-for-plumbers': ['Cold Calling for Plumbers | VictorySync', 'Reach property managers and commercial prospects with managed cold calling for plumbers, approved scripts, and clear reporting.'],
  '/answering-service-for-plumbers': ['Answering Service for Plumbers | VictorySync', `Trained agents answer your plumbing calls, sort emergencies from routine jobs, and book estimates into your calendar. From $${siteFacts.starterRateUsd}/hr. US-managed.`],
  '/appointment-setting-for-hvac': ['HVAC Appointment Setting & Call Answering | VictorySync', `Follow up on HVAC leads fast, qualify the job, and book service calls and estimates your techs can use. US-managed team, from $${siteFacts.starterRateUsd}/hr.`],
  '/appointment-setting-for-real-estate': ['Real Estate Appointment Setting | VictorySync', 'Follow up with real estate buyers and sellers, qualify timing and intent, and book useful agent conversations with organized handoffs.'],
  '/inbound-support-for-law-firms': ['Inbound Support for Law Firms | VictorySync', 'Answer law firm calls with trained agents, firm-approved intake questions, and clear routing to the right staff member.'],
};

const services: Record<string, string> = {
  '/appointment-setting': 'Appointment Setting',
  '/cold-calling': 'Cold Calling',
  '/live-transfers': 'Live Transfers and Lead Reactivation',
  '/sales-closers': 'Sales Closers',
  '/inbound-support': 'Inbound Customer Support',
  '/ai-automation': 'AI Call Qualification and Routing',
  '/digital-marketing': 'Digital Marketing',
  '/appointment-setting-for-home-services': 'Appointment Setting for Home Services',
  '/cold-calling-for-plumbers': 'Cold Calling for Plumbers',
  '/answering-service-for-plumbers': 'Answering Service for Plumbers',
  '/appointment-setting-for-hvac': 'Appointment Setting for HVAC Companies',
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
    const socialImage = ogImage || `${siteOrigin}/og-image.png`;
    setTag('meta[property="og:image"]', 'meta', { property: 'og:image', content: socialImage });
    setTag('meta[property="og:image:width"]', 'meta', { property: 'og:image:width', content: '1200' });
    setTag('meta[property="og:image:height"]', 'meta', { property: 'og:image:height', content: '630' });
    setTag('meta[name="twitter:image"]', 'meta', { name: 'twitter:image', content: socialImage });
    document.querySelector('script[data-victorysync-schema="page"]')?.remove();
    const schema: Record<string, unknown>[] = structuredData ? (Array.isArray(structuredData) ? [...structuredData] : [structuredData]) : [];
    if (path === '/' || path === '/contact') {
      schema.push({
        '@context': 'https://schema.org', '@type': ['Organization', 'LocalBusiness'], '@id': `${siteOrigin}/#organization`,
        name: siteFacts.brandName, legalName: siteFacts.legalName, alternateName: siteFacts.alternateNames,
        url: `${siteOrigin}/`, logo: `${siteOrigin}/LOGO_VS.png`,
        description: 'U.S.-managed growth partner connecting digital marketing with human-led calling, booking, support, and sales.',
        telephone: [siteFacts.phoneUS, '+1-732-328-6846'], email: siteFacts.email, priceRange: starterPriceLabel,
        address: { '@type': 'PostalAddress', ...postalAddress },
        areaServed: { '@type': 'Country', name: 'United States' },
        openingHours: siteFacts.hours,
        openingHoursSpecification: { '@type': 'OpeningHoursSpecification', ...openingHours },
        knowsAbout: ['Appointment setting', 'Cold calling', 'Lead qualification', 'Inbound customer support', 'Call answering'],
        contactPoint: [{ '@type': 'ContactPoint', telephone: siteFacts.phoneUS, contactType: 'sales', availableLanguage: 'English', areaServed: 'US' }],
        sameAs: [
          'https://clutch.co/profile/victorysync',
          'https://www.upwork.com/agencies/1956546855026415688/',
          'https://www.fiverr.com/s/NeNrP98',
          'https://www.facebook.com/profile.php?id=61578278896132',
          'https://www.instagram.com/victorysyncllc/',
          'https://share.google/SRBDGigTm0XPhvLk3',
        ],
      });
    }
    if (services[path]) {
      schema.push({ '@context': 'https://schema.org', '@type': 'Service', name: services[path],
        serviceType: services[path], provider: { '@id': `${siteOrigin}/#organization` },
        areaServed: { '@type': 'Country', name: 'United States' }, url: canonical });
    }
    if (path !== '/' && !schema.some((item) => item['@type'] === 'BreadcrumbList')) {
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
