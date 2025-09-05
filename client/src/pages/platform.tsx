
import { Link } from "react-router-dom";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

export default function PlatformPage(){
  const layers = [
    ["Routing","Skill, intent, and value-based distribution across voice/chat/email."],
    ["Assist","Agent assist with suggested replies, macros, and knowledge snippets."],
    ["Knowledge","Sync your docs, policies, SKUs, and past tickets. Freshness controls."],
    ["Automation","Tier-0 autosolve, RPA hooks, and secure action APIs."],
    ["Analytics","Quality scores, themes, and coaching at scale."],
    ["Integrations","Salesforce • Zendesk • HubSpot • Twilio • Slack • Gmail"]
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="VictorySync Platform"
          title="The contact stack,"
          accent="without the mess"
          subtitle="One pane of glass. Bring your CRM and helpdesk—our platform stitches it into a single, measurable flow."
          ctas={[{label:"See Integrations", to:"#integrations"}, {label:"Get a Demo", to:"/contact", variant:"outline"}]}
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Architecture that just works</h2>
                <p className="mt-4 text-lg text-slate-600">Each layer is optional, composable, and observable end-to-end.</p>
              </div>
            </Reveal>
            <div className="mt-8 space-y-3">
              {layers.map(([k,v],i)=>(
                <Reveal key={k} variant="left" delay={(i%3)+1}>
                  <div className="card glass rounded-2xl border border-slate-100 bg-white/70 p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full"
                        style={{background:i<3?"rgb(99,102,241)":"#94a3b8"}} />
                      <div>
                        <div className="font-bold">{k}</div>
                        <p className="text-sm text-slate-600">{v}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="integrations" className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-indigo-600">Integrations</span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Your tools, superpowered</h2>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                ["Salesforce","Accounts, cases, click-to-call, dispositions."],
                ["Zendesk","Macros, forms, requester, and custom fields."],
                ["HubSpot","Deals, contacts, sequences, and tasks."],
                ["Twilio","Programmable Voice + SMS, bring your numbers."],
                ["Slack","Escalations and approvals in-channel."],
                ["Gmail","Service inbox with governance."]
              ].map(([title,desc], i)=>(
                <Reveal key={String(title)} variant="up" delay={i%3}>
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
