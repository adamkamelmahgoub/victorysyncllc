
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">AI-powered contact center, managed for you</h1>
          <p className="mt-4 text-lg text-slate-600">24/7 inbound & outbound, faster responses, happier customers—at up to 60% lower cost.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="rounded-xl bg-primary px-5 py-3 text-white hover:-translate-y-0.5 hover:bg-primary-600 transition">Get a Demo</Link>
            <Link to="/pricing" className="rounded-xl border px-5 py-3 hover:bg-slate-50 hover:-translate-y-0.5 transition">See Pricing</Link>
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-slate-600">
            <li>• Cairo operations + U.S. clients</li>
            <li>• Omnichannel triage with human handoff</li>
            <li>• QA scorecards & coaching insights</li>
          </ul>
        </div>
        <div className="relative">
          <img src="/LOGO_VS.png" alt="VictorySync operations" className="w-full rounded-2xl shadow-lg transition hover:shadow-xl" loading="eager" />
        </div>
      </div>
    </section>
  );
}
