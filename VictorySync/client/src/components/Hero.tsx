
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="pt-20 md:pt-28">
      <div className="container grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-purple font-semibold mb-2">VictorySync</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">SLA-Backed CX for Growing SMBs</h1>
          <p className="mt-4 text-lg text-slate-600">
            Always-on agents, clean CRM data, KPI dashboards, and premium reporting—so you scale service & sales without extra headcount.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn btn-primary">Request demo</Link>
            <Link to="/services" className="btn btn-ghost">Learn more</Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">Trusted by leading companies</p>
          <div className="mt-2 flex gap-6 opacity-70">
            <div className="h-6 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-brand-purple/15 to-brand-purple/5 p-6 border border-slate-200">
          <div className="aspect-[4/3] rounded-xl bg-white shadow-soft grid place-items-center text-slate-400">
            <span className="text-sm">Illustration / Screenshot</span>
          </div>
        </div>
      </div>
    </section>
  )
}
