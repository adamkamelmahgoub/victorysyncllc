
import { site } from "../content/site";

export default function OutcomeCards() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.outcomes.map(o => (
          <div key={o.title} className="rounded-2xl border p-5 hover:shadow-vs transition">
            <h3 className="font-semibold">{o.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{o.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
