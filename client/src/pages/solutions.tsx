
export default function Solutions() {
  const items = [
    { t: "Inbound Support", d: "Tiered support with smart routing and AI triage." },
    { t: "Outbound Growth", d: "Callbacks, renewals and reactivation campaigns." },
    { t: "Helpdesk & Live Chat", d: "Blend tickets and chat with SLA targets." },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Solutions</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(x => (
          <div key={x.t} className="rounded-2xl border p-6 bg-white hover:shadow-md transition">
            <div className="font-semibold">{x.t}</div>
            <div className="text-slate-600 mt-1 text-sm">{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
