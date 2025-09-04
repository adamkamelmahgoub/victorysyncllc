
export default function PlatformStrip() {
  const items = [
    { title: "Open by Default", body: "Connect CRM, dialers, helpdesk in minutes." },
    { title: "Smart Routing", body: "Match intent to the best agent or self-service." },
    { title: "QA & Coaching", body: "Improve outcomes with data-backed feedback." }
  ];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">The VictorySync Platform</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(i => (
            <div key={i.title} className="rounded-2xl border p-5 hover:shadow-vs transition">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
