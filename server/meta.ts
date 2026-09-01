import { blogPostsMeta } from '../shared/blogPosts';

const BASE_URL = 'https://victorysync.com';
const DEFAULT_IMAGE = `${BASE_URL}/LOGO_VS.png`;

interface RouteMeta {
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
  canonical?: string;
}

const STATIC_ROUTES: Record<string, RouteMeta> = {
  '/': {
    title: 'VictorySync | Human-Led Call Center & Appointment Setting',
    description: 'US-managed call center services with trained Cairo-based agents for appointment setting, cold calling, lead qualification, and inbound customer support.',
    ogType: 'website',
  },
  '/services': {
    title: 'Call Center Services for US Businesses | VictorySync',
    description: 'Explore human-led inbound support, cold calling, lead qualification, appointment setting, and follow-up services managed for US SMBs.',
  },
  '/inbound-support': {
    title: 'Inbound Customer Support Services | VictorySync',
    description: 'Outsource calls, email, chat, and ticket support to trained agents with US-led account management, quality review, and flexible coverage.',
  },
  '/appointment-setting': {
    title: 'B2B Appointment Setting Services | VictorySync',
    description: 'Trained agents follow up, qualify prospects, and book sales appointments directly into your calendar with clear notes and reporting.',
  },
  '/cold-calling': {
    title: 'Cold Calling & Outbound Calling Services | VictorySync',
    description: 'Managed outbound campaigns with trained English-speaking agents, client-approved scripts, lead qualification, and appointment booking.',
  },
  '/ai-automation': {
    title: 'AI-Assisted Contact Center Operations | VictorySync',
    description: 'Help human agents work faster with AI-assisted call summaries, qualification prompts, CRM updates, routing, QA signals, and reporting.',
  },
  '/about': {
    title: 'About VictorySync | US-Managed Contact Center, Millstone NJ',
    description: 'VictorySync is a US-managed contact center with trained agents in Cairo, Egypt. We help US businesses scale support and sales without in-house hiring overhead.',
  },
  '/about-us': {
    title: 'About VictorySync | US-Managed, Cairo-Based Contact Center',
    description: 'Meet the human-led contact center team helping US SMBs improve calling, qualification, appointment setting, and customer support.',
  },
  '/platform': {
    title: 'Platform | VictorySync Contact Center Technology',
    description: 'See the tools VictorySync agents use for call summaries, CRM integrations, qualification, appointment booking, routing, and campaign reporting.',
  },
  '/pricing': {
    title: 'Pricing | VictorySync Contact Center Services',
    description: 'Flexible pricing for inbound support, appointment setting, cold calling, and lead follow-up with managed human agents. Plans start from $10 per hour.',
  },
  '/contact': {
    title: 'Contact VictorySync | Get a Free Quote',
    description: 'Contact VictorySync to discuss your contact center needs. Schedule a free strategy call or send us a message. Based in Millstone, NJ.',
  },
  '/book-call': {
    title: 'Book a Free Strategy Call | VictorySync Contact Center',
    description: 'Schedule a call with VictorySync to map your inbound support, outbound calling, qualification, appointment-setting, or lead-follow-up workflow.',
  },
  '/careers': {
    title: 'Careers at VictorySync | Join Our Contact Center Team',
    description: 'VictorySync is hiring customer service representatives, appointment setters, and operations staff. Remote and Millstone NJ positions available.',
  },
  '/help-center': {
    title: 'Help Center | VictorySync Support & Documentation',
    description: 'Get help with VictorySync inbound support, appointment setting, cold calling, reporting, agent workflows, and account operations.',
  },
  '/docs': {
    title: 'Documentation | VictorySync Integration & API Guides',
    description: 'Technical documentation for VictorySync integrations, webhooks, and reporting APIs. Connect your CRM, calendar, and communication tools.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | VictorySync',
    description: 'VictorySync privacy policy — how we collect, use, and protect your personal information when you use our contact center services.',
  },
  '/terms': {
    title: 'Terms of Service | VictorySync',
    description: 'VictorySync terms of service — the terms and conditions governing use of our contact center and AI automation services.',
  },
  '/blog': {
    title: 'Blog | Contact Center & Customer Service Insights | VictorySync',
    description: 'Tips, guides, and insights on inbound support, appointment setting, cold calling, and AI automation for US businesses. From the VictorySync team.',
    ogType: 'website',
  },
};

function getRouteMeta(pathname: string): RouteMeta | null {
  if (STATIC_ROUTES[pathname]) {
    return STATIC_ROUTES[pathname];
  }

  const blogSlugMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogSlugMatch) {
    const slug = blogSlugMatch[1];
    const post = blogPostsMeta.find(p => p.slug === slug);
    if (post) {
      return {
        title: `${post.title} | VictorySync Blog`,
        description: post.excerpt,
        ogType: 'article',
        ogImage: post.image,
        canonical: `${BASE_URL}/blog/${post.slug}`,
      };
    }
    return {
      title: 'Blog | VictorySync',
      description: 'Read insights and guides from the VictorySync contact center team.',
      ogType: 'article',
    };
  }

  return null;
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function injectRouteMeta(html: string, pathname: string): string {
  const meta = getRouteMeta(pathname);
  if (!meta) return html;

  const canonical = meta.canonical ?? `${BASE_URL}${pathname}`;
  const image = meta.ogImage ?? DEFAULT_IMAGE;
  const ogType = meta.ogType ?? 'website';
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);
  const canonicalEsc = escapeAttr(canonical);
  const imageEsc = escapeAttr(image);

  let result = html;

  result = result.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  result = result.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${description}$2`,
  );

  result = result.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${title}$2`,
  );
  result = result.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${description}$2`,
  );
  result = result.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonicalEsc}$2`,
  );
  result = result.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
    `$1${imageEsc}$2`,
  );
  result = result.replace(
    /(<meta\s+property="og:type"\s+content=")[^"]*(")/,
    `$1${ogType}$2`,
  );

  result = result.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${title}$2`,
  );
  result = result.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${description}$2`,
  );
  result = result.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${imageEsc}$2`,
  );

  result = result.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonicalEsc}$2`,
  );

  return result;
}
