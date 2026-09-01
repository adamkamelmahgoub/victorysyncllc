import { useCalendly } from "@/hooks/useCalendly";
import { useSeo } from "@/hooks/useSeo";
import { Link } from "wouter";
import { Bot, CheckCircle, BarChart3, Zap, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AiAutomation() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'AI-Assisted Agent Operations & Reporting | VictorySync',
    description: 'Give human contact center agents better call summaries, CRM updates, lead routing, and daily reporting while keeping people in control.',
    canonical: 'https://victorysync.com/ai-automation',
  });

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 pt-24 pb-16 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30 mb-6">
              AI-Assisted Agent Operations
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Automate the Repetitive. Amplify Your Team.
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              VictorySync gives your human support and sales agents practical AI assistance for call summaries, CRM updates, lead routing, reminders, and reporting—so they spend more time serving customers and speaking with prospects.
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
              { title: "Businesses with messy ops", desc: "Companies where agents spend too much time on data entry, manual follow-up, and pulling reports instead of serving customers." },
              { title: "Sales teams with CRM gaps", desc: "Sales operations where leads fall through because of slow CRM updates, missed follow-up triggers, or manual routing." },
              { title: "Growth-stage companies", desc: "Scaling businesses that need more throughput from their existing team without adding headcount." },
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
          <h2 className="text-2xl font-bold text-white mb-4">What VictorySync Automates</h2>
          <p className="text-slate-400 mb-10">We build human-in-the-loop AI workflows that reduce manual work while keeping your team in control.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: "Call Summaries & Notes", items: ["Automatic post-call summaries", "Key outcomes and action items extracted", "Notes pushed directly to your CRM", "Manager-ready daily digests"] },
              { icon: Zap, title: "CRM Updates & Lead Routing", items: ["Lead status updated after every contact", "Automatic routing based on qualification", "Follow-up tasks created automatically", "Dead lead re-engagement triggers"] },
              { icon: BarChart3, title: "Reporting Dashboards", items: ["Real-time call and ticket volume views", "Agent performance dashboards", "Weekly and monthly trend reports", "Custom KPI tracking per your business"] },
              { icon: Users, title: "Human-in-the-Loop Oversight", items: ["AI-assisted, human-reviewed workflows", "Escalation triggers for edge cases", "Manager review queues", "Quality checks on automated outputs"] },
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

      {/* How It Works */}
      <section className="py-16 bg-ink-800 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Workflow Audit", desc: "We map your current ops: where time is wasted, where leads get lost, and where automation would have the most impact." },
              { step: "02", title: "Automation Design", desc: "We design AI-assisted workflows that fit your existing tools — CRM, calendar, phone system, and reporting stack." },
              { step: "03", title: "Pilot & Integrate", desc: "We deploy automations in a controlled pilot. Your team reviews outputs before anything runs at scale." },
              { step: "04", title: "Monitor & Refine", desc: "Ongoing oversight ensures automations stay accurate, and we refine them as your business evolves." },
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

      {/* What Clients Get */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Clients Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "More throughput", desc: "Your team handles more volume without more headcount because repetitive tasks are automated." },
              { icon: Bot, title: "Better data quality", desc: "CRM records stay clean and current because updates happen automatically after every interaction." },
              { icon: BarChart3, title: "Clearer visibility", desc: "Management gets real-time dashboards and clean reports without asking agents to compile them manually." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-ink-800 rounded-xl p-6 border border-ink-700">
                  <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's find the automation that saves you the most time.</h2>
          <p className="text-slate-300 mb-8">Book a free 20-minute call and we'll walk through your current workflow and identify what AI automation could realistically handle for your team.</p>
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
