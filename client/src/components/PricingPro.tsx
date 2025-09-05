
import { useState } from "react";

const PLANS = [
  { name:"Starter", price: 899, perks:["Shared team","Email + chat","Business hours"], color:"from-indigo-500 to-violet-600" },
  { name:"Growth", price: 1999, perks:["Dedicated pod","Email + chat + voice","Extended hours"], color:"from-fuchsia-500 to-pink-600" },
  { name:"Enterprise", price: 4999, perks:["Dedicated team","Omnichannel","24/7 & SLOs"], color:"from-emerald-500 to-teal-600" },
];

export default function PricingPro(){
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Transparent pricing</h2>
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
            <span className={annual ? "font-semibold" : ""}>Annual</span>
            <input type="checkbox" checked={!annual} onChange={()=>setAnnual(v=>!v)} className="sr-only" />
            <span className="relative h-5 w-10 rounded-full bg-slate-300 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
            <span className={!annual ? "font-semibold" : ""}>Monthly</span>
          </label>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PLANS.map(p=>(
            <div key={p.name} className="card rounded-2xl border border-slate-100 bg-white p-6">
              <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${p.color}`} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">{p.name}</h3>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                ${annual ? p.price : Math.round(p.price*1.2)}<span className="text-base font-medium text-slate-500">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {p.perks.map(x=>(
                  <li key={x} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> {x}</li>
                ))}
              </ul>
              <button className="btn-shine mt-6 w-full rounded-lg px-4 py-2.5 font-semibold">Add a Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
