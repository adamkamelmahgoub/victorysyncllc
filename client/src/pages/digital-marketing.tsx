import { Link } from 'wouter';
import { BarChart3, CheckCircle2, FileText, Mail, Megaphone, PanelsTopLeft, Search, Share2 } from 'lucide-react';
import { MotionPage } from '@/components/motion-page';
import { Section } from '@/components/section';
import { siteFacts } from '@/config/siteFacts';
import { useSeo } from '@/hooks/useSeo';

const disciplines = [
  {
    icon: Search,
    title: 'SEO',
    copy: 'We review how people search for your services, how your pages answer those searches, and whether search engines can understand the site. Work can include keyword research, technical checks, page structure, local search content, internal linking, metadata, and practical content briefs. Recommendations are tied to the services and locations you actually want to grow.',
  },
  {
    icon: Megaphone,
    title: 'Paid search',
    copy: 'Paid search campaigns begin with the offer, service area, landing page, and action you want a prospect to take. We organize keywords, exclusions, ads, budgets, conversion tracking, and lead routing around that goal. Search terms and lead quality are reviewed together so spend is not judged only by clicks.',
  },
  {
    icon: Share2,
    title: 'Paid social',
    copy: 'For paid social, we map the audience, message, creative angle, destination, and follow-up path before launching. Campaigns can support lead generation, remarketing, or awareness. Creative and targeting decisions are reviewed against actual inquiries and booked conversations, not engagement metrics alone.',
  },
  {
    icon: FileText,
    title: 'Content marketing',
    copy: 'Content should help a real buyer understand a problem, compare options, and choose a next step. We can plan and produce service pages, landing-page copy, articles, campaign messages, and supporting creative. Your team approves positioning, offers, and factual claims before publication.',
  },
  {
    icon: Mail,
    title: 'Email marketing',
    copy: 'Email programs can cover lead follow-up, nurture sequences, customer education, re-engagement, and campaign announcements. We define the audience, trigger, sequence, message, and handoff. Sending rules, consent requirements, suppression lists, and brand approval remain part of the operating plan.',
  },
  {
    icon: PanelsTopLeft,
    title: 'Websites and landing pages',
    copy: 'A campaign page needs a clear offer, useful proof, an understandable form, and a next step that works on mobile. We can improve existing pages or build focused landing pages for specific services and campaigns. The work connects page copy, form fields, tracking, and lead delivery so inquiries reach the right workflow.',
  },
  {
    icon: BarChart3,
    title: 'Analytics and reporting',
    copy: 'Reporting connects traffic and campaign activity to meaningful outcomes. We define the events and lead stages that matter, check that tracking is working, and organize a readable performance view. Reviews focus on what changed, what the data supports, and which next test is worth running.',
  },
];

const workflow = [
  ['01', 'Define the commercial goal', 'We start with the service, customer, geography, sales process, capacity, and outcome you want. That keeps channel choices grounded in the business instead of a generic marketing checklist.'],
  ['02', 'Audit the current path', 'We examine the website, campaigns, content, tracking, forms, CRM handoff, and follow-up process you make available. The audit identifies where attention is being lost and where measurement is incomplete.'],
  ['03', 'Build the approved plan', 'You receive a clear scope covering channels, audiences, messages, assets, responsibilities, tracking, and review cadence. Nothing is published or funded until your team approves the relevant work.'],
  ['04', 'Launch and connect follow-up', 'Campaigns, pages, and messages go live with the agreed tracking and lead routing. When calling support is part of the plan, trained agents can follow up under the scripts and access rules you approve.'],
  ['05', 'Review and improve', 'We review search terms, audience response, page behavior, inquiries, lead quality, and sales feedback. Changes are documented so creative, targeting, content, and follow-up improve from the same evidence.'],
];

export default function DigitalMarketing() {
  useSeo({
    title: 'Digital Marketing Services | VictorySync',
    description: 'SEO, paid search, paid social, content, email marketing, websites, landing pages, and analytics connected to your lead follow-up process.',
  });

  const details = siteFacts.digitalMarketingDetails;
  if (!details) throw new Error('Digital marketing page requires siteFacts.digitalMarketingDetails');

  return (
    <MotionPage className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50/70 to-sky-50 px-5 py-24 sm:px-8 sm:py-32">
        <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-violet-300/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-36 left-1/3 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex rounded-full border border-violet-200 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm backdrop-blur">Digital marketing</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">Digital marketing connected to <span className="gradient-text">real conversations</span></h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{details.description} We connect the campaign, conversion path, and lead follow-up process so your team can see what generated an inquiry and what happened next.</p>
          <ul className="mt-6 flex max-w-4xl flex-wrap gap-2" aria-label="Digital marketing services">{details.services.map((service) => <li key={service} className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-800">{service}</li>)}</ul>
          <Link href="/book-call" className="mt-8 inline-flex rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white hover:bg-violet-700">Discuss your marketing plan</Link>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-700">One operating plan</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Channels work better when the handoffs are designed together</h2>
          <p className="mt-5 text-lg leading-8 text-slate-700">A search ad, social campaign, article, email, or landing page is only one part of the customer path. We define the message, conversion action, tracking, lead destination, response process, and reporting before judging performance. That lets marketing and sales work from the same definition of a useful lead.</p>
        </div>
      </Section>

      <section className="border-y border-slate-200 bg-slate-50 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-950">What we handle</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-700">The exact mix depends on your goals and existing setup. We agree on the channels, deliverables, responsibilities, and review cadence before work begins.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {disciplines.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="group rounded-2xl border border-slate-200/80 bg-white/90 p-7 shadow-sm shadow-slate-200/60 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-950">How the work is managed</h2>
          <div className="mt-10 space-y-6">
            {workflow.map(([number, title, copy]) => (
              <article key={number} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[64px_1fr]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-lg font-bold text-violet-600">{number}</span>
                <div><h3 className="text-xl font-semibold text-slate-950">{title}</h3><p className="mt-2 leading-7 text-slate-700">{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden border-t border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 px-5 py-24 text-slate-900 sm:px-8">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">What you receive</h2>
            <ul className="mt-6 space-y-3 text-slate-700">
              {['A documented strategy and channel scope', 'Approved messaging and campaign assets', 'Connected forms, tracking, and lead routing', 'A clear reporting and review cadence', 'Recommendations tied to lead quality and business outcomes'].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-400" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-violet-200/80 bg-white/85 p-8 shadow-xl shadow-violet-200/40 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-950">Scope and pricing</h2>
            {!details.publishPricing && <p className="mt-4 leading-7 text-slate-700">Digital marketing is custom quoted for the channels, assets, campaign volume, and reporting your business needs.</p>}
            <Link href="/book-call" className="mt-7 inline-flex rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500">Book a free call</Link>
          </div>
        </div>
      </section>
    </MotionPage>
  );
}
