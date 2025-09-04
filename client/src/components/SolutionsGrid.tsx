
export default function SolutionsGrid() {
  const items = [
    { title: "Inbound Support", body: "Email, chat, voice with SLA routing and callbacks." },
    { title: "Outbound Growth", body: "Warm follow-ups, win-backs, NPS callbacks." },
    { title: "Helpdesk & Live Chat", body: "Bot-to-agent handoff, fast resolution." },
    { title: "QA & Analytics", body: "Scorecards, sentiment, coaching insights." }
  ];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Solutions that ship outcomes</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(i => (
            <a href="/solutions" key={i.title} className="rounded-2xl border p-5 hover:shadow-vs transition">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{i.body}</p>
              <span className="mt-3 inline-block text-primary text-sm">Learn more →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
