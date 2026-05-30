import { useCalendly } from "@/hooks/useCalendly";
import { Link } from "wouter";
import { Phone, CheckCircle, BarChart3, Shield, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ColdCalling() {
  const { open: openCalendly } = useCalendly();

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 pt-24 pb-16 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30 mb-6">
              Cold Calling & Outbound
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Outbound Calling That Sounds Like Your Best Sales Rep
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              VictorySync runs client-approved, DNC-conscious cold calling campaigns using trained English-speaking agents — qualifying prospects and booking meetings on your behalf.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold px-8 py-3">
                Book a Free Call
              </Button>
              <Link href="/pricing">
                <Button variant="outline" className="border-ink-600 text-slate-300 hover:bg-ink-800 px-8 py-3">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 bg-ink-800 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Who This Is For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "B2B companies", desc: "Businesses that sell to other businesses and need outbound prospecting done consistently without burning out an internal sales team." },
              { title: "Lead list owners", desc: "Companies with purchased or internally generated contact lists that need professional callers to work those lists." },
              { title: "Scaling sales operations", desc: "Growing businesses that need outbound capacity without the overhead of hiring, training, and managing in-house SDRs." },
            ].map((item) => (
              <div key={item.title} className="bg-ink-900 rounded-xl p-6 border border-ink-700">
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">What VictorySync Handles</h2>
          <p className="text-slate-400 mb-10">We work from your approved scripts and lead lists to execute outbound campaigns that qualify, engage, and convert.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Phone, title: "Lead List Calling", items: ["Systematic outreach from your approved lead lists", "Multi-attempt cadences for hard-to-reach contacts", "Voicemail strategy and callbacks", "Contact verification and list cleaning"] },
              { icon: MessageSquare, title: "Qualification & Transfer", items: ["Custom qualification scripts per your criteria", "Warm transfers to your sales team", "Appointment booking for qualified prospects", "Disqualification notes and CRM updates"] },
              { icon: Shield, title: "Compliance-Aware Outreach", items: ["DNC-conscious calling workflow", "Client-approved scripts only", "Call recording where permitted by client", "No unsolicited or unapproved outreach"] },
              { icon: BarChart3, title: "Reporting & Optimization", items: ["Daily call activity and disposition reports", "Connect rate and conversion tracking", "Script performance notes", "Weekly review and optimization recommendations"] },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="bg-ink-800 rounded-xl p-6 border border-ink-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Note */}
      <section className="py-12 bg-ink-800 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">Responsible Outbound Practices</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              VictorySync supports compliance-aware outbound calling. We use client-approved scripts, maintain DNC-conscious workflows, record calls only where the client permits, and provide full transparency on every campaign.
            </p>
            <p className="text-slate-400 text-xs">
              This is not legal advice. Clients are responsible for ensuring their outreach programs comply with applicable laws including TCPA, FTC rules, and state regulations. VictorySync's processes are built to support responsible outbound operations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Campaign Brief", desc: "We review your target list, ideal prospect profile, and what a qualified lead looks like for your team." },
              { step: "02", title: "Script & Training", desc: "Agents are trained on your pitch, objections, and what to do with interested, uninterested, or gatekeeper contacts." },
              { step: "03", title: "Calling Begins", desc: "We execute daily outbound dials against your list. Qualified prospects are transferred or booked." },
              { step: "04", title: "Daily Reporting", desc: "Every day you receive a breakdown: dials made, contacts reached, qualified, and what's in the pipeline." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-4xl font-bold text-cyan-500/20 mb-3">{item.step}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to put your outbound on autopilot?</h2>
          <p className="text-slate-300 mb-8">Book a free call to discuss your lead list, campaign goals, and how VictorySync can deliver consistent outbound activity every week.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold px-8 py-3">
              Book a Free Call
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-ink-600 text-slate-300 hover:bg-ink-800 px-8 py-3">
                Send Us a Message
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
