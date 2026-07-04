import { MotionPage } from '@/components/motion-page';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';
import { Link } from 'wouter';
import { Hero } from '../components/Hero';
import { ArrowRight, Shield } from 'lucide-react';

const services = [
  {
    title: 'Inbound Support',
    sub: 'Calls, emails, chat, and tickets handled by trained agents on your schedule.',
    detail: 'We document your call flows, escalation rules, refund policies, and CRM fields before launch so customers get consistent answers from day one. Coverage can start with business hours and expand into evenings, weekends, or overflow support as volume grows.',
    href: '/inbound-support',
  },
  {
    title: 'Appointment Setting',
    sub: 'Lead follow-up and calendar booking so your sales team shows up to qualified calls.',
    detail: 'Agents qualify prospects against your ideal customer profile, confirm contact details, and book directly into your calendar or CRM. Same-day reminders and clear handoff notes help reduce no-shows and give sales reps context before every conversation.',
    href: '/appointment-setting',
  },
  {
    title: 'Cold Calling',
    sub: 'Outbound campaigns from your approved lists. DNC-conscious, daily reporting.',
    detail: 'We run outbound calling from client-approved scripts, disposition every call, and report connect rates, objections, callbacks, and booked opportunities. Campaigns are built for measured follow-up rather than high-pressure dialing.',
    href: '/cold-calling',
  },
  {
    title: 'Lead Follow-Up',
    sub: 'New leads contacted in under 5 minutes. Multi-touch until they convert or opt out.',
    detail: 'Fresh form fills, missed calls, quote requests, and abandoned inquiries are routed into a fast-response workflow. Your team sees who was contacted, what they asked for, and which leads are ready for sales attention.',
    href: '/services',
  },
  {
    title: 'Email, Chat & SMS',
    sub: 'Every channel covered. Same quality standards as your phone support.',
    detail: 'We answer common questions, triage complex requests, and keep customer records updated across the channels your buyers already use. SMS and chat workflows are written to match your tone, compliance needs, and response-time expectations.',
    href: '/inbound-support',
  },
  {
    title: 'AI Automation',
    sub: 'Call summaries, CRM updates, and reporting automated so nothing falls through.',
    detail: 'VictorySync can add call summaries, intake forms, routing rules, dashboard updates, and internal alerts around the human team. The goal is less manual admin, cleaner records, and faster visibility into what happened today.',
    href: '/ai-automation',
  },
];

const proofStats = [
  {
    metric: '24-48 hrs',
    title: 'Typical go-live window',
    detail: 'Most simple inbound, lead follow-up, and appointment-setting accounts can move from discovery to launch in one to two business days once scripts and access are approved.',
  },
  {
    metric: '98%',
    title: 'Business-hours answer rate target',
    detail: 'Active accounts are managed toward a 98% answer rate during contracted coverage windows, with missed-call follow-up handled as a separate workflow.',
  },
  {
    metric: '< 5 min',
    title: 'New lead response goal',
    detail: 'For inbound lead follow-up programs, the operational target is first contact in under five minutes so prospects are reached while intent is still high.',
  },
  {
    metric: '$10/hr min',
    title: 'Starting agent rate',
    detail: 'Cairo-based staffing gives US businesses a lower hourly floor than domestic hiring while keeping account management, training, and quality control US-managed.',
  },
];

const faqs = [
  {
    question: 'What types of businesses use VictorySync?',
    answer: 'VictorySync works best for service businesses, agencies, clinics, local operators, SaaS teams, and sales organizations that need reliable phone coverage, lead follow-up, appointment setting, or customer support without hiring a full internal team.',
  },
  {
    question: 'How quickly can a call center or appointment-setting campaign launch?',
    answer: 'Simple accounts often launch in 24 to 48 hours after the discovery call, script approval, and access setup. More complex workflows with CRM integrations, compliance review, or multi-channel routing may take longer.',
  },
  {
    question: 'Where are VictorySync agents and managers located?',
    answer: 'VictorySync is managed from New Jersey in the United States, with trained agents based in Cairo, Egypt. Clients get US-led onboarding, account management, quality review, and daily reporting.',
  },
  {
    question: 'Can VictorySync work inside our CRM and calendar tools?',
    answer: 'Yes. The team can work with common calendars, intake forms, ticketing tools, and CRMs such as HubSpot, Salesforce, GoHighLevel, Calendly, Google Calendar, and similar systems, depending on the access and process you provide.',
  },
  {
    question: 'Do we need a long-term contract to start?',
    answer: 'No. Many clients begin with one focused workflow, such as inbound overflow, missed-call follow-up, or appointment setting, then expand once reporting shows the channel is working.',
  },
];

const homeStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VictorySync',
    description:
      'US-managed contact center providing inbound customer support, appointment setting, cold calling, lead follow-up, and AI automation for US businesses.',
    url: 'https://victorysync.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Millstone',
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
    areaServed: 'US',
    serviceType: ['Inbound Customer Support', 'Appointment Setting', 'Cold Calling', 'Lead Follow-Up', 'AI Automation'],
    priceRange: '$$',
    openingHours: 'Mo-Fr 08:00-18:00',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
];

const processSteps = [
  {
    n: '1',
    title: 'We learn your operation',
    body: 'One call where we ask about your customers, tools, scripts, and what good performance looks like. No 40-page onboarding forms.',
  },
  {
    n: '2',
    title: 'We train agents on your account',
    body: 'Scripts, tone, escalation paths, and CRM workflows are set up before a single call is made. You sign off before we go live.',
  },
  {
    n: '3',
    title: 'We go live',
    body: 'Calls are answered, leads are followed up, and appointments are booked. Your account manager monitors quality from day one.',
  },
  {
    n: '4',
    title: 'You get daily reports',
    body: 'A summary lands in your inbox every day: what happened, what the numbers look like, and anything that needs your attention.',
  },
];

const pricingCards = [
  {
    name: 'Starter',
    note: '1 agent',
    features: ['Business-hours inbound or outbound', 'Daily activity report', 'Weekly QA call'],
    highlight: false,
  },
  {
    name: 'Growth',
    note: '2 agents',
    features: ['Extended hour coverage', 'Appointment setting or blended', 'QA scoring + CRM integration'],
    highlight: true,
  },
  {
    name: 'Scale',
    note: '3+ agents',
    features: ['24/7 or extended options', 'AI automation & dashboards', 'Dedicated success management'],
    highlight: false,
  },
];

