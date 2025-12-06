import { FC } from "react";

export const Hero: FC = () => {
  return (
    <section className="bg-ink-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:py-24">
        {/* Left: text */}
        <div className="w-full space-y-6 lg:w-1/2">
          <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30">
            VictorySync • Contact center and CX partner
          </span>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Never miss another call or lead again.
          </h1>

          <p className="text-base text-gray-300 sm:text-lg">
            VictorySync is a U.S. based contact center with a trained agent team
            in Cairo. We answer your inbound calls, follow up every lead, and
            extend your hours so you stop losing deals after 5 PM.
          </p>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Live answer in seconds, not minutes.</li>
            <li>• Inbound support, outbound follow up, and appointment setting.</li>
            <li>• Dedicated account manager overseeing quality on every campaign.</li>
          </ul>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <a
              href="/book-call"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-cyan-500 text-ink-900 hover:bg-cyan-400 transition"
              data-testid="button-book-call"
            >
              Book a 20 minute strategy call
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-ink-600 text-white hover:bg-ink-800/60 transition"
              data-testid="button-view-pricing"
            >
              View pricing options
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-3 text-xs text-gray-400">
            <span>Based in Millstone, NJ</span>
            <span>Agents in Cairo, Egypt</span>
            <span>No long term contracts to start</span>
          </div>
        </div>

        {/* Right: dashboard style card */}
        <div className="w-full lg:w-1/2">
          <div className="relative">
            {/* Soft glow background */}
            <div className="absolute inset-0 translate-y-6 blur-3xl opacity-50 bg-gradient-to-tr from-cyan-500/30 via-cyan-500/20 to-slate-900" />

            <div className="relative rounded-2xl bg-ink-800/80 p-4 shadow-2xl ring-1 ring-ink-700">
              <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                <span>Live calls dashboard</span>
                <span>Today</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-xl bg-ink-900/70 p-3">
                  <div className="text-gray-400">Calls answered</div>
                  <div className="mt-1 text-2xl font-semibold text-cyan-400">98%</div>
                  <div className="mt-1 text-[10px] text-white0">During business hours</div>
                </div>

                <div className="rounded-xl bg-ink-900/70 p-3">
                  <div className="text-gray-400">Avg wait time</div>
                  <div className="mt-1 text-2xl font-semibold text-cyan-400">12s</div>
                  <div className="mt-1 text-[10px] text-white0">From ring to answer</div>
                </div>

                <div className="rounded-xl bg-ink-900/70 p-3">
                  <div className="text-gray-400">Leads followed up</div>
                  <div className="mt-1 text-2xl font-semibold text-cyan-400">100%</div>
                  <div className="mt-1 text-[10px] text-white0">Within 5 minutes</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-ink-900/70 p-3 text-xs">
                <div className="mb-2 flex items-center justify-between text-gray-300">
                  <span>Current queues</span>
                  <span className="text-cyan-400">Healthy</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Inbound support</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-700">
                        <div className="h-full w-[15%] bg-cyan-400" />
                      </div>
                      <span className="text-white0">3 waiting</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Outbound sales</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-700">
                        <div className="h-full w-0 bg-cyan-400" />
                      </div>
                      <span className="text-white0">0 waiting</span>
                    </div>
                  </div>
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
