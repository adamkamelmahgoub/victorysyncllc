
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="animate-[vs-fade-in-up_600ms_ease-out]">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            AI-powered contact center, <span className="text-indigo-600">managed for you</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            24/7 inbound & outbound, faster responses, happier customers—at up to 60% lower cost.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => { window.location.href = "/contact"; }}>Get a Demo</Button>
            <Link to="/pricing" className="rounded-xl border px-5 py-3 transition hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0">
              See Pricing
            </Link>
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-slate-600">
            <li>• Cairo ops + U.S. clients</li>
            <li>• Omnichannel triage + human handoff</li>
            <li>• QA scorecards & coaching insights</li>
          </ul>
        </div>
        <div className="relative">
          <img
            src="/vs_ppt_1920.jpg"
            alt="VictorySync operations"
            className="w-full rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
