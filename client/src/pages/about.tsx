import { Globe, Users, Shield, Award, Target, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';

export default function About() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'About VictorySync | US-Managed Contact Center, Millstone NJ',
    description: 'VictorySync is a US-managed contact center with trained agents in Cairo, Egypt. We help US businesses scale support and sales without in-house hiring overhead.',
    canonical: 'https://victorysync.com/about',
  });

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for exceptional quality in every interaction, ensuring your customers receive the best possible service."
    },
    {
      icon: Heart,
      title: "Partnership",
      description: "We view our clients as partners, working together to achieve mutual success and long-term growth."
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Trust and transparency are at the core of everything we do, from data security to honest communication."
    },
    {
      icon: Award,
      title: "Innovation",
      description: "We continuously adopt new technologies and methodologies to stay ahead of industry trends."
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Clients" },
    { number: "2M+", label: "Calls Handled" },
    { number: "99.9%", label: "Uptime" },
    { number: "60%", label: "Average Cost Savings" }
  ];

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 py-20 text-white border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About VictorySync
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Based in Millstone, New Jersey, we're your trusted partner for customer engagement and back-office support. We leverage our strategic East Coast location to deliver exceptional service at competitive rates.
              </p>
              <Button size="lg" onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold">
                Get in Touch
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern business district"
                className="rounded-2xl shadow-lg w-full border border-ink-700"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-800 py-16 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-20 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-slate-300 mb-6">
                To empower small and medium-sized businesses across the United States by providing world-class customer engagement services at competitive rates, while creating meaningful employment opportunities.
              </p>
              <p className="text-slate-300">
                We believe that exceptional customer service shouldn't be a luxury reserved for large corporations. Every business deserves access to professional, reliable, and cost-effective customer support solutions.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-lg text-slate-300 mb-6">
                To become the leading provider of customer engagement solutions, setting new standards for professional customer service while contributing to economic growth.
              </p>
              <p className="text-slate-300">
                We envision a future where geographical boundaries don't limit business potential, and where technology enables seamless collaboration across continents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-800 py-20 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why New Jersey is the Perfect Choice
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              New Jersey offers the ideal combination of skilled talent, competitive costs, and strategic advantages
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="text-cyan-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Strategic Location</h3>
                <p className="text-slate-300">
                  Millstone's East Coast location ensures perfect alignment with US business hours and seamless communication.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-cyan-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Skilled Workforce</h3>
                <p className="text-slate-300">
                  New Jersey has a large pool of educated, English-speaking professionals with strong communication skills and cultural awareness.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-cyan-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Business Environment</h3>
                <p className="text-slate-300">
                  New Jersey's business-friendly environment and proximity to major markets makes it an ideal location for professional services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-20 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="bg-ink-800 border-ink-700 hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="text-cyan-400 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-slate-300 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ink-800 py-20 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-slate-300">
              Meet the experienced professionals driving our success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-8 text-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
                  alt="CEO Portrait"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-cyan-500/30"
                />
                <h3 className="text-xl font-bold text-white mb-2">Executive Leadership</h3>
                <p className="text-cyan-400 font-semibold mb-3">Client Strategy & Operations</p>
                <p className="text-sm text-slate-300">
                  VictorySync leadership brings deep expertise in US-managed BPO services, appointment setting, and client success.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-8 text-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
                  alt="Operations Lead Portrait"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-cyan-500/30"
                />
                <h3 className="text-xl font-bold text-white mb-2">Sarah Mitchell</h3>
                <p className="text-cyan-400 font-semibold mb-3">Head of Operations</p>
                <p className="text-sm text-slate-300">
                  Technology leader with expertise in AI, automation, and scalable customer service platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-8 text-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
                  alt="Quality Lead Portrait"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-cyan-500/30"
                />
                <h3 className="text-xl font-bold text-white mb-2">Omar El-Masry</h3>
                <p className="text-cyan-400 font-semibold mb-3">Quality & Compliance Lead</p>
                <p className="text-sm text-slate-300">
                  Operations expert specializing in quality assurance, process optimization, TCPA compliance, and team management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Discover how VictorySync can help your business reduce costs while improving customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={openCalendly} className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold">
              Schedule a Consultation
            </Button>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-500/10">
                View Our Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
