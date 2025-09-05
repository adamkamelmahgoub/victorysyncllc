
import { Link } from "react-router-dom";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

export default function ResourcesPage(){
  const res = [
    ["After-Hours Playbook","Capture missed revenue with blended on-call coverage.","/contact"],
    ["QA Scorecard Template","What to measure and how to coach.","/contact"],
    ["Missed Calls Cost Calculator","Quantify the impact of slow response times.","/contact"]
  ];
  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="Resources"
          title="Playbooks, templates,"
          accent="and calculators"
          subtitle="Everything you need to modernize your contact center—fast."
          ctas={[{label:"Get the Bundle", to:"/contact"}]}
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal variant="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Latest</h2>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {res.map(([t, d, link], i)=>(
                <Reveal key={String(t)} variant="up" delay={i%3}>
                  <Link to={String(link)} className="card glass rounded-2xl border border-slate-100 bg-white/70 p-5 block">
                    <div className="font-bold">{t}</div>
                    <p className="mt-2 text-sm text-slate-600">{d}</p>
                    <span className="mt-4 inline-block text-sm font-bold text-indigo-600">Open →</span>
                  </Link>
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
