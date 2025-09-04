
import { Link } from "react-router-dom";
type Props = { limit?: number };
export default function ResourceList({ limit = 6 }: Props) {
  const items = [
    { title: "After-Hours Playbook", desc: "Capture missed revenue with blended on-call coverage.", slug: "after-hours-playbook" },
    { title: "QA Scorecard Template", desc: "What to measure and how to coach.", slug: "qa-scorecard" },
    { title: "Missed Calls Cost Calculator", desc: "Quantify the impact of slow response times.", slug: "missed-calls-calculator" }
  ].slice(0, limit);
  return (
    <section className="py-12 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Resources</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(i => (
            <Link key={i.title} to={`/resources/${i.slug}`} className="rounded-2xl border p-5 hover:shadow-lg transition bg-white">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{i.desc}</p>
              <span className="mt-3 inline-block text-primary text-sm">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
