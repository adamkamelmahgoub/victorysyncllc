
import { useState } from "react";
import Navigation from "../components/navigation";
import FooterPro from "../components/FooterPro";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";

export default function ContactPage(){
  const [sent,setSent]=useState(false);
  function submit(e:React.FormEvent){ e.preventDefault(); setSent(true); }
  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <main>
        <HeroBanner
          eyebrow="Get in touch"
          title="We'd love to"
          accent="hear from you"
          subtitle="Tell us about your goals and current tools. We'll tailor a plan."
          rightPanel
        />

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4">
            <Reveal variant="up">
              <form onSubmit={submit} className="glass rounded-2xl border border-slate-100 bg-white/70 p-6 grid gap-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input required placeholder="Full name" className="glass rounded-xl border border-slate-100 bg-white/70 p-3"/>
                  <input required type="email" placeholder="Work email" className="glass rounded-xl border border-slate-100 bg-white/70 p-3"/>
                </div>
                <input placeholder="Company" className="glass rounded-xl border border-slate-100 bg-white/70 p-3"/>
                <textarea placeholder="What are you trying to achieve?" rows={5} className="glass rounded-xl border border-slate-100 bg-white/70 p-3"/>
                <button className="btn-shine rounded-lg px-5 py-2.5 font-semibold shadow-sm text-white w-max">Send</button>
                {sent && <div className="text-sm text-green-700">Thanks! We'll reply shortly.</div>}
              </form>
            </Reveal>

            <Reveal variant="fade" delay={2}>
              <div className="mt-6 glass rounded-2xl border border-slate-100 bg-white/70 p-5">
                <div className="font-bold">Contact</div>
                <div className="text-sm mt-1">Call: +1 (718) 813-2106</div>
                <div className="text-sm">Email: victorysynccx@gmail.com</div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterPro/>
    </div>
  );
}
