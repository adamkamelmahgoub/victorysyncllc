import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import ReviewRequest from '@/components/review-request';
import { siteFacts } from '@/config/siteFacts';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';
import { EMAIL, HOURS, US_PHONE, US_PHONE_HREF, WHATSAPP, WHATSAPP_HREF } from '@/lib/site-config';

type Faq = { question: string; answer: string };

export default function HelpCenter() {
  const { open: openCalendly } = useCalendly();
  const [searchQuery, setSearchQuery] = useState('');

  const gettingStarted: Faq[] = [
    {
      question: 'How do I get started with VictorySync?',
      answer: 'Book a free call. We learn your customers, offer, tools, and what a good outcome looks like, then write the scripts and escalation rules with you. You approve everything before any agent makes or takes a call.',
    },
    {
      question: 'What services does VictorySync offer?',
      answer: 'We provide human-led contact center services including inbound customer support, outbound calling, lead qualification, appointment setting, and follow-up. AI assists with summaries, routing, and reporting while people remain responsible for every conversation.',
    },
    {
      question: 'How long does implementation take?',
      answer: `Straightforward campaigns can often launch within ${siteFacts.straightforwardLaunchTimeframe} after scripts, lists, access, and escalation rules are approved.${siteFacts.complexLaunchTimeframe ? ` Campaigns that need a CRM integration or a compliance review take longer, usually ${siteFacts.complexLaunchTimeframe}.` : ''}`,
    },
    {
      question: 'What hours does your team work?',
      answer: `Our team is available ${siteFacts.hours}.${typeof siteFacts.afterHoursCoverage === 'string' ? ` ${siteFacts.afterHoursCoverage}` : ''}`,
    },
    ...(siteFacts.pilotDescription ? [{
      question: 'How do pilots work?',
      answer: `New clients start with ${siteFacts.pilotDescription} so you can judge real results before committing to more.`,
    }] : []),
  ];

  const billing: Faq[] = [
    ...(siteFacts.paymentMethods ? [{ question: 'What payment methods do you accept?', answer: siteFacts.paymentMethods }] : []),
    ...(siteFacts.refundPolicy ? [{ question: 'Do you offer refunds?', answer: siteFacts.refundPolicy }] : []),
  ];

  const tools: Faq[] = [{
    question: 'How do I integrate VictorySync with my CRM?',
    answer: `Yes. Agents work inside the CRM, calendar, and phone tools you already use, with the access you approve during onboarding. VictorySync is a Close CRM partner.${siteFacts.otherCRMs ? ` Our team has also run campaigns in ${siteFacts.otherCRMs.join(', ')}.` : ''}`,
  }];

  const groups = [
    { id: 'getting-started', name: 'Getting Started', faqs: gettingStarted },
    { id: 'billing', name: 'Billing and Plans', faqs: billing },
    { id: 'tools', name: 'Tools and CRM', faqs: tools },
  ].filter((group) => group.faqs.length > 0);
  const allFaqs = groups.flatMap((group) => group.faqs);

  useSeo({
    title: 'Help Center | VictorySync',
    description: 'Answers to common questions about VictorySync services, onboarding, and reporting.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  });

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? allFaqs.filter(({ question, answer }) => `${question} ${answer}`.toLowerCase().includes(query)) : allFaqs;
  }, [allFaqs, searchQuery]);

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <section className="border-b border-ink-700 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Help Center</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">Find clear answers about onboarding, campaign hours, tools, and working with our team.</p>
          <label className="sr-only" htmlFor="help-search">Search help center questions</label>
          <input id="help-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search questions" className="mx-auto mt-8 block w-full max-w-2xl rounded-lg border border-ink-600 bg-ink-800 px-5 py-4 text-white outline-none focus:border-cyan-400" />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          <Link href="/services" className="rounded-xl border border-ink-700 bg-ink-800 p-6 hover:border-cyan-500/50"><h2 className="font-semibold">Service Overview</h2><p className="mt-2 text-sm text-slate-400">Explore inbound and outbound services.</p></Link>
          <Link href="/contact" className="rounded-xl border border-ink-700 bg-ink-800 p-6 hover:border-cyan-500/50"><h2 className="font-semibold">Contact Support</h2><p className="mt-2 text-sm text-slate-400">Get help from our team.</p></Link>
        </div>

        {searchQuery ? (
          <section><h2 className="text-2xl font-bold">Search results</h2><FaqList faqs={results} /></section>
        ) : groups.map((group) => (
          <section key={group.id} id={group.id} className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <FaqList faqs={group.faqs} />
          </section>
        ))}

        <section className="rounded-xl border border-ink-700 bg-ink-800 p-8 text-center">
          <h2 className="text-3xl font-bold">Still need help?</h2>
          <p className="mt-3 text-slate-300">Contact our team during business hours.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-ink-900 hover:bg-cyan-600">Contact support</Link>
            <button onClick={openCalendly} className="rounded-lg border border-ink-600 px-6 py-3 font-semibold text-slate-200 hover:border-cyan-400">Schedule a call</button>
          </div>
          <div className="mt-8 grid gap-4 text-sm text-slate-300 md:grid-cols-4">
            <a href={`mailto:${EMAIL}`} className="hover:text-cyan-400">{EMAIL}</a>
            <a href={US_PHONE_HREF} className="hover:text-cyan-400">{US_PHONE}</a>
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">WhatsApp {WHATSAPP}</a>
            <span>{HOURS}</span>
          </div>
        </section>
        <div className="mt-10"><ReviewRequest /></div>
      </div>
    </div>
  );
}

function FaqList({ faqs }: { faqs: Faq[] }) {
  return <div className="mt-6 space-y-4">{faqs.length ? faqs.map((faq) => (
    <article key={faq.question} className="rounded-xl border border-ink-700 bg-ink-800 p-6">
      <h3 className="text-lg font-semibold">{faq.question}</h3>
      <p className="mt-3 leading-7 text-slate-300">{faq.answer}</p>
    </article>
  )) : <p className="text-slate-400">No matching questions found.</p>}</div>;
}
