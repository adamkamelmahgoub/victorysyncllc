
export default function Solutions() {
  const blocks = [
    { h: "Inbound Support", p: "Voice, email, chat with SLA routing, callbacks, and first-contact resolution focus." },
    { h: "Outbound Growth", p: "Warm follow-ups, win-backs, NPS callbacks, pipeline acceleration." },
    { h: "Helpdesk & Live Chat", p: "AI triage with human handoff when stakes are high; no dead ends." },
    { h: "Back-Office & Admin", p: "Data entry, order ops, scheduling, billing support." },
    { h: "QA & Analytics", p: "Scorecards, sentiment, coaching; surface trends to reduce effort." }
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Solutions by Need</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map(b => (
            <div key={b.h} className="rounded-2xl border p-5">
              <h3 className="font-semibold">{b.h}</h3>
              <p className="mt-1 text-sm text-slate-600">{b.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
