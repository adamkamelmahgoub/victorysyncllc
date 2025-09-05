
import { useState } from "react";

const TABS = {
  Routing: "Skills-based routing & AI triage to the best available agent across channels.",
  AI: "Assist agents with summaries, suggested replies, and knowledge search.",
  QA: "Auto-QA, scorecards, coaching loops, and performance dashboards.",
  Analytics: "SLAs, CSAT, AHT, first contact resolution, and revenue impact tracking.",
  Integrations: "CRM + dialer + helpdesk + chat; webhooks and event streams.",
};

export default function PlatformTabs(){
  const [tab, setTab] = useState<keyof typeof TABS>("Routing");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">VictorySync Platform</h2>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {(Object.keys(TABS) as Array<keyof typeof TABS>).map((k)=>(
            <button
              key={k}
              onClick={()=>setTab(k)}
              aria-selected={tab===k}
              className={`tab-underline rounded-lg px-3 py-1.5 text-sm font-semibold ${
                tab===k ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="max-w-3xl text-slate-600">{TABS[tab]}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1,2,3].map(n=>(
              <div key={n} className="rounded-xl border border-slate-100 bg-white/70 p-4 glass">
                <div className="h-36 w-full rounded-md bg-gradient-to-tr from-indigo-100 via-white to-fuchsia-100" />
                <p className="mt-3 text-sm font-medium text-slate-700">{tab} view {n}</p>
                <p className="text-xs text-slate-500">Replace with real screenshots.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
