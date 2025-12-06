
import { FC } from "react";

export const Hero: FC = () => {
  return (
    <section className="bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:py-24">
        {/* Left: copy */}
        <div className="w-full md:w-1/2 space-y-6">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
            VictorySync • U.S. based, Cairo agent team
          </span>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Stop losing money on missed calls and slow follow-ups.
          </h1>

          <p className="text-base text-slate-300 sm:text-lg">
            VictorySync answers every call, follows up every lead, and extends
            your hours with a trained agent team in Cairo. You get the coverage
            of a full contact center at up to 60% lower cost than hiring in-house.
          </p>

          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Live answer in seconds, not minutes.</li>
            <li>• Inbound support, outbound follow-up, and appointment setting.</li>
            <li>• Dedicated account manager watching quality on every campaign.</li>
          </ul>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold
                         bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
            >
              Book a 20-minute strategy call
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold
                         border border-slate-600 text-slate-50 hover:bg-slate-900/60 transition"
            >
              View pricing options
            </a>
          </div>

          <p className="text-xs text-slate-400">
            Based in Millstone, NJ • Phone, email, and SMS support • No long-term
            contracts to start.
          </p>
        </div>

        {/* Right: visual placeholder */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-2xl bg-slate-900/70 p-4 shadow-xl ring-1 ring-slate-800">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>Live Calls Dashboard</span>
              <span>Today</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl bg-slate-950/60 p-3">
                <div className="text-slate-400">Calls answered</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-400">
                  98%
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-3">
                <div className="text-slate-400">Avg. wait</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-400">
                  12s
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-3">
                <div className="text-slate-400">Leads followed-up</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-400">
                  100%
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Show your clients and prospects a simple, real-time view of how our
              team is protecting their revenue every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
