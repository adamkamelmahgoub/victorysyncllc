import { MotionPage } from '@/components/motion-page';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';
import { Link } from 'wouter';
import closeBadge from '@assets/Close_PartnerBadge_Since25_1765323409008.webp';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  ChevronDown,
  Headphones,
  Lock,
  MessageCircle,
  Phone,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

const whatsappUrl = 'https://wa.me/201070394707?text=Hi%20VictorySync%2C%20I%27d%20like%20to%20discuss%20a%20campaign.';

const faqs = [
  { question: 'What does VictorySync handle?', answer: 'Our agents handle inbound support, cold calling, lead follow-up, qualification, and appointment setting. AI assists the team with summaries, prompts, routing, and reporting; people remain responsible for every customer conversation.' },
  { question: 'Which businesses are the best fit?', answer: 'VictorySync works with US small and midsize businesses that need dependable conversation capacity, especially home services, real estate, SaaS, agencies, and professional services.' },
  { question: 'Where are your agents and managers based?', answer: 'Agents are based in Cairo, Egypt. Onboarding, account management, quality standards, and campaign oversight are US-led.' },
  { question: 'How do you train agents for our account?', answer: 'We document your ideal customer, offer, scripts, qualification criteria, objection handling, tools, escalation rules, and desired outcomes. Agents train on that playbook before launch and receive ongoing coaching.' },
  { question: 'Can your team work inside our CRM and calendar?', answer: 'Yes. Depending on your stack and access policies, agents can work in common CRMs, calendars, ticketing systems, forms, and phone tools while following the permissions agreed during onboarding.' },
  { question: 'How does pricing work?', answer: 'Pricing is based on agent count, coverage, channels, and workflow complexity. Dedicated agent engagements currently start from $10 per hour. A discovery call confirms the right scope before you commit.' },
  { question: 'How fast can we launch?', answer: 'Straightforward campaigns can often launch within 24–48 hours after scripts, lists, access, and escalation rules are approved. Complex integrations or compliance reviews may require more setup time.' },
];

const structuredData = [{
  '@context': 'https://schema.org', '@type': 'Service', name: 'VictorySync Contact Center Services',
  provider: { '@type': 'Organization', name: 'VictorySync', url: 'https://www.victorysync.com' },
  areaServed: 'United States', serviceType: ['Appointment Setting', 'Cold Calling', 'Lead Qualification', 'Inbound Customer Support'],
}, {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
}];

