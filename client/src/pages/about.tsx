import { Globe, Users, Shield, Award, Target, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import PageHero from "@/components/PageHero";

export default function About() {
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
    <div className="min-h-screen bg-white">
      <PageHero
        title="About VictorySync"
        subtitle="Transforming customer service operations with professional call center solutions and AI automation from Millstone, New Jersey."
      />

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold victory-purple mb-2">{stat.number}</div>
                <div className="victory-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold victory-dark mb-6">Our Mission</h2>
              <p className="text-lg victory-gray mb-6">
                To empower small and medium-sized businesses across the United States by providing world-class customer engagement services at competitive rates, while creating meaningful employment opportunities in New Jersey.
              </p>
              <p className="victory-gray">
                We believe that exceptional customer service shouldn't be a luxury reserved for large corporations. Every business deserves access to professional, reliable, and cost-effective customer support solutions.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold victory-dark mb-6">Our Vision</h2>
              <p className="text-lg victory-gray mb-6">
                To become the leading provider of customer engagement solutions on the East Coast, setting new standards for professional customer service while contributing to economic growth in the region.
              </p>
              <p className="victory-gray">
                We envision a future where geographical boundaries don't limit business potential, and where technology enables seamless collaboration across continents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Egypt */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Why New Jersey is the Perfect Choice
            </h2>
            <p className="text-xl victory-gray max-w-3xl mx-auto">
              New Jersey offers the ideal combination of skilled talent, competitive costs, and strategic advantages
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="victory-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold victory-dark mb-4">Strategic Location</h3>
                <p className="victory-gray">
                  Millstone's East Coast location ensures perfect alignment with US business hours and seamless communication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="victory-blue w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold victory-dark mb-4">Skilled Workforce</h3>
                <p className="victory-gray">
                  New Jersey has a large pool of educated, English-speaking professionals with strong communication skills and cultural awareness.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold victory-dark mb-4">Business Environment</h3>
                <p className="victory-gray">
                  New Jersey's business-friendly environment and proximity to major markets makes it an ideal location for professional services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Our Core Values
            </h2>
            <p className="text-xl victory-gray">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="victory-purple w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold victory-dark mb-4">{value.title}</h3>
                    <p className="victory-gray text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Leadership Team
            </h2>
            <p className="text-xl victory-gray">
              Meet the experienced professionals driving our success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200" 
                  alt="CEO Portrait" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="text-xl font-bold victory-dark mb-2">Ahmed Hassan</h3>
                <p className="victory-purple font-semibold mb-3">Chief Executive Officer</p>
                <p className="text-sm victory-gray">
                  15+ years in outsourcing and business development, former director at a Fortune 500 BPO company.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200" 
                  alt="CTO Portrait" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="text-xl font-bold victory-dark mb-2">Sarah Mitchell</h3>
                <p className="victory-purple font-semibold mb-3">Chief Technology Officer</p>
                <p className="text-sm victory-gray">
                  Technology leader with expertise in AI, automation, and scalable customer service platforms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200" 
                  alt="COO Portrait" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="text-xl font-bold victory-dark mb-2">Omar El-Masry</h3>
                <p className="victory-purple font-semibold mb-3">Chief Operations Officer</p>
                <p className="text-sm victory-gray">
                  Operations expert specializing in quality assurance, process optimization, and team management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-vs-cta py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Discover how VictorySync can help your business reduce costs while improving customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-victory-purple text-white hover:bg-purple-700">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-victory-purple">
                View Our Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}