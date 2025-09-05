
import { useEffect, useState } from "react";

const DATA = [
  { q: "VictorySync let us extend coverage overnight without sacrificing quality.", a: "Response time dropped, CSAT rose, and costs stayed predictable.", name: "Operations Director" },
  { q: "Agents love the assist tools and integrated chat.", a: "Ramp time shrank, and QA surfaced coaching wins weekly.", name: "CX Lead" },
  { q: "Integration was painless.", a: "We were live in days across email, phones, and chat.", name: "Head of Support" },
];

export default function TestimonialsSlider(){
  const [i,setI] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=> setI(v => (v+1)%DATA.length), 4200);
    return ()=> clearInterval(t);
  },[]);
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex w-[300%] translate-x-[calc(var(--i)*-33.333%)] transition-transform duration-700" style={{["--i" as any]: i}}>
            {DATA.map((t,idx)=>(
              <div key={idx} className="w-1/3 px-2">
                <div className="rounded-xl border border-slate-100 bg-white p-6 glass">
                  <p className="text-lg font-semibold text-slate-900">"{t.q}"</p>
                  <p className="mt-2 text-slate-600">{t.a}</p>
                  <p className="mt-4 text-sm font-medium text-slate-700">— {t.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {DATA.map((_,idx)=>(
              <button key={idx} onClick={()=>setI(idx)} className={`h-2.5 w-2.5 rounded-full ${i===idx?"bg-indigo-600":"bg-slate-300"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
