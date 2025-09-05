
import { Link } from "react-router-dom";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

export default function IndustriesPage(){
  const sectors = [
    ["Retail","Peak-season surge handling, order status, returns."],
    ["E-commerce","Checkout, subscriptions, and LTV-safe refunds."],
    ["Fintech","KYC, disputes, and high-touch verifications."],
    ["Healthcare","Scheduling, reminders, and benefit questions."],
    ["Telecom","Provisioning, outages, and retention saves."],
    ["Logistics","Tracking, delivery windows, and claims."]
  ];
  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="Industries"
          title="Tailored flows for"
          accent="your business"
          subtitle="From retail to fintech, we ship playbooks that match your risk, policy, and tone."
          ctas={[{label:"Talk to Solutions", to:"/contact"}, {label:"Case Studies", to:"/resources", variant:"outline"}]}
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Where we shine</h2>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {sectors.map(([k,v], i)=>(
                <Reveal key={String(k)} variant="up" delay={i%3}>
                  <div className="card glass rounded-2xl border border-slate-100 bg-white/70 p-5">
                    <div className="font-bold">{k}</div>
                    <p className="mt-2 text-sm text-slate-600">{v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-5xl px-4">
            <Reveal variant="up">
              <div className="text-center">
                <span className="text-sm font-semibold text-indigo-600">Proof</span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">A quick win pattern</h2>
                <p className="mt-4 text-lg text-slate-600">Start with after-hours + chat deflection. Expect 30–60% ticket reduction in 30 days.</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterPro/>
    </div>
  );
}
