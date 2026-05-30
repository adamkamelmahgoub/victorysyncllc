import { Phone, Calendar, Users, MessageSquare, Bot, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCalendly } from "@/hooks/useCalendly";

const services = [
  {
    icon: Phone,
    title: "Inbound Customer Support",
    href: "/inbound-support",
    who: "Service businesses, e-commerce brands, and any company handling 20+ inbound inquiries per day.",
    description:
      "VictorySync agents answer your calls, emails, live chat, and tickets — professionally and consistently, on your behalf.",
    handles: [
      "Live call answering within seconds",
      "Email and ticket handling with SLA compliance",
      "Live chat and SMS support",
      "Escalation routing to your internal team",
      "Call recording and QA monitoring",
      "Daily activity summaries",
    ],
    outcome: "Never miss a customer call or message. Extended coverage without adding headcount.",
  },
  {
    icon: Calendar,
    title: "Appointment Setting",
    href: "/appointment-setting",
    who: "Sales teams, service companies, consultants, and agencies who sell through discovery or strategy calls.",
    description:
      "Our agents follow up on leads, qualify prospects, and book appointments directly to your calendar — daily.",
    handles: [
      "Lead follow-up calls within minutes of inquiry",
      "Custom qualification scripts per your criteria",
      "Direct calendar booking to your system",
      "CRM updates after every contact",
      "Confirmation and reminder calls/texts",
      "No-show re-engagement and rescheduling",
    ],
    outcome: "A consistent, predictable appointment pipeline without burning out your sales team.",
  },
  {
    icon: Users,
    title: "Cold Calling",
    href: "/cold-calling",
    who: "B2B companies, lead list owners, and sales operations that need outbound capacity without hiring SDRs.",
    description:
      "We run client-approved, DNC-conscious cold calling campaigns using trained English-speaking agents who qualify and transfer.",
    handles: [
      "Systematic outreach from your approved lead lists",
      "Client-approved scripts only",
      "Qualification and warm transfers to your team",
      "Appointment booking for qualified prospects",
      "DNC-conscious calling workflow",
      "Daily call activity and disposition reports",
    ],
    outcome: "Consistent outbound activity every day, without the overhead of hiring and managing in-house SDRs.",
  },
  {
    icon: MessageSquare,
    title: "Lead Follow-Up",
    href: "/services",
    who: "Any business with web leads, ad leads, or inquiry lists that aren't being followed up on quickly enough.",
    description:
      "Speed to lead is everything. Our team contacts new leads within minutes and runs multi-touch follow-up sequences until they convert or opt out.",
    handles: [
      "Lead contacted within minutes of inquiry",
      "Multi-attempt phone, SMS, and email sequences",
      "Qualification and CRM updates",
      "Warm handoff to your sales team",
      "Re-engagement for cold or unresponsive leads",
      "Daily pipeline and activity reporting",
    ],
    outcome: "Higher contact rates, more qualified conversations, and fewer leads falling through the cracks.",
  },
  {
    icon: MessageSquare,
    title: "Email, Chat & SMS Support",
    href: "/inbound-support",
    who: "Businesses with multi-channel customer inquiries that need consistent, professional responses across all channels.",
    description:
      "VictorySync handles customer communications across email, live chat, and SMS — with the same quality standards as your phone support.",
    handles: [
      "Email response within agreed SLA windows",
      "Live chat handled in real time",
      "SMS inquiry triage and response",
      "Ticket creation, routing, and resolution",
      "Escalation to your team for complex cases",
      "Reporting on volume, response times, and outcomes",
    ],
    outcome: "A consistent brand experience across every channel customers use to reach you.",
  },
  {
    icon: Bot,
    title: "AI Automation & Reporting",
    href: "/ai-automation",
    who: "Businesses where agents spend too much time on data entry, manual reporting, or repetitive follow-up tasks.",
    description:
      "VictorySync layers AI automation into your workflows — automating call summaries, CRM updates, lead routing, and reporting dashboards.",
    handles: [
      "Automatic post-call summaries pushed to CRM",
      "Lead status and routing updated after every contact",
      "Follow-up task creation and reminders",
      "Real-time reporting dashboards",
      "Human-in-the-loop oversight on all automations",
      "Weekly and monthly performance reports",
    ],
    outcome: "More throughput from your existing team, cleaner CRM data, and better visibility for management.",
  },
];

export default function Services() {
  const { open: openCalendly } = useCalendly();

  return (
    <div className="min-h-screen bg-ink-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 pt-24 pb-16 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30 mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Everything You Need to Scale Customer Engagement
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              VictorySync covers the full customer engagement workflow — from inbound support to outbound sales and AI automation — with US-managed quality control and trained agents in Cairo, Egypt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold px-8">
                Book a Free Call
              </Button>
              <Link href="/pricing">
                <Button variant="outline" className="border-ink-600 text-slate-300 hover:bg-ink-800 px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`rounded-2xl border border-ink-700 overflow-hidden ${idx % 2 === 0 ? "bg-ink-800" : "bg-ink-800/50"}`}
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{service.title}</h2>
                      <p className="text-sm text-slate-500">For: {service.who}</p>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-8 leading-relaxed max-w-2xl">{service.description}</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">What we handle</h3>
                      <ul className="space-y-2">
                        {service.handles.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="bg-ink-900 rounded-xl p-5 border border-ink-700 mb-6">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Business outcome</div>
                        <p className="text-slate-300 text-sm leading-relaxed">{service.outcome}</p>
                      </div>
                      <Link href={service.href}>
                        <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-400 w-full sm:w-auto">
                          Learn More <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-ink-800 border-t border-ink-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure which service fits?</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Book a free 20-minute call and we'll walk through your current operation and tell you exactly which services would make the most impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold px-8">
              Book a Free Call
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-ink-600 text-slate-300 hover:bg-ink-800 px-8">
                Send Us a Message
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
