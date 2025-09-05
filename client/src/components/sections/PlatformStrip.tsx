
import { Link } from "react-router-dom";

export default function PlatformStrip() {
  const items = [
    { k: "Routing", d: "Smart queueing & skills-based routing" },
    { k: "AI Assist", d: "Summaries, drafts & auto-triage" },
    { k: "QA", d: "Scorecards, calibrations & coaching" },
    { k: "Analytics", d: "SLAs, CSAT, AHT, and ROI" },
  ];
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl font-bold">VictorySync Platform</h2>
          <Link to="/platform" className="text-indigo-600 hover:text-indigo-700">Explore platform →</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.k} className="rounded-2xl bg-white p-5 border border-slate-200 vs-anim-in">
              <div className="text-sm font-semibold text-slate-900">{it.k}</div>
              <div className="mt-1 text-slate-600 text-sm">{it.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
