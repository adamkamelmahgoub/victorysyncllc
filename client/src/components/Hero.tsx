import { FC } from "react";
import { useCalendly } from "@/hooks/useCalendly";
import { Link } from "wouter";

export const Hero: FC = () => {
  const { open } = useCalendly();

  return (
    <section className="bg-ink-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:py-24">
        {/* Left: text */}
        <div className="w-full space-y-6 lg:w-1/2">
          <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30">
            US-managed quality. Cairo-based efficiency.
          </span>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Scale Customer Support & Appointment Setting Without Hiring In-House
          </h1>

          <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
            VictorySync helps US businesses handle inbound support, outbound calling, lead follow-up, and customer engagement — with US-managed quality control and trained agents in Cairo, Egypt.
          </p>

          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              Inbound support, outbound calling, and appointment setting.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              US-based account management overseeing every campaign.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              Daily reporting, QA monitoring, and flexible scaling.
            </li>
          </ul>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={open}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-cyan-500 text-ink-900 hover:bg-cyan-400 transition"
              data-testid="button-book-call"
            >
              Book a Free Strategy Call
            </button>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-ink-600 text-white hover:bg-ink-800/60 transition"
              data-testid="button-view-services"
            >
              View Our Services
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500">
            <span>Millstone, New Jersey</span>
            <span>·</span>
            <span>Cairo, Egypt</span>
            <span>·</span>
            <span>No long-term contracts to start</span>
          </div>
        </div>

        {/* Right: services card */}
        <div className="w-full lg:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 translate-y-6 blur-3xl opacity-40 bg-gradient-to-tr from-cyan-500/30 via-cyan-500/10 to-slate-900" />

            <div className="relative rounded-2xl bg-ink-800/80 p-6 shadow-2xl ring-1 ring-ink-700">
              <div className="mb-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                What we handle for your business
              </div>

              <div className="space-y-3">
                {[
                  { label: "Inbound Customer Support", detail: "Phone, email, chat & ticket handling" },
                  { label: "Appointment Setting", detail: "Lead follow-up, qualification & booking" },
                  { label: "Cold Calling", detail: "DNC-aware outbound with daily reporting" },
                  { label: "Email, Chat & SMS", detail: "Multi-channel customer communication" },
                  { label: "AI Automation & Reporting", detail: "CRM updates, summaries & dashboards" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl bg-ink-900/60 p-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-ink-700 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <div className="text-lg font-bold text-cyan-400">98%</div>
                  <div className="text-slate-500">Answer rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-400">&lt;30s</div>
                  <div className="text-slate-500">Avg wait time</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-400">Daily</div>
                  <div className="text-slate-500">Reporting</div>
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
