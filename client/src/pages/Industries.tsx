
export default function Industries() {
  const inds = [
    { h: "Ecommerce", p: "Pre-/post-purchase, returns, subscriptions, live chat." },
    { h: "Real Estate", p: "Lead capture, appointment set, after-hours inquiries." },
    { h: "Healthcare", p: "Scheduling, reminders, triage handoff; compliance-aware." },
    { h: "Local Services", p: "Dispatch, estimates, job updates, payments support." }
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Industries</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inds.map(i => (
            <div key={i.h} className="rounded-2xl border p-5">
              <h3 className="font-semibold">{i.h}</h3>
              <p className="mt-1 text-sm text-slate-600">{i.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
