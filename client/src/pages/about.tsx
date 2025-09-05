
import { Link } from "react-router-dom";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

export default function AboutPage(){
  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="About VictorySync"
          title="Modern CX,"
          accent="delivered"
          subtitle="Cairo talent, U.S. clients, and AI workflow that finally transforms the customer experience."
          ctas={[{label:"Join Us", to:"/contact"}, {label:"Get a Demo", to:"/contact", variant:"outline"}]}
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Principles</h2>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                ["Outcome over output","Measure what matters: CSAT, first-reply time, and retention."],
                ["Humans + AI","Pair skilled agents with guard-railed automation."],
                ["Operate simple","Ship, learn, and iterate weekly."]
              ].map(([k,v], i)=>(
                <Reveal key={String(k)} variant="up" delay={i}>
                  <div className="glass rounded-2xl border border-slate-100 bg-white/70 p-5">
                    <div className="font-bold">{k}</div>
                    <p className="text-sm text-slate-600 mt-2">{v}</p>
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
