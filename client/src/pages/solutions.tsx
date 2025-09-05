
import { Link } from "react-router-dom";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

export default function SolutionsPage(){
  const items = [
    {
      title:"Inbound Support",
      desc:"24/7 phone, chat, and email with AI triage and <60s first-reply. CSAT uplift with no headcount spikes.",
      points:["Omnichannel Queue","Knowledge-guided replies","Escalation playbooks"],
      link:"/contact"
    },
    {
      title:"Outbound Growth",
      desc:"Revenue ops for pipeline + reactivation. TCPA-compliant outreach with schedule windows.",
      points:["Callback cadences","CRM sync","QA & analytics"],
      link:"/contact"
    },
    {
      title:"Helpdesk & Live Chat",
      desc:"Tier-0 autosolve, Tier-1 assist, smart handoffs into Salesforce/Zendesk/HubSpot.",
      points:["Macros & blocks","Suggested next best action","Multi-lang"],
      link:"/platform"
    },
    {
      title:"QA & Analytics",
      desc:"Score every interaction for accuracy, empathy, and compliance—then coach with real examples.",
      points:["Auto-scoring rubric","Topic trends","Agent coaching"],
      link:"/resources"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="Solutions"
          title="Outcomes first,"
          accent="features second"
          subtitle="VictorySync is measured on business impact: faster replies, higher CSAT, lower cost per contact."
          ctas={[{label:"Get a Demo", to:"/contact"}, {label:"See Pricing", to:"/pricing", variant:"outline"}]}
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">What we deliver</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                  Pick a lane or bundle them together—each solution plugs into your tooling and data.
                </p>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {items.map((card, i)=>(
                <Reveal key={card.title} variant="up" delay={i%3}>
                  <div className="card glass rounded-2xl border border-slate-100 bg-white/70 p-5">
                    <div className="text-lg font-bold">{card.title}</div>
                    <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
                    <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
                      {card.points.map(p=><li key={p}>{p}</li>)}
                    </ul>
                    <Link to={card.link} className="mt-4 inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Explore</Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-indigo-600">Playbooks</span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Battle-tested flows</h2>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                ["After-Hours Capture","Blend human + AI to keep SLAs while your core team sleeps."],
                ["RMA & Returns","Policy-aware steps, label generation, and proactive status updates."],
                ["Billing & Refunds","Guardrails + approvals; reduce leakage while keeping CX high."]
              ].map(([title,desc], i)=>(
                <Reveal key={String(title)} variant="up" delay={i+1}>
                  <div className="card glass rounded-2xl border border-slate-100 bg-white/70 p-5">
                    <div className="font-bold">{title}</div>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FooterPro/>
    </div>
  );
}
