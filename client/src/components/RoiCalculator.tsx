
import { useMemo, useState } from "react";

export default function RoiCalculator() {
  const [volume, setVolume] = useState(3000);     // monthly contacts
  const [aht, setAht] = useState(5);              // minutes per contact
  const [usWage, setUsWage] = useState(18.25);    // $/hr baseline
  const [vsRate, setVsRate] = useState(7.5);      // $/hr effective (team+automation)

  const result = useMemo(() => {
    const hours = (volume * aht) / 60;
    const usCost = hours * usWage;
    const vsCost = hours * vsRate;
    const savings = Math.max(0, usCost - vsCost);
    const pct = usCost ? Math.round((savings / usCost) * 100) : 0;
    return { hours, usCost, vsCost, savings, pct };
  }, [volume, aht, usWage, vsRate]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl border p-6">
      <h3 className="font-semibold text-lg">Estimate Your Savings</h3>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <label className="text-sm">Monthly Interactions
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" value={volume} onChange={e=>setVolume(+e.target.value)}/>
        </label>
        <label className="text-sm">Avg Handle Time (min)
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" step="0.1" value={aht} onChange={e=>setAht(+e.target.value)}/>
        </label>
        <label className="text-sm">U.S. Wage ($/hr)
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" step="0.01" value={usWage} onChange={e=>setUsWage(+e.target.value)}/>
        </label>
        <label className="text-sm">VictorySync Effective ($/hr)
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" step="0.01" value={vsRate} onChange={e=>setVsRate(+e.target.value)}/>
        </label>
      </div>
      <div className="mt-4 rounded-lg bg-slate-50 p-4 grid sm:grid-cols-2 gap-3 text-sm">
        <div>Total Hours: <strong>{fmt(result.hours)}</strong></div>
        <div>U.S. Cost: <strong>${fmt(result.usCost)}</strong></div>
        <div>VictorySync Cost: <strong>${fmt(result.vsCost)}</strong></div>
        <div>Savings: <strong className="text-green-700">${fmt(result.savings)} ({result.pct}%)</strong></div>
      </div>
      <a href="/contact" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 transition">
        Book an ROI Review
      </a>
    </div>
  );
}
