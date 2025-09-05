
import { useInView } from "../hooks/useInView";

const ITEMS = [
  { title:"Inbound Support", desc:"Email, calls, chat — unified queue with AI triage.", icon:(
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-indigo-600"><path d="M12 2a7 7 0 0 0-7 7v2a5 5 0 0 0 5 5h1v3l4-3h1a5 5 0 0 0 5-5V9a7 7 0 0 0-7-7Z"/></svg>
  )},
  { title:"Outbound Growth", desc:"Campaigns, follow-ups, and scheduled callbacks.", icon:(
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-fuchsia-600"><path d="M3 12h18M12 3v18"/></svg>
  )},
  { title:"Helpdesk & Live Chat", desc:"Integrates with your CRM; macros & SLAs built in.", icon:(
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-teal-600"><path d="M4 4h16v10H7l-3 3V4Z"/></svg>
  )},
  { title:"QA & Analytics", desc:"Scorecards, coaching, and trend insights.", icon:(
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-amber-600"><path d="M4 20h16V4H4v16Zm4-4V8h2v8H8Zm4 0V6h2v10h-2Zm4 0v-5h2v5h-2Z"/></svg>
  )}
];

export default function FeatureShowcase(){
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section ref={ref} id="solutions" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="reveal text-center text-3xl font-extrabold text-slate-900 md:text-4xl">
          Solutions that ship outcomes
        </h2>
        <p className={`reveal ${inView?"in":""} mx-auto mt-3 max-w-2xl text-center text-slate-600`}>
          Lower cost, faster responses, always-on coverage, and native integrations.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i)=>(
            <div key={it.title} className={`card reveal ${inView?"in":""} rounded-2xl border border-slate-100 bg-white p-5`}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1">
                {it.icon}
                <span className="text-sm font-semibold text-slate-800">{it.title}</span>
              </div>
              <p className="text-sm text-slate-600">{it.desc}</p>
              <button className="mt-4 text-sm font-semibold text-indigo-600 hover:underline">Open →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
