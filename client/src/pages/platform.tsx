
export default function Platform() {
  const rows = [
    { k: "Routing", v: "Skills-based, priority & SLA-aware" },
    { k: "AI Assist", v: "Auto-triage, summaries, draft responses" },
    { k: "QA", v: "Scorecards, calibrations, coaching workflows" },
    { k: "Analytics", v: "SLA, AHT, CSAT, first reply, occupancy" },
    { k: "Integrations", v: "CRM + dialer + helpdesk" },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Platform</h1>
      <table className="w-full text-sm rounded-2xl overflow-hidden border">
        <tbody>
          {rows.map(r => (
            <tr key={r.k} className="odd:bg-white even:bg-slate-50 border-b">
              <td className="p-3 font-semibold w-1/3">{r.k}</td>
              <td className="p-3">{r.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
