import { useCalendly } from "@/hooks/useCalendly";
import { useSeo } from "@/hooks/useSeo";
import { Link } from "wouter";
import { Calendar, CheckCircle, Users, BarChart3, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceNextSteps from "@/components/service-next-steps";

export default function AppointmentSetting() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'Appointment Setting Services | VictorySync',
    description: 'Outsourced appointment setting for US sales teams. Lead follow-up, qualification, and direct calendar booking — 40%+ lead-to-appointment rate.',
    canonical: 'https://victorysync.com/appointment-setting',
  });

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 pt-24 pb-16 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30 mb-6">
              Appointment Setting
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Fill Your Calendar With Qualified Appointments
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              VictorySync's appointment setting team follows up on leads, qualifies prospects, and books them directly onto your calendar — so your sales team focuses on closing, not chasing.
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
              { title: "Sales-driven businesses", desc: "Companies with a sales team that needs a consistent pipeline of qualified, booked appointments to work from." },
              { title: "Service and consulting firms", desc: "Agencies, coaches, consultants, and service companies that sell through discovery or strategy calls." },
              { title: "Inbound lead-heavy operations", desc: "Businesses with web leads, ad leads, or inquiry lists that aren't being followed up on fast enough." },
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
          <p className="text-slate-400 mb-10">From first outreach to confirmed appointment — our team manages the full follow-up and booking workflow.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Phone, title: "Lead Follow-Up Calls", items: ["Call inbound and outbound leads within minutes", "Multi-touch follow-up sequences", "Voicemail drops where appropriate", "Warm handoffs to your sales team"] },
              { icon: Calendar, title: "Calendar Booking", items: ["Direct booking to your calendar system", "Confirmation and reminder calls/texts", "Rescheduling and no-show follow-up", "CRM updates with each booking"] },
              { icon: Users, title: "Lead Qualification", items: ["Custom qualification questions per your criteria", "Budget, authority, timeline screening", "Lead scoring and notes in your CRM", "Disqualified lead reporting"] },
              { icon: BarChart3, title: "Show Rate Improvement", items: ["Reminder calls 24 hours before appointments", "Day-of confirmation texts", "Same-day reschedule handling", "No-show re-engagement campaigns"] },
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
              { step: "01", title: "Campaign Setup", desc: "We align on your ideal customer profile, qualifying criteria, calendar tool, and CRM workflow." },
              { step: "02", title: "Script & Training", desc: "Agents are trained on your pitch, qualification questions, and objection handling." },
              { step: "03", title: "Outreach & Booking", desc: "We call, follow up, and book qualified appointments directly to your calendar daily." },
              { step: "04", title: "Daily Reporting", desc: "You receive daily activity reports: calls made, contacts reached, appointments set, and show rates." },
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
              { icon: Calendar, title: "Consistent pipeline", desc: "A predictable flow of booked appointments every week, not just when you have time to follow up." },
              { icon: Clock, title: "Faster lead response", desc: "Leads contacted within minutes of inquiry — dramatically improving conversion rates." },
              { icon: BarChart3, title: "Transparent reporting", desc: "Know exactly how many contacts were made, appointments set, and what the pipeline looks like." },
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
      <ServiceNextSteps related={[{ label: 'Home services', href: '/appointment-setting-for-home-services' }, { label: 'Real estate', href: '/appointment-setting-for-real-estate' }]} />
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's build your appointment pipeline.</h2>
          <p className="text-slate-300 mb-8">Book a free 20-minute call to discuss your current lead volume, follow-up process, and what a VictorySync appointment setting team could do for your business.</p>
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
