import { MotionPage } from '@/components/motion-page';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { Link } from 'wouter';
import { Hero } from '../components/Hero';
import { ArrowRight, Shield } from 'lucide-react';

const services = [
  { title: 'Inbound Support', sub: 'Calls, emails, chat, and tickets handled by trained agents — on your schedule.', href: '/inbound-support' },
  { title: 'Appointment Setting', sub: 'Lead follow-up and calendar booking so your sales team shows up to qualified calls.', href: '/appointment-setting' },
  { title: 'Cold Calling', sub: 'Outbound campaigns from your approved lists. DNC-conscious, daily reporting.', href: '/cold-calling' },
  { title: 'Lead Follow-Up', sub: 'New leads contacted in under 5 minutes. Multi-touch until they convert or opt out.', href: '/services' },
  { title: 'Email, Chat & SMS', sub: 'Every channel covered. Same quality standards as your phone support.', href: '/inbound-support' },
  { title: 'AI Automation', sub: 'Call summaries, CRM updates, and reporting — automated so nothing falls through.', href: '/ai-automation' },
];

export default function Home() {
  const { open: openCalendly } = useCalendly();

  return (
    <MotionPage className="bg-ink-900">
      <Hero />

      {/* Thin trust strip */}
      <div className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-500">
            <span>US-managed</span>
            <span className="text-ink-600">·</span>
            <span>Cairo-based agents</span>
            <span className="text-ink-600">·</span>
            <span>Daily reports</span>
            <span className="text-ink-600">·</span>
            <span>No long contracts</span>
            <span className="text-ink-600">·</span>
            <span>Compliance-aware outbound</span>
          </div>
        </div>
      </div>

      {/* What we do — editorial list */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-3">What we handle</h2>
          <p className="text-slate-500 max-w-xl">
            Pick one thing or hand us the whole workflow. Most clients start with one service and expand.
          </p>
        </div>

        <div className="divide-y divide-ink-700/60">
          {services.map((s) => (
            <Link key={s.title} href={s.href}>
              <div className="group flex items-center justify-between py-5 cursor-pointer hover:bg-ink-800/30 -mx-4 px-4 rounded-lg transition-colors">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-0.5">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-6" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The honest pitch */}
      <section className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-white mb-6">The honest pitch</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Hiring in-house support is expensive. $40–60k per agent before benefits, equipment, and the inevitable turnover. Most small businesses either burn their founders out doing it themselves, or hire too fast and get inconsistent quality.
                </p>
                <p>
                  VictorySync gives you a dedicated agent team trained to your processes, managed by us, reporting to you daily. We're based in New Jersey. Our agents are in Cairo. The cost difference is real — without the quality drop you'd expect.
                </p>
                <p>
                  We're not a call center in the traditional sense. You get one team, one account manager, and full visibility into what's happening every day.
                </p>
              </div>
              <button
                onClick={openCalendly}
                className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-cyan-500 text-ink-900 hover:bg-cyan-400 transition"
              >
                Talk to us — it's free
              </button>
            </div>

            <div className="lg:col-span-2 space-y-4 pt-1">
              {[
                { num: '24–48 hrs', label: 'Typical time from discovery call to going live' },
                { num: '$10/hr min', label: 'Per agent — a fraction of US equivalent rates' },
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

      {/* How it works — plain text */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-10">How it actually works</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          {[
            {
              n: '1',
              title: 'We learn your operation',
              body: 'One call where we ask about your customers, tools, scripts, and what good performance looks like. No 40-page onboarding forms.',
            },
            {
              n: '2',
              title: 'We train agents on your account',
              body: 'Scripts, tone, escalation paths, CRM workflows — all set up before a single call is made. You sign off before we go live.',
            },
            {
              n: '3',
              title: 'We go live',
              body: 'Calls are answered, leads are followed up, appointments are booked. Your account manager monitors quality from day one.',
            },
            {
              n: '4',
              title: 'You get daily reports',
              body: 'A summary lands in your inbox every day. What happened, what the numbers look like, anything that needs your attention.',
            },
          ].map((step) => (
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

      {/* Metrics */}
      <section className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-px bg-ink-700/40 rounded-2xl overflow-hidden">
            {[
              { metric: '98%', label: 'Call answer rate', detail: 'During contracted business hours' },
              { metric: '40%+', label: 'Lead-to-appointment rate', detail: 'On targeted follow-up campaigns' },
              { metric: '< 5 min', label: 'Speed to first contact', detail: 'For new inbound leads' },
            ].map((item) => (
              <div key={item.label} className="bg-ink-800/60 px-8 py-10">
                <div className="text-4xl font-bold text-white mb-1">{item.metric}</div>
                <div className="text-sm font-medium text-cyan-400 mb-2">{item.label}</div>
                <div className="text-xs text-slate-500">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance — collapsed, inline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-4 items-start">
          <Shield className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">On outbound calling compliance</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              We use client-approved scripts only, maintain DNC-conscious workflows, record calls where the client permits, and report everything. This isn't a certified compliance program — it's how we run campaigns responsibly. You're always responsible for your own legal obligations; we make it easier to meet them.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-ink-700/60 bg-ink-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Pricing</h2>
            <p className="text-slate-500">All packages are custom quoted. These show what's typically included at each level.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
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
            ].map((card) => (
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
                  {card.highlight && (
                    <span className="text-xs text-cyan-400">Most requested</span>
                  )}
                </div>
                <ul className="space-y-2 flex-1">
                  {card.features.map((f) => (
                    <li key={f} className="text-sm text-slate-400 flex gap-2">
                      <span className="text-ink-600 flex-shrink-0">–</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={openCalendly}
                  size="sm"
                  className={card.highlight
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold w-full'
                    : 'border border-ink-600 text-slate-400 hover:text-white hover:bg-ink-800 w-full bg-transparent'}
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

      {/* Final CTA */}
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
