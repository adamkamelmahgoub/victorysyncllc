import { MotionPage } from '@/components/motion-page';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { Link } from 'wouter';
import { Hero } from '../components/Hero';
import {
  Phone,
  Calendar,
  MessageSquare,
  Bot,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';

const services = [
  {
    icon: Phone,
    title: 'Inbound Customer Support',
    description: 'Live phone, email, chat, and ticket handling. US-managed quality with trained agents representing your brand.',
    href: '/inbound-support',
  },
  {
    icon: Calendar,
    title: 'Appointment Setting',
    description: 'Lead follow-up, qualification, and direct calendar booking. Keep your sales team focused on closing.',
    href: '/appointment-setting',
  },
  {
    icon: Users,
    title: 'Cold Calling',
    description: 'Client-approved, DNC-conscious outbound calling campaigns. Qualified prospects transferred or booked daily.',
    href: '/cold-calling',
  },
  {
    icon: MessageSquare,
    title: 'Lead Follow-Up',
    description: 'No lead left behind. Systematic follow-up sequences via phone, SMS, and email to maximize every contact.',
    href: '/services',
  },
  {
    icon: MessageSquare,
    title: 'Email, Chat & SMS Support',
    description: 'Multi-channel customer communication handled professionally and consistently across every touchpoint.',
    href: '/services',
  },
  {
    icon: Bot,
    title: 'AI Automation & Reporting',
    description: 'Call summaries, CRM updates, lead routing, and reporting dashboards — automated so your team can focus.',
    href: '/ai-automation',
  },
];

const whyReasons = [
  { icon: TrendingUp, title: 'Lower cost without lower quality', desc: 'Cairo-based agents at a fraction of US labor cost, with US management overseeing every campaign.' },
  { icon: Shield, title: 'US business communication standards', desc: 'Trained English-speaking agents who communicate professionally and represent your brand correctly.' },
  { icon: BarChart3, title: 'QA, call reviews & performance tracking', desc: 'Regular QA scoring, call reviews, and performance reporting keep quality high week over week.' },
  { icon: Zap, title: 'Fast launch & flexible scaling', desc: 'Most campaigns launch within a few weeks. Scale up or down without the overhead of hiring.' },
  { icon: Clock, title: 'Extended hours coverage', desc: 'Handle inquiries before, during, and after business hours without adding in-house headcount.' },
  { icon: Users, title: 'Dedicated team options', desc: 'Agents assigned exclusively to your account build deep familiarity with your business over time.' },
];

const howItWorks = [
  { step: '01', title: 'Discovery & campaign setup', desc: 'We learn your business, customers, scripts, tools, and what success looks like for your team.' },
  { step: '02', title: 'Script, process & system alignment', desc: 'Agents are trained on your workflows, tone, and processes. Everything aligned before we go live.' },
  { step: '03', title: 'Agent training & launch', desc: 'Your campaign launches with dedicated agents. We monitor quality from day one.' },
  { step: '04', title: 'Reporting, QA & optimization', desc: 'Daily summaries, weekly QA, and ongoing refinements based on real performance data.' },
];

const pricingCards = [
  {
    name: 'Starter',
    tagline: 'For businesses ready to get started',
    features: ['1 dedicated agent', 'Business-hours coverage', 'Inbound or outbound workflow', 'Daily activity reporting', 'Weekly QA review'],
    cta: 'Request Quote',
  },
  {
    name: 'Growth',
    tagline: 'For teams that need more coverage',
    features: ['2 dedicated agents', 'Extended hours coverage', 'Appointment setting or blended support', 'QA and performance tracking', 'CRM integration support'],
    cta: 'Request Quote',
    highlight: true,
  },
  {
    name: 'Scale',
    tagline: 'For growing operations',
    features: ['Multi-agent team', '24/7 or extended support options', 'AI automation and reporting', 'Dedicated success management', 'Custom workflow design'],
    cta: 'Request Quote',
  },
];

export default function Home() {
  const { open: openCalendly } = useCalendly();

  return (
    <MotionPage className="bg-ink-900">
      <Hero />

      {/* Trust bar */}
      <div className="bg-ink-800 border-y border-ink-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-slate-400">
            {[
              'US-managed operations',
              'Cairo-based trained agents',
              'Daily reporting included',
              'Flexible scaling, no long contracts',
              'Compliance-aware outbound support',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Services overview */}
      <Section className="bg-ink-900">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What VictorySync Handles For Your Business
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From inbound support to outbound sales and AI automation — we cover the full customer engagement workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="bg-ink-800 rounded-xl p-6 border border-ink-700 hover:border-cyan-500/30 transition-colors group">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{service.description}</p>
                <Link href={service.href}>
                  <span className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Why VictorySync */}
      <Section className="bg-ink-800">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Businesses Choose VictorySync
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We give US businesses access to trained, professional agents with the overhead of a fraction of US hiring — while keeping management, quality control, and reporting fully US-based.
            </p>
            <Button onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold px-6">
              Book a Free Strategy Call
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyReasons.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-ink-900 rounded-xl p-5 border border-ink-700">
                  <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                  <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-ink-900">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            From first call to live operation in as little as a few weeks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {howItWorks.map((item, idx) => (
            <div key={item.step} className="relative">
              {idx < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-ink-700 z-0" style={{ width: 'calc(100% - 2rem)' }} />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <span className="text-cyan-400 font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Proof / Credibility section */}
      <Section className="bg-ink-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Client Results</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            We're building our proof layer as we grow. Here's what early campaigns have delivered.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              label: 'Inbound Coverage',
              metric: '98%',
              sub: 'Call answer rate',
              detail: 'Calls answered during contracted business hours. Missed call rate kept below 2% across active inbound campaigns.',
            },
            {
              label: 'Appointment Setting',
              metric: '40%+',
              sub: 'Lead-to-appointment rate',
              detail: 'Qualified leads converted to booked appointments on targeted follow-up campaigns with multi-touch phone and SMS outreach.',
            },
            {
              label: 'Speed to Lead',
              metric: '< 5 min',
              sub: 'Avg first contact time',
              detail: 'New inbound leads contacted within 5 minutes during business hours — maximizing connection rates before leads go cold.',
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-6 border border-ink-700 bg-ink-900">
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-cyan-400/70 bg-cyan-400/5 rounded mb-3">
                {item.label}
              </span>
              <div className="text-3xl font-bold text-white mb-0.5">{item.metric}</div>
              <div className="text-sm font-medium text-cyan-400 mb-3">{item.sub}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Compliance-aware section */}
      <Section className="bg-ink-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-ink-800 rounded-2xl p-8 md:p-12 border border-ink-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Built for Responsible Customer Outreach</h2>
                <p className="text-slate-400 leading-relaxed">
                  VictorySync supports compliance-aware outreach using client-approved scripts, DNC-conscious workflows, call recording where permitted, QA reviews, and clear reporting. We do not present this as legal advice or certified compliance — our processes are designed to support responsible outbound and inbound operations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {[
                'TCPA-aware calling practices',
                'DNC-conscious workflow',
                'Client-approved scripts only',
                'Call recording where permitted',
                'QA and performance monitoring',
                'Caller ID reputation awareness',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Pricing preview */}
      <Section className="bg-ink-800">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Flexible Packages</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Starting packages designed to grow with your business. Custom quotes available for larger teams.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pricingCards.map((card) => (
            <div
              key={card.name}
              className={`rounded-xl p-6 border flex flex-col ${
                card.highlight
                  ? 'border-cyan-500/50 bg-ink-900 ring-1 ring-cyan-500/30'
                  : 'border-ink-700 bg-ink-900'
              }`}
            >
              {card.highlight && (
                <span className="inline-block mb-3 px-2 py-0.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full w-fit">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{card.tagline}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {card.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={openCalendly}
                className={card.highlight ? 'bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold w-full' : 'border border-ink-600 text-slate-300 hover:bg-ink-800 w-full bg-transparent'}
              >
                {card.cta}
              </Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/pricing">
            <span className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer inline-flex items-center gap-1">
              View full pricing details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build your customer support team without hiring in-house?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Book a free 20-minute call. We'll show you exactly how VictorySync can cover your inbound volume, appointment setting, or outbound campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={openCalendly}
              className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold text-base px-8"
              data-testid="button-footer-get-quote"
            >
              Book a Call
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-ink-600 text-slate-300 hover:bg-ink-800 text-base px-8 bg-transparent">
                Send Us a Message
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </MotionPage>
  );
}
