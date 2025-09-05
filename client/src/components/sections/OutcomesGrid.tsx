
import { Link } from "react-router-dom";

export default function OutcomesGrid() {
  const items = [
    { t: "Lower Cost", d: "Cairo team + AI automations—up to 60% savings.", href: "/pricing", i: "💸" },
    { t: "Faster Response", d: "Omnichannel triage, <60s first reply.", href: "/solutions", i: "⚡" },
    { t: "Always-On", d: "After-hours and weekends.", href: "/solutions", i: "🌙" },
    { t: "Integrations", d: "CRM + dialer + helpdesk, open by default.", href: "/platform", i: "🔗" },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold">Solutions that ship outcomes</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 vs-anim-in">
          {items.map((it) => (
            <Link key={it.t} to={it.href}
              className="block rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 bg-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-lg">{it.i}</div>
                <h3 className="text-lg font-semibold">{it.t}</h3>
              </div>
              <p className="mt-2 text-slate-600 text-sm">{it.d}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