export default function Home() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'VictorySync | US-Managed Call Center & Appointment Setting',
    description:
      'Scale inbound support, outbound calling, and appointment setting with US-managed quality and Cairo-based efficiency. Starting from $10/hr. Launch in 24-48 hours.',
    canonical: 'https://victorysync.com/',
    structuredData: homeStructuredData,
  });

  return (
    <MotionPage className="bg-ink-900">
      <Hero />

      <div className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-500">
            <span>US-managed</span>
            <span className="text-ink-600">|</span>
            <span>Cairo-based agents</span>
            <span className="text-ink-600">|</span>
            <span>Daily reports</span>
            <span className="text-ink-600">|</span>
            <span>No long contracts</span>
            <span className="text-ink-600">|</span>
            <span>Compliance-aware outbound</span>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-3">What we handle</h2>
          <p className="text-slate-500 max-w-2xl">
            Pick one thing or hand us the whole workflow. Most clients start with one service, prove the reporting cadence, and expand into adjacent coverage once the process is stable.
          </p>
        </div>

        <div className="divide-y divide-ink-700/60">
          {services.map((s) => (
            <Link key={s.title} href={s.href}>
              <div className="group flex items-start justify-between py-6 cursor-pointer hover:bg-ink-800/30 -mx-4 px-4 rounded-lg transition-colors">
                <div className="max-w-3xl">
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-0.5">{s.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">{s.sub}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.detail}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-6 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-white mb-6">The honest pitch</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Hiring in-house support is expensive. $40-60k per agent before benefits, equipment, and the inevitable turnover. Most small businesses either burn their founders out doing it themselves, or hire too fast and get inconsistent quality.
                </p>
                <p>
                  VictorySync gives you a dedicated agent team trained to your processes, managed by us, reporting to you daily. We're based in New Jersey. Our agents are in Cairo. The cost difference is real, without the quality drop you'd expect.
                </p>
                <p>
                  We're not a call center in the traditional sense. You get one team, one account manager, and full visibility into what's happening every day.
                </p>
                <p>
                  That visibility matters for growing teams. You should know how many calls were answered, which leads were reached, what objections came up, which appointments were booked, and where the workflow needs a better script or escalation path.
                </p>
              </div>
              <button
                onClick={openCalendly}
                className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-cyan-500 text-ink-900 hover:bg-cyan-400 transition"
              >
                Talk to us - it's free
              </button>
            </div>

            <div className="lg:col-span-2 space-y-4 pt-1">
              {[
                { num: '24-48 hrs', label: 'Typical time from discovery call to going live' },
                { num: '$10/hr min', label: 'Per agent - a fraction of US equivalent rates' },
                { num: '1 mgr', label: 'Dedicated US account manager per client' },
              ].map((item) => (
                <div key={item.label} className="border border-ink-700 rounded-xl p-5 bg-ink-900">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{item.num}</div>
                  <div className="text-sm text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-10">How it actually works</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          {processSteps.map((step) => (
            <div key={step.n} className="flex gap-5">
              <div className="w-7 h-7 rounded-full border border-ink-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-slate-500">{step.n}</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Results our clients measure</h2>
            <p className="text-slate-500 max-w-2xl">
              Every account gets a reporting rhythm tied to operational outcomes, not vanity activity. These are the benchmarks we use to evaluate whether phone coverage, lead follow-up, and appointment setting are actually improving the business.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-ink-700/40 rounded-2xl overflow-hidden">
            {proofStats.map((item) => (
              <div key={item.title} className="bg-ink-800/60 px-6 py-8">
                <div className="text-4xl font-bold text-white mb-1">{item.metric}</div>
                <div className="text-sm font-medium text-cyan-400 mb-2">{item.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-5">What daily management includes</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                A good outsourced support team is not just a group of agents answering phones. VictorySync builds a working operating layer around your customer conversations: scripts, intake rules, escalation paths, call notes, QA checks, and reporting.
              </p>
              <p>
                Your account manager watches for repeated objections, unanswered questions, missed handoffs, and slow response patterns. When something needs to change, you get a practical recommendation instead of a vague activity report.
              </p>
              <p>
                For sales-driven accounts, that means faster follow-up, cleaner qualification, and more complete appointment notes. For support-driven accounts, it means fewer missed calls, clearer ticket triage, and better customer continuity across shifts.
              </p>
            </div>
          </div>
          <div className="border border-ink-700 rounded-xl p-6 bg-ink-800/40">
            <h3 className="text-lg font-bold text-white mb-4">Common tools and workflows</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>CRM updates in HubSpot, Salesforce, GoHighLevel, and similar systems.</li>
              <li>Calendar booking through Calendly, Google Calendar, Outlook, and client scheduling links.</li>
              <li>Daily summaries covering calls answered, leads contacted, appointments booked, callbacks, and escalations.</li>
              <li>Script refinement based on real objections, call outcomes, and customer questions.</li>
              <li>Inbound overflow coverage for teams that miss calls during peak hours, lunch breaks, evenings, or weekends.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-4 items-start">
          <Shield className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">On outbound calling compliance</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              We use client-approved scripts only, maintain DNC-conscious workflows, record calls where the client permits, and report everything. This isn't a certified compliance program - it's how we run campaigns responsibly. You're always responsible for your own legal obligations; we make it easier to meet them.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Pricing</h2>
            <p className="text-slate-500">All packages are custom quoted. These show what's typically included at each level.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingCards.map((card) => (
              <div
                key={card.name}
                className={`rounded-xl p-6 border flex flex-col gap-5 ${
                  card.highlight ? 'border-cyan-500/40 bg-ink-900 ring-1 ring-cyan-500/20' : 'border-ink-700 bg-ink-900/60'
                }`}
              >
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{card.name}</h3>
                    <span className="text-xs text-slate-500">{card.note}</span>
                  </div>
                  {card.highlight && <span className="text-xs text-cyan-400">Most requested</span>}
                </div>
                <ul className="space-y-2 flex-1">
                  {card.features.map((f) => (
                    <li key={f} className="text-sm text-slate-400 flex gap-2">
                      <span className="text-ink-600 flex-shrink-0">-</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={openCalendly}
                  size="sm"
                  className={
                    card.highlight
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold w-full'
                      : 'border border-ink-600 text-slate-400 hover:text-white hover:bg-ink-800 w-full bg-transparent'
                  }
                >
                  Get a quote
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-xs text-slate-600">
            Need something custom?{' '}
            <Link href="/pricing">
              <span className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors underline underline-offset-2">
                See full pricing page
              </span>
            </Link>
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-3">Frequently asked questions</h2>
          <p className="text-slate-500 max-w-2xl">
            Clear answers for companies comparing outsourced call center support, appointment setting, lead follow-up, and AI-assisted operations.
          </p>
        </div>
        <div className="divide-y divide-ink-700/60 border-y border-ink-700/60">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-6">
              <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-700/60">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Stop losing leads after 5 PM.
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Book a 20-minute call and we'll tell you honestly whether we're a fit.
          </p>
          <button
            onClick={openCalendly}
            className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold bg-cyan-500 text-ink-900 hover:bg-cyan-400 transition"
            data-testid="button-footer-get-quote"
          >
            Book a free call
          </button>
        </div>
      </section>
    </MotionPage>
  );
}
