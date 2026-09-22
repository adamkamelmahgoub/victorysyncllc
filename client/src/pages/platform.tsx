import { Link } from 'wouter';
import { BarChart3, Bot, CheckCircle2, Mail } from 'lucide-react';
import { MotionPage } from '@/components/motion-page';
import { Section } from '@/components/section';
import { siteFacts, siteOrigin } from '@/config/siteFacts';
import { useSeo } from '@/hooks/useSeo';

const title = 'Campaign Dashboard & Daily Reports | VictorySync';
const description = 'See every call, booking, and outcome from your VictorySync campaign: call recordings, connect and booking rates, and a daily summary in your inbox.';

export default function Platform() {
  useSeo({
    title,
    description,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteOrigin}/` },
        { '@type': 'ListItem', position: 2, name: 'Campaign Dashboard and Daily Reports', item: `${siteOrigin}/platform` },
      ],
    },
  });

  const visibleFeatures = siteFacts.dashboardFeatures ?? [
    'A daily written summary: what happened, what the numbers look like, and what needs your attention.',
  ];

  return (
    <MotionPage className="bg-ink-900 text-white">
      <Section className="pt-24 pb-16 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Campaign visibility</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">See everything your team does for you</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            The VictorySync client dashboard shows what our agents did on your campaign, and a written summary lands in your inbox every business day.
          </p>
        </div>
      </Section>

      <Section className="border-y border-ink-700 bg-ink-800">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-ink-700 bg-ink-900">
            <BarChart3 className="h-32 w-32 text-cyan-400/30" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">What you can see</h2>
            <ul className="mt-6 space-y-4">
              {visibleFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-lg leading-8 text-slate-300">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 p-4 text-sm text-slate-300">
              <Mail className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
              Your daily report keeps the campaign visible without requiring another meeting.
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-ink-900">
        <div className="mx-auto max-w-3xl text-center">
          <Bot className="mx-auto h-12 w-12 text-cyan-400" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-bold">Where AI fits</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            AI helps our agents with call summaries, CRM updates, lead routing, reminders, and reporting. People handle every customer conversation. Nothing goes live without your approval.
          </p>
          <Link href="/book-call" className="mt-8 inline-flex rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-cyan-600">
            Book a free call
          </Link>
        </div>
      </Section>
    </MotionPage>
  );
}
