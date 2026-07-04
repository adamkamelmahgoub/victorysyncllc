import { FC } from "react";
import { useCalendly } from "@/hooks/useCalendly";
import { Link } from "wouter";

export const Hero: FC = () => {
  const { open } = useCalendly();

  return (
    <section className="bg-ink-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:items-center lg:py-28">

        {/* Left */}
        <div className="w-full lg:w-[52%] space-y-7">
          <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
            Millstone, NJ &nbsp;·&nbsp; Cairo, Egypt
          </p>

          <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-[3.25rem]">
            Your calls get answered.<br />
            Leads get followed up.<br />
            <span className="text-cyan-400">Calendar stays full.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            VictorySync runs your inbound support, outbound calling, and appointment setting — managed from the US, staffed by trained agents in Cairo.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row pt-1">
            <Link
              href="/book-call"
              onClick={(e) => { e.preventDefault(); open(); }}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-cyan-500 text-ink-900 hover:bg-cyan-400 transition"
              data-testid="button-book-call"
            >
              Book a 20-min call
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-ink-600 text-slate-300 hover:bg-ink-800/60 transition"
              data-testid="button-view-services"
            >
              See what we handle
            </Link>
          </div>

          <p className="text-xs text-slate-600">No long-term contracts to start.</p>
        </div>

        {/* Right: live ops card */}
        <div className="w-full lg:w-[48%]">
          <div className="relative">
            <div className="absolute inset-0 translate-y-8 blur-3xl opacity-30 bg-gradient-to-br from-cyan-500/40 to-transparent" />

            <div className="relative rounded-2xl bg-ink-800 p-5 shadow-2xl ring-1 ring-ink-700/80">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-ink-700">
                <span className="text-xs font-medium text-slate-400">Live ops — today</span>
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Queue rows */}
              <div className="space-y-2.5 mb-5">
                {[
                  { channel: "Inbound calls", status: "Answered", widthClass: "w-[98%]", note: "98% answer rate" },
                  { channel: "Lead follow-ups", status: "Live", widthClass: "w-full", note: "< 5 min contact time" },
                  { channel: "Appointments set", status: "On track", widthClass: "w-[72%]", note: "12 booked today" },
                ].map((row) => (
                  <div key={row.channel} className="flex items-center gap-3 bg-ink-900/50 rounded-lg px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-medium text-slate-300 truncate">{row.channel}</span>
                        <span className="text-xs text-slate-500 ml-2 flex-shrink-0">{row.note}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-ink-700 overflow-hidden">
                        <div className={`h-full bg-cyan-400 rounded-full ${row.widthClass}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-ink-700 text-center">
                <div>
                  <div className="text-xl font-bold text-cyan-400">98%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Answer rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-cyan-400">&lt; 30s</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Wait time</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-cyan-400">Daily</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Reports</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
