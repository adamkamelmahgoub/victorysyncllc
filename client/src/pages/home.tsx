import { MotionPage } from '@/components/motion-page';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';
import { Link } from 'wouter';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Headphones,
  MessageCircle,
  Phone,
  Sparkles,
  UserCheck,
} from 'lucide-react';

const whatsappUrl = 'https://wa.me/201070394707?text=Hi%20VictorySync%2C%20I%27d%20like%20to%20learn%20more.';

const faqs = [
  { question: 'What does VictorySync do?', answer: 'VictorySync provides US-managed outbound and inbound contact center services with trained agents based in Cairo. Our people handle cold calling, qualification, appointment setting, lead follow-up, and customer support. AI helps them summarize calls, surface signals, and keep records organized.' },
  { question: 'Which industries do you work with?', answer: 'We work primarily with US small and midsize businesses in home services, real estate, SaaS, agencies, and professional services. Every campaign is adapted to the client’s offer, customers, systems, and sales process.' },
  { question: 'How are your agents managed?', answer: 'Every account has US-led onboarding and account management, documented scripts and escalation paths, trained Cairo-based agents, and ongoing call review and coaching.' },
  { question: 'How does AI support the agents?', answer: 'AI assists with call summaries, qualification prompts, lead routing, QA signals, and reporting. Agents remain responsible for the conversation, judgment, and customer experience.' },
  { question: 'How do you handle data privacy?', answer: 'We limit access to the tools and records required for the approved workflow. Permissions, retention, escalation, and reporting requirements are agreed during onboarding, and agents can work inside your existing CRM and phone stack.' },
  { question: 'How does pricing work?', answer: 'Pricing depends on coverage, channels, agent count, and workflow complexity. Dedicated agent plans currently start from $10 per hour, with an exact scope confirmed after a short discovery call.' },
  { question: 'How quickly can we start?', answer: 'Straightforward appointment-setting, lead follow-up, and inbound programs can often launch within 24–48 hours after scripts, lists, access, and escalation rules are approved.' },
];

const structuredData = [{
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VictorySync',
  url: 'https://victorysync.com',
  description: 'US-managed BPO and contact center with Cairo-based human agents for inbound support, cold calling, lead qualification, and appointment setting.',
}, {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}];

function MockRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}

const steps = [
  {
    number: '01',
    title: 'Tell us your ICP and campaign goals',
    body: 'Share your offer, audience, qualification rules, voice, and tools. Our account team turns them into a clear operating playbook.',
    mock: <div className="space-y-2"><MockRow label="Market" value="US home services" /><MockRow label="Decision maker" value="Owner / GM" /><MockRow label="Goal" value="Book estimate" /></div>,
  },
  {
    number: '02',
    title: 'Our agents call and qualify',
    body: 'Trained agents run every conversation and handle objections. AI helps them capture details, follow prompts, and work faster.',
    mock: <div><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">Agent qualification</span><span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2 py-1 text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Live call</span></div><div className="mt-4 flex flex-wrap gap-2">{['Service area ✓', 'Need confirmed ✓', 'Timeline captured'].map(item => <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">{item}</span>)}</div></div>,
  },
  {
    number: '03',
    title: 'You just show up to the call',
    body: 'Qualified meetings land on your calendar with clean notes, key context, and a transparent activity trail.',
    mock: <div className="rounded-lg border border-blue-200 bg-blue-50 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-blue-900"><CalendarCheck className="h-4 w-4 text-blue-600" />Estimate booked</div><p className="mt-1 text-xs text-blue-700">Monday · 9:40 AM · Agent notes attached</p></div>,
  },
];

const capabilities = [
  { icon: Headphones, title: 'Live Calling Agents', body: 'Real people handle outbound calls, follow-ups, objections, and inbound conversations in your brand voice.', detail: 'Agent Maria · Connected', color: 'text-blue-600 bg-blue-50' },
  { icon: UserCheck, title: 'AI-Assisted Qualification', body: 'Agents stay in control while AI surfaces your qualification prompts and helps capture the right details.', detail: '3 of 4 criteria confirmed', color: 'text-sky-600 bg-sky-50' },
  { icon: CalendarCheck, title: 'Appointment Booking', body: 'Qualified prospects are booked directly into your approved calendar with context for your sales team.', detail: 'Monday · 9:40 AM', color: 'text-blue-600 bg-blue-50' },
  { icon: BarChart3, title: 'Campaign Reporting', body: 'Human-reviewed reports show calls, outcomes, objections, qualification rates, and booked appointments.', detail: 'Weekly report ready', color: 'text-amber-700 bg-amber-50' },
];

