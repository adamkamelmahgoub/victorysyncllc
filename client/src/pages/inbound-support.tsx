import { useCalendly } from "@/hooks/useCalendly";
import { useSeo } from "@/hooks/useSeo";
import { Link } from "wouter";
import { Phone, MessageSquare, Mail, CheckCircle, ArrowRight, Clock, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceNextSteps from "@/components/service-next-steps";
import { siteFacts } from '@/config/siteFacts';

export default function InboundSupport() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'Inbound Customer Support Services | VictorySync',
    description: `Outsourced inbound call center support for US businesses. Live phone, email, chat, and ticket handling, US-managed and Cairo-staffed, with straightforward campaigns often starting within ${siteFacts.straightforwardLaunchTimeframe}.`,
    canonical: 'https://victorysync.com/inbound-support',
  });

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 pt-24 pb-16 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30 mb-6">
              Inbound Customer Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Never Miss a Customer Call or Message Again
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              VictorySync handles your inbound calls, emails, live chat, and tickets — with US-managed quality control and trained agents ready to represent your brand from day one.
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
              { title: "Small to mid-size businesses", desc: "Businesses handling 20–500+ inbound inquiries per day who need reliable coverage without full-time hires." },
              { title: "Service-based companies", desc: "Home services, healthcare practices, legal offices, and agencies that need professional phone and chat coverage." },
              { title: "E-commerce brands", desc: "Online retailers that need order support, returns, and customer inquiries handled quickly and professionally." },
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
          <p className="text-slate-400 mb-10">Our trained agents become an extension of your team, handling every inbound channel with professionalism and consistency.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Phone, title: "Phone Support", items: ["Live call answering", "Warm transfers and escalations", "Call recording and QA monitoring", ...(siteFacts.afterHoursCoverage ? ["Coverage after the office closes"] : [])] },
              { icon: Mail, title: "Email Support", items: ["Ticket creation and routing", "Response within agreed SLAs", "Template-based and custom responses", "Escalation to your team when needed"] },
              { icon: MessageSquare, title: "Live Chat & SMS", items: ["Real-time chat responses", "SMS follow-up and inquiry handling", "Chat-to-call escalation"] },
              { icon: BarChart3, title: "Reporting & QA", items: ["Daily activity summaries", "Call and ticket volume reports", "Agent performance reviews", "Weekly QA scoring and feedback"] },
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
              { step: "01", title: "Discovery Call", desc: "We learn your business, call scripts, escalation paths, and what your customers expect." },
              { step: "02", title: "Setup & Training", desc: "Agents are trained on your products, tone, and processes. Scripts and SOPs are finalized together." },
              { step: "03", title: "Go Live", desc: "Your calls and messages are routed to our team. We answer within your agreed hours and standards." },
              { step: "04", title: "QA & Reporting", desc: "Daily summaries, weekly QA reviews, and ongoing improvements based on real call data." },
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

      {/* Business Outcome */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Clients Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Extended coverage", desc: "Handle inquiries before, during, and after business hours without adding headcount." },
              { icon: Shield, title: "US-managed quality", desc: "US-based management oversees every campaign. Not a black box." },
              { icon: BarChart3, title: "Clear reporting", desc: "Know exactly what's happening with your inbound volume, response times, and satisfaction." },
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
      <ServiceNextSteps related={[{ label: 'Inbound support for law firms', href: '/inbound-support-for-law-firms' }]} />
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to stop missing calls?</h2>
          <p className="text-slate-300 mb-8">Book a free 20-minute call and we'll map an inbound workflow that can often launch within {siteFacts.straightforwardLaunchTimeframe} after scripts, access, and escalation rules are approved.</p>
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
