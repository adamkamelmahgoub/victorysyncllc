import { Link } from 'wouter';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';
import { siteFacts, siteOrigin } from '@/config/siteFacts';
import { Button } from '@/components/ui/button';
import ClutchWidget from '@/components/clutch-widget';
import { MapPin, Users, Shield, BarChart3, CheckCircle } from 'lucide-react';

const aboutSchema = [
  { '@context': 'https://schema.org', '@type': 'AboutPage', '@id': `${siteOrigin}/about-us#about`, url: `${siteOrigin}/about-us`, name: `About ${siteFacts.brandName}`, mainEntity: { '@id': `${siteOrigin}/#organization` } },
];

export default function AboutUs() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'About VictorySync | US-Managed Contact Center Based in New Jersey',
    description: 'VictorySync is a US-managed contact center with trained agents in Cairo, Egypt, built to help US businesses scale support and sales without the cost of in-house hiring.',
    canonical: 'https://victorysync.com/about-us',
    structuredData: aboutSchema,
  });

  return (
    <div className="min-h-screen bg-ink-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 pt-24 pb-16 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/30 mb-6">
              About VictorySync
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              US-Managed Quality. Cairo-Based Efficiency.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              VictorySync is a US-managed contact center helping US businesses handle inbound support, outbound calling, and appointment setting—with trained agents in Cairo, Egypt, direct management from New Jersey, and AI tools that support the team behind the scenes.
            </p>
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="py-16 bg-ink-800 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Built for US-managed execution</h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                VictorySync is based in Millstone, New Jersey and was built to solve a problem many US businesses face: they are either overpaying for domestic call center labor or accepting poor quality from overseas providers with no real oversight.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                The answer was a hybrid model — professional, English-speaking agents trained and managed to US business standards, operating from Cairo, Egypt with US-based account management keeping quality high on every campaign.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {siteFacts.legalName} is registered and operated from Millstone, New Jersey. Agent operations are based in Cairo, Egypt.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-ink-900 rounded-xl p-5 border border-ink-700 flex items-start gap-4">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm mb-1">Dual-location operating model</div>
                  <div className="text-slate-400 text-sm">US management in Millstone, NJ. Agent team in Cairo, Egypt.</div>
                </div>
              </div>
              <div className="bg-ink-900 rounded-xl p-5 border border-ink-700 flex items-start gap-4">
                <Users className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm mb-1">Trained, English-speaking agents</div>
                  <div className="text-slate-400 text-sm">Agents trained on client-specific scripts, workflows, and brand tone before going live.</div>
                </div>
              </div>
              <div className="bg-ink-900 rounded-xl p-5 border border-ink-700 flex items-start gap-4">
                <Shield className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm mb-1">US-managed quality control</div>
                  <div className="text-slate-400 text-sm">Every campaign overseen by US-based management. Not a black box.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Most US businesses can't afford to scale customer support in-house. Hiring, training, managing, and retaining a customer service team is expensive and time-consuming — especially when the business is still growing.
            </p>
            <p className="text-slate-300 mb-4 leading-relaxed">
              VictorySync exists to change that. We give businesses access to professional contact center capacity at a fraction of the cost of US hiring, without sacrificing the quality, communication, and accountability that US clients expect.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our model is simple: we take on the hiring, training, and daily management of your agent team — and you get a dedicated, performing operation without the overhead.
            </p>
          </div>
        </div>
      </section>

      {/* Operating Model */}
      <section className="py-16 bg-ink-800 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-10">How We Operate</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Campaign setup & alignment',
                desc: 'Every engagement starts with a discovery process. We learn your business, customers, tools, and what success looks like before a single call is made.',
              },
              {
                title: 'Agent training & scripting',
                desc: 'Agents are trained on your products, services, and tone. Scripts are reviewed and approved before launch. Nothing goes live without your sign-off.',
              },
              {
                title: 'Daily activity & reporting',
                desc: 'You receive daily summaries of calls made, contacts reached, appointments set, and key outcomes. No surprises.',
              },
              {
                title: 'QA reviews & optimization',
                desc: 'Regular call reviews, QA scoring, and performance tracking ensure quality stays high. We surface issues and fix them proactively.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-ink-900 rounded-xl p-6 border border-ink-700">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Clients Can Expect */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">What to Expect as a VictorySync Client</h2>
          <p className="text-slate-400 mb-10 max-w-2xl leading-relaxed">
            We're direct about what we do and what we don't. Here's what you can realistically expect when working with us.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'A dedicated agent team',
                desc: 'Agents assigned to your account, trained specifically for your business, not rotated across dozens of clients.',
              },
              {
                icon: BarChart3,
                title: 'Transparent reporting',
                desc: 'Daily and weekly reports. You always know what your team is doing, how many contacts were made, and what the outcomes were.',
              },
              {
                icon: Shield,
                title: 'Responsive management',
                desc: 'Direct access to your account manager. Issues get addressed quickly, not lost in a ticket queue.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-ink-800 rounded-xl p-6 border border-ink-700">
                  <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mx-auto max-w-5xl px-4"><ClutchWidget key="about-clutch" /></div>
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to talk about your business?</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Book a free 20-minute call with the VictorySync team. We'll ask about your current operation and tell you honestly whether and how VictorySync can help.
          </p>
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