const processSteps = [
  { number: '01', title: 'Tell us your ICP and campaign goals', body: 'Share your offer, audience, qualification rules, voice, and tools. Our account team turns them into an agent-ready playbook.', mock: <div className="space-y-2"><DataRow label="Audience" value="US homeowners" /><DataRow label="Trigger" value="Estimate request" /><DataRow label="Outcome" value="Qualified booking" /></div> },
  { number: '02', title: 'Our agents call and qualify', body: 'Trained agents lead every conversation. AI helps them surface prompts, capture details, and update your systems faster.', mock: <div><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-800">Qualification checklist</span><LivePill>Agent on call</LivePill></div><div className="mt-4 space-y-2"><CheckLine text="Decision maker confirmed" /><CheckLine text="Need and timeline captured" /><CheckLine text="Service area verified" /></div></div> },
  { number: '03', title: 'You show up to the right calls', body: 'Qualified appointments arrive on your calendar with contact details, agent notes, and the context your sales team needs.', mock: <div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-blue-900"><CalendarCheck className="h-4 w-4 text-blue-600" />Appointment confirmed</div><p className="mt-2 text-xs text-blue-700">Monday · 9:40 AM · Notes attached</p></div> },
];

const plans = [
  { name: 'Starter', note: 'One focused workflow', price: 'From $10/hr', description: 'A practical starting point for consistent coverage.', features: ['1 trained agent', 'Inbound or outbound workflow', 'Approved scripts and playbook', 'Daily activity reporting', 'Weekly QA review'], featured: false },
  { name: 'Growth', note: 'Most Popular', price: 'Custom', description: 'For teams building a predictable calling operation.', features: ['2+ trained agents', 'Blended calling and follow-up', 'Qualification and booking', 'CRM and calendar workflow', 'Dedicated account lead'], featured: true },
  { name: 'Scale', note: 'Flexible coverage', price: 'Custom', description: 'For extended hours, multiple workflows, or higher volume.', features: ['3+ agents or extended coverage', 'Inbound and outbound programs', 'Custom QA scorecards', 'AI-assisted reporting', 'Operational review cadence'], featured: false },
];

const capabilities = [
  { icon: Headphones, title: 'Live Calling Agents', body: 'Real people handle outreach, follow-up, objections, and inbound conversations in your brand voice.', snippet: <div className="flex items-center gap-3"><Avatar initials="MS" /><div><p className="text-xs font-semibold text-slate-800">Maria S. · Agent</p><p className="text-[11px] text-sky-600">Connected · 02:14</p></div></div> },
  { icon: UserCheck, title: 'AI-Assisted Qualification', body: 'Your criteria guide the agent while AI helps organize signals and reduce repetitive admin.', snippet: <div className="space-y-2"><CheckLine text="Budget range captured" /><CheckLine text="Timeline confirmed" /></div> },
  { icon: CalendarCheck, title: 'Appointment Booking', body: 'Agents book qualified prospects directly into approved calendars and confirm the handoff.', snippet: <div className="grid grid-cols-4 gap-1.5">{['9:00', '9:40', '10:20', '11:00'].map((time, i) => <span key={time} className={`rounded-md py-2 text-center text-[10px] ${i === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{time}</span>)}</div> },
  { icon: BarChart3, title: 'Campaign Reporting', body: 'See activity, outcomes, objections, qualification rates, and booked meetings in a clear review rhythm.', snippet: <div className="flex h-12 items-end gap-1.5">{[35, 55, 42, 75, 62, 88, 72].map((height, i) => <i key={i} className="flex-1 rounded-t-sm bg-sky-400" style={{ height: `${height}%` }} />)}</div> },
];

export default function Home() {
  const { open } = useCalendly();
  useSeo({ title: 'VictorySync | Human-Led Call Center & Appointment Setting', description: 'US-managed call center services with trained Cairo-based agents for appointment setting, cold calling, lead qualification, and inbound support.', canonical: 'https://www.victorysync.com/', structuredData });

  return (
    <MotionPage className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-white pb-16 pt-16 sm:pb-20 sm:pt-24">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,.12),transparent_36%),radial-gradient(circle_at_20%_20%,rgba(37,99,235,.08),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-600"><span className="h-2 w-2 rounded-full bg-sky-500" />US-managed · Cairo-based calling team</div>
            <h1 className="text-4xl font-bold leading-[1.04] tracking-[-.045em] text-slate-950 sm:text-6xl lg:text-[4.25rem]">Your next customer is a conversation away.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Trained agents call, qualify, book, and support your customers. AI helps our team move faster while people remain in control.</p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><button onClick={open} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto">Get started <ArrowRight className="h-4 w-4" /></button><a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 py-2 text-sm font-medium text-slate-600 hover:text-blue-600"><MessageCircle className="h-4 w-4 text-sky-500" />or message us on WhatsApp</a></div>
            <p className="mt-4 text-xs text-slate-500">Start with one workflow. No long-term contract required to begin.</p>
          </div>
          <LeadFlowMockup />
        </div>
      </section>

      <section id="how-it-works" className="relative scroll-mt-16 bg-slate-100 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8"><CenteredHeading eyebrow="How it works" title="Three steps to a working campaign" body="From your first brief to qualified appointments, the process stays clear and accountable." /><div className="mt-14 grid gap-6 lg:grid-cols-3">{processSteps.map(step => <article key={step.number}><p className="text-sm font-bold text-blue-600">{step.number}</p><h3 className="mt-4 text-xl font-semibold text-slate-900">{step.title}</h3><p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{step.body}</p><div className="mt-6 min-h-[178px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm">{step.mock}</div></article>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-white py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <ReviewTeamMockup />
          <div><p className="section-kicker">Human oversight</p><h2 className="section-title">People lead the work. AI helps them do it better.</h2><p className="section-copy">Your customers speak with trained agents—not autonomous bots. Technology supports quality, speed, and visibility behind the scenes.</p><div className="mt-9 grid gap-6 sm:grid-cols-2">{[[UserCheck, 'Agent-led at every step', 'A real person owns the call, judgment, and outcome.'], [ShieldCheck, 'Your leads, handled with care', 'Approved scripts and escalation rules protect the experience.'], [Headphones, 'Real support when needed', 'Reach an account lead who understands your workflow.'], [Users, 'One accountable team', 'Coaching and QA stay connected to your campaign goals.']].map(([Icon, title, body]) => { const PointIcon = Icon as typeof UserCheck; return <div key={title as string}><PointIcon className="h-5 w-5 text-blue-600" /><h3 className="mt-3 text-sm font-semibold text-slate-900">{title as string}</h3><p className="mt-1.5 text-xs leading-5 text-slate-600">{body as string}</p></div>; })}</div></div>
        </div>
      </section>

      <section id="pricing" className="relative scroll-mt-16 bg-white py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8"><CenteredHeading eyebrow="Services & pricing" title="Choose the team shape that fits" body="Start focused, prove the workflow, and expand coverage as volume grows." /><div className="mt-14 grid gap-5 lg:grid-cols-3">{plans.map(plan => <article key={plan.name} className={`relative flex flex-col rounded-lg border p-6 ${plan.featured ? 'border-blue-500 bg-blue-50/60 shadow-lg shadow-blue-100' : 'border-slate-200 bg-white shadow-sm'}`}>{plan.featured && <span className="absolute -top-3 left-5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Most popular</span>}<p className="text-sm font-semibold text-slate-900">{plan.name}</p><p className="mt-1 text-xs text-slate-500">{plan.note}</p><p className="mt-6 text-3xl font-bold tracking-tight text-slate-950">{plan.price}</p><p className="mt-3 min-h-[40px] text-sm leading-6 text-slate-600">{plan.description}</p><div className="my-6 h-px bg-slate-200" /><ul className="flex-1 space-y-3">{plan.features.map(feature => <li key={feature} className="flex gap-2.5 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{feature}</li>)}</ul><button onClick={open} className={`mt-7 rounded-lg px-4 py-3 text-sm font-semibold ${plan.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'}`}>Discuss this plan</button></article>)}</div><p className="mt-5 text-center text-xs text-slate-500">Final pricing depends on coverage, channels, tools, and campaign complexity.</p></div>
      </section>

      <section className="relative bg-slate-100 py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8"><CenteredHeading eyebrow="Compare" title="VictorySync vs. hiring in-house" body="Add a managed operating team without building every process from zero." /><div className="mt-12 grid overflow-hidden rounded-lg border border-slate-200 bg-white md:grid-cols-2"><ComparisonColumn title="With VictorySync" positive items={['Recruiting and agent management handled', 'Scripts, QA, and reporting built into the service', 'Flexible coverage as call volume changes', 'AI-assisted notes and operational visibility', 'One accountable account team']} /><ComparisonColumn title="Hiring in-house" items={['Recruiting, onboarding, and turnover stay with you', 'Managers must build QA and reporting', 'Fixed headcount before demand is proven', 'Tools and integrations require internal ownership', 'Coverage gaps become your team’s problem']} /></div></div>
      </section>

      <section className="relative bg-white py-14"><div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 px-5 text-center sm:px-8 md:flex-row md:text-left"><div><h2 className="text-2xl font-bold text-slate-900">Prefer WhatsApp? Talk to our team there.</h2><p className="mt-2 text-sm text-slate-600">Share your campaign idea and we’ll point you in the right direction.</p></div><a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"><MessageCircle className="h-4 w-4" />Message us on WhatsApp</a></div></section>

      <section id="features" className="relative bg-white py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8"><CenteredHeading eyebrow="Capabilities" title="The conversations and the operations, handled" body="Every capability combines trained people, a clear process, and tools that keep your team informed." /><div className="mt-14 grid gap-5 md:grid-cols-2">{capabilities.map(({ icon: Icon, title, body, snippet }) => <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p><div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">{snippet}</div></article>)}</div></div>
      </section>

      <section className="relative bg-[#f4f7fb] py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_.75fr]"><div><p className="section-kicker">Custom campaigns</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Need a workflow or industry we didn’t list?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">We can scope custom intake, calling, qualification, support, and handoff processes around your customer journey and existing tools.</p><div className="mt-6 flex flex-wrap gap-2">{['Custom scripts', 'Industry training', 'Flexible coverage', 'CRM workflows'].map(item => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">{item}</span>)}</div></div><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Settings2 className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-slate-900">Custom workflow review</p><p className="text-xs text-slate-500">Built around your process</p></div></div><button onClick={open} className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Talk through your use case</button></div></div>
      </section>

      <section className="relative overflow-hidden bg-white py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8"><CenteredHeading eyebrow="Built for trust" title="Your campaign stays visible and accountable" body="Clear access rules, real ownership, and reporting keep your operation from becoming a black box." /><div className="mt-12 grid gap-8 md:grid-cols-3">{[[Lock, 'Data privacy', 'Access is limited to the systems and records required for the approved workflow.'], [Users, 'Dedicated account team', 'A consistent team learns your process, receives coaching, and owns follow-through.'], [BarChart3, 'Real-time reporting', 'Track activity, dispositions, qualification, and appointments without waiting for anecdotes.']].map(([Icon, title, body]) => { const TrustIcon = Icon as typeof Lock; return <div key={title as string} className="text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-blue-600"><TrustIcon className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">{title as string}</h3><p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-600">{body as string}</p></div>; })}</div></div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14" aria-label="Close CRM partnership">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-5 sm:px-8 md:flex-row md:items-center md:gap-10">
          <img src={closeBadge} alt="Close partner since 2025" width="600" height="288" loading="lazy" className="h-auto w-44 shrink-0" />
          <div><p className="section-kicker">Our partners</p><h2 className="mt-2 text-2xl font-bold text-slate-900">VictorySync is a Close CRM partner</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Our partnership with Close CRM supports our focus on clear sales workflows and accountable customer follow-up.</p></div>
        </div>
      </section>

      <section id="faq" className="relative scroll-mt-16 bg-white py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr]"><div><p className="section-kicker">FAQ</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Frequently asked questions</h2><p className="mt-4 text-sm leading-6 text-slate-600">Need a more specific answer? Our team can map it to your workflow.</p></div><div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map((faq, index) => <details key={faq.question} className="group" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" /></summary><p className="pb-5 pr-8 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 py-24"><div className="mx-auto max-w-3xl px-5 text-center text-white sm:px-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-100">Build your calling team</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">More conversations. Better handoffs. A team you can see.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-blue-100">Tell us what needs handling and we’ll map the agents, workflow, tools, and launch plan.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={open} className="rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">Get started</button><Link href="/pricing" className="rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">View pricing</Link></div></div></section>
    </MotionPage>
  );
}

function LeadFlowMockup() {
  const events = [{ icon: Phone, title: 'Agent connected', text: 'Reached decision maker', color: 'bg-sky-50 text-sky-600' }, { icon: UserCheck, title: 'Lead qualified', text: 'Fit criteria confirmed', color: 'bg-blue-50 text-blue-600' }, { icon: CalendarCheck, title: 'Appointment booked', text: 'Monday · 9:40 AM', color: 'bg-amber-50 text-amber-700' }];
  return <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-xl shadow-slate-200/70"><div className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-center justify-between border-b border-slate-200 pb-4"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Lead qualification</p><p className="mt-1 text-sm font-semibold text-slate-900">Campaign activity</p></div><LivePill>Checking status</LivePill></div><div className="space-y-3 py-5">{events.map(({ icon: Icon, title, text, color }) => <div key={title} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="text-xs text-slate-500">{text}</p></div>{title === 'Appointment booked' && <span className="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">BOOKED</span>}</div>)}</div><div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-4">{[['18', 'Calls'], ['7', 'Qualified'], ['4', 'Booked']].map(([value, label]) => <div key={label} className="rounded-lg bg-slate-50 p-3 text-center"><p className="font-bold text-slate-900">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div>)}</div></div><p className="mt-3 text-center text-[10px] text-slate-400">Illustrative agent workspace—not live client data.</p></div>;
}

function ReviewTeamMockup() {
  return <div className="rounded-lg border border-slate-200 bg-slate-100 p-5"><div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-900">Campaign review queue</p><p className="mt-1 text-[11px] text-slate-500">Human QA · Today</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">3 to review</span></div><div className="mt-5 space-y-3">{[['MS', 'Maria S.', 'Qualification complete'], ['AK', 'Ahmed K.', 'Escalation reviewed'], ['LN', 'Lina N.', 'Booking confirmed']].map(([initials, name, status]) => <div key={name} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><Avatar initials={initials} /><div><p className="text-xs font-semibold text-slate-800">{name}</p><p className="text-[11px] text-slate-500">{status}</p></div><Check className="ml-auto h-4 w-4 text-blue-600" /></div>)}</div><div className="mt-5 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-800"><Sparkles className="h-4 w-4 text-blue-600" />AI summary ready for manager review</div></div></div>;
}

function ComparisonColumn({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return <div className={`p-6 sm:p-8 ${positive ? 'bg-blue-50/70' : 'bg-white'}`}><div className="flex items-center gap-2"><div className={`flex h-7 w-7 items-center justify-center rounded-full ${positive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{positive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}</div><h3 className="text-lg font-semibold text-slate-900">{title}</h3></div><ul className="mt-6 space-y-4">{items.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">{positive ? <Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" /> : <X className="mt-1 h-4 w-4 shrink-0 text-slate-400" />}{item}</li>)}</ul></div>;
}

function CenteredHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="mx-auto max-w-2xl text-center"><p className="section-kicker">{eyebrow}</p><h2 className="section-title">{title}</h2><p className="section-copy mx-auto">{body}</p></div>;
}

function DataRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs"><span className="text-slate-500">{label}</span><span className="font-medium text-slate-800">{value}</span></div>; }
function CheckLine({ text }: { text: string }) { return <div className="flex items-center gap-2 text-xs text-slate-700"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700"><Check className="h-2.5 w-2.5" /></span>{text}</div>; }
function LivePill({ children }: { children: React.ReactNode }) { return <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />{children}</span>; }
function Avatar({ initials }: { initials: string }) { return <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">{initials}</span>; }
