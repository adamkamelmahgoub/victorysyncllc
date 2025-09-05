
import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useTilt } from "../hooks/useTilt";

export default function HeroPro(){
  const { ref, inView } = useInView<HTMLDivElement>();
  const card = useTilt(10);

  return (
    <section className="mesh bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Copy */}
          <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> VictorySync Platform
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              AI contact center, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600">managed for you</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              24/7 inbound & outbound, omnichannel triage, <span className="font-semibold">under 60s first reply</span>, and measurable ROI—without the overhead.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="btn-shine rounded-lg px-5 py-2.5 font-semibold shadow-sm">Get a Demo</Link>
              <Link to="/pricing" className="rounded-lg border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">See Pricing</Link>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 max-w-lg text-center">
              {[
                ["60%", "Cost savings"],
                ["<60s", "First reply"],
                ["24/7", "Coverage"],
              ].map(([k,v])=>(
                <div key={k} className="rounded-xl border border-slate-100 bg-white/70 p-4 glass">
                  <dt className="text-sm text-slate-500">{v}</dt>
                  <dd className="text-2xl font-extrabold text-slate-900">{k}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual */}
          <div className="relative">
            <div ref={card.ref} className="tilt rounded-2xl border border-white/60 bg-white/60 p-2 shadow-2xl glass">
              <div className="relative overflow-hidden rounded-xl bg-grid">
                <img
                  src="https://images.unsplash.com/photo-1581091870633-1e7eab09f1b0?q=80&w=1600&auto=format&fit=crop"
                  className="h-[340px] w-full object-cover"
                  alt="Agent console"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/40" />
              </div>
            </div>

            {/* floating orbs */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-fuchsia-400/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-6 bottom-8 h-24 w-24 rounded-full bg-indigo-400/30 blur-2xl" />
          </div>
        </div>

        {/* marquee */}
        <div className="mt-12 marquee">
          <div className="marquee-track">
            {["Zendesk","HubSpot","Salesforce","Twilio","Slack","Gmail"].map((logo)=>(
              <div key={logo} className="flex h-12 items-center justify-center rounded-xl border border-slate-100 bg-white/70 px-5 glass">
                <span className="text-sm font-semibold text-slate-600">{logo}</span>
              </div>
            ))}
            {/* duplicate for seamless loop */}
            {["Zendesk","HubSpot","Salesforce","Twilio","Slack","Gmail"].map((logo)=>(
              <div key={logo+"2"} className="flex h-12 items-center justify-center rounded-xl border border-slate-100 bg-white/70 px-5 glass">
                <span className="text-sm font-semibold text-slate-600">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