export default function Home() {
  const { open } = useCalendly();
  useSeo({
    title: 'VictorySync | Human-Led BPO & Appointment Setting',
    description: 'US-managed contact center with trained Cairo-based agents for appointment setting, cold calling, lead qualification, and inbound support—supported by AI tools.',
    canonical: 'https://victorysync.com/',
    structuredData,
  });

  return (
    <MotionPage className="overflow-hidden bg-white text-slate-900">
      <section className="relative border-b border-slate-200">
        <div className="absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,.11),transparent_40%),radial-gradient(circle_at_20%_20%,rgba(37,99,235,.08),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" /> Human-led. AI-assisted.
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-[-0.045em] text-slate-900 sm:text-6xl lg:text-[4.1rem]">
              Real agents who turn more conversations into <span className="text-blue-600">booked business.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              VictorySync gives US SMBs a managed team for calling, qualification, appointment setting, and support—with AI tools that help our people work faster and more accurately.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button onClick={open} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto">
                Book a 20-minute call <ArrowRight className="h-4 w-4" />
              </button>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-2 py-2 text-sm text-slate-600 hover:text-blue-600">
                <MessageCircle className="h-4 w-4 text-sky-500" /> or message us on WhatsApp
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4 text-blue-600" /> US-led management · Cairo-based agents · Flexible scope</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-xl shadow-slate-200/60 sm:p-6">
            <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Agent workspace</p><p className="mt-1 text-sm font-semibold text-slate-900">Today’s qualification flow</p></div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />Team live</span>
              </div>
              <div className="space-y-3 py-5">
                {[
                  { icon: Phone, title: 'Agent connected', text: 'Reached in 2 attempts', tone: 'bg-sky-50 text-sky-600' },
                  { icon: Check, title: 'Lead qualified', text: 'Need and timeline confirmed', tone: 'bg-blue-50 text-blue-600' },
                  { icon: CalendarCheck, title: 'Appointment booked', text: 'Monday · 9:40 AM', tone: 'bg-amber-50 text-amber-700' },
                ].map(({ icon: Icon, title, text, tone }) => (
                  <div key={title} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></div>
                    <div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-0.5 text-xs text-slate-500">{text}</p></div>
                    {title === 'Appointment booked' && <span className="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">BOOKED</span>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-4">
                {[['18', 'Calls'], ['7', 'Qualified'], ['4', 'Booked']].map(([value, label]) => <div key={label} className="rounded-lg bg-slate-50 p-3 text-center"><p className="text-lg font-bold text-slate-900">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div>)}
              </div>
            </div>
            <p className="mt-3 text-center text-[10px] text-slate-400">Illustrative agent workspace—not live client data.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading eyebrow="How it works" title="A trained team, ready to run your campaign." body="A simple operating model that keeps people accountable and gives your sales team clean, qualified handoffs." />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map(step => <article key={step.number}><div className="mb-5 flex items-center gap-4"><span className="text-sm font-bold text-blue-600">{step.number}</span><div className="h-px flex-1 bg-slate-200" /></div><h3 className="text-xl font-semibold text-slate-900">{step.title}</h3><p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{step.body}</p><div className="mt-6 min-h-[160px] rounded-lg border border-slate-200 bg-slate-100 p-5">{step.mock}</div></article>)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeading eyebrow="Capabilities" title="Human capability, supported by better tools." body="Your customers and prospects speak with trained people. AI works quietly in the background to improve speed, consistency, and visibility." />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, body, detail, color }) => <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p><div className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-700"><Activity className="h-4 w-4 text-blue-600" />{detail}</div></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-600">FAQ</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The practical questions, answered.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Still deciding? Talk through your workflow with our team.</p><button onClick={open} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">Book a call <ArrowRight className="h-4 w-4" /></button></div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map((faq, index) => <details key={faq.question} className="group" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div>
      </section>

      <section className="bg-slate-100 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-blue-200 bg-white px-6 py-14 text-center shadow-sm sm:px-12"><p className="text-xs font-semibold uppercase tracking-[.18em] text-amber-700">Ready when you are</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Put a reliable team behind every lead.</h2><p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-600">Tell us what needs handling. We’ll map the agents, workflow, AI support, and launch plan.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={open} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700">Book a 20-minute call <ArrowRight className="h-4 w-4" /></button><Link href="/services" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Explore services</Link></div></div>
      </section>
    </MotionPage>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-600">{eyebrow}</p><h2 className="mt-4 text-3xl font-bold tracking-[-.035em] text-slate-900 sm:text-5xl">{title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{body}</p></div>;
}
