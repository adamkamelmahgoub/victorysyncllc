
import { Link } from "react-router-dom";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

const plans = [
  {name:"Starter",    price:"$899/mo", cta:"Add a Plan",
   features:["Up to 500 contacts","Email + Chat","Business hours","Basic analytics"]},
  {name:"Growth",     price:"$1990/mo", cta:"Add a Plan",
   features:["Up to 2,500 contacts","Voice + Chat + Email","24/7 coverage","QA scoring"]},
  {name:"Enterprise", price:"Talk to us", cta:"Contact Sales",
   features:["Unlimited contacts","Custom SLAs","Security & SSO","Dedicated CSM"]},
];

export default function PricingPage(){
  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="Transparent pricing"
          title="Scale up and"
          accent="never down"
          subtitle="Plans sized by monthly contact volume. No surprise fees."
          ctas={[{label:"Get a Demo", to:"/contact"}]}
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((p,i)=>(
                <Reveal key={p.name} variant="up" delay={i}>
                  <div className="card glass rounded-2xl border border-slate-100 bg-white/70 p-6">
                    <div className="text-sm font-bold text-slate-700">{p.name}</div>
                    <div className="mt-2 text-3xl font-extrabold">{p.price}</div>
                    <ul className="mt-4 space-y-2 text-sm">
                      {p.features.map(f=><li key={f}>• {f}</li>)}
                    </ul>
                    <Link to="/contact" className="mt-6 inline-block btn-shine rounded-lg px-5 py-2.5 font-semibold shadow-sm text-white">{p.cta}</Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-indigo-600">FAQ</span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Common questions</h2>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-4">
              {[
                ["How do you count contacts?","Every resolved conversation across voice, chat, and email counts as one contact."],
                ["Do you support seasonal bursts?","Yes—overflow is included with usage bands so you don't lose coverage."],
                ["What's onboarding like?","Two weeks to go live: integrations, knowledge sync, playbooks, and QA setup."]
              ].map(([q,a], i)=>(
                <Reveal key={String(q)} variant="fade" delay={(i%3)+1}>
                  <div className="glass rounded-2xl border border-slate-100 bg-white/70 p-5">
                    <div className="font-bold">{q}</div>
                    <p className="text-sm text-slate-600 mt-1">{a}</p>
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
