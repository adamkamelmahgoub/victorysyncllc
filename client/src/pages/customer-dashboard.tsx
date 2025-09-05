
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

type Metrics = { aht: number; csat: number; sla: number; queueSize: number; firstReplySec: number; };
type Queue = { name: string; waiting: number; agentsOnline: number; };
type QA = { agent: string; score: number; };

export default function CustomerDashboard() {
  const [data, setData] = useState<{ metrics: Metrics; queues: Queue[]; qa: QA[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await apiRequest<{ metrics: Metrics; queues: Queue[]; qa: QA[] }>("GET", "/dashboard");
        setData(r);
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  if (err) return <div className="mx-auto max-w-4xl p-8 text-red-600">{err}</div>;
  if (!data) return <div className="mx-auto max-w-4xl p-8">Loading…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat kpi="AHT" value={`${Math.round(data.metrics.aht/60)}m ${data.metrics.aht%60}s`} />
        <Stat kpi="CSAT" value={`${data.metrics.csat}%`} />
        <Stat kpi="SLA" value={`${data.metrics.sla}%`} />
        <Stat kpi="Queue Size" value={`${data.metrics.queueSize}`} />
        <Stat kpi="First Reply" value={`${data.metrics.firstReplySec}s`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Queues">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr><th className="py-2">Queue</th><th>Waiting</th><th>Agents online</th></tr>
            </thead>
            <tbody>
              {data.queues.map(q => (
                <tr key={q.name} className="border-t">
                  <td className="py-2">{q.name}</td>
                  <td>{q.waiting}</td>
                  <td>{q.agentsOnline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="QA Scorecards">
          <ul className="text-sm grid gap-2">
            {data.qa.map((x) => <li key={x.agent} className="flex items-center justify-between border-b py-2">
              <span>{x.agent}</span><span className="font-semibold">{x.score}</span>
            </li>)}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function Stat({ kpi, value }: { kpi: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 bg-white">
      <div className="text-xs uppercase tracking-wide text-slate-500">{kpi}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
      <div className="font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}
