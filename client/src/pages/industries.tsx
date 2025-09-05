
export default function Industries() {
  const inds = ["SaaS", "E-commerce", "Fintech", "Healthcare", "Telecom", "Logistics"];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Industries</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {inds.map(x => (
          <div key={x} className="rounded-2xl border p-6 bg-white hover:shadow-md transition">
            <div className="font-semibold">{x}</div>
            <div className="text-slate-600 mt-1 text-sm">Playbooks tailored to {x} workflows.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
