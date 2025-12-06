import { MotionPage } from '@/components/motion-page';
import { Section, StaggerContainer, fadeInUp } from '@/components/section';
import { MetricTile } from '@/components/metric-tile';
import { ResourceCard } from '@/components/resource-card';
import { LogoRow } from '@/components/logo-row';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Hero } from "../components/Hero";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Bot,
  BarChart3,
  Phone,
  MessageSquare,
  Zap,
  Database,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const customerStories = [
  {
    company: 'TechCorp Solutions',
    outcome: 'Reduced support costs by 65% while improving customer satisfaction by 40%',
    industry: 'Technology'
  },
  {
    company: 'HealthPlus Medical',
    outcome: 'Achieved 24/7 patient support coverage with 95% first-call resolution',
    industry: 'Healthcare'
  },
  {
    company: 'RetailMax Inc',
    outcome: 'Increased sales conversions by 55% through AI-powered customer engagement',
    industry: 'Retail'
  }
];

export default function Home() {
  const { open: openCalendly } = useCalendly();
  const [activeStory, setActiveStory] = useState(0);

  return (
    <MotionPage className="bg-slate-950">
      <Hero />

      <Section className="bg-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Measurable Business Outcomes
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Our clients achieve significant improvements across key metrics
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricTile
            icon={DollarSign}
            value="60%"
            label="Cost Reduction"
            description="Average savings vs. US-based services"
          />
          <MetricTile
            icon={Clock}
            value="-35s"
            label="Faster Resolution"
            description="Reduced average handle time"
          />
          <MetricTile
            icon={TrendingUp}
            value="+28%"
            label="NPS Increase"
            description="Improved customer satisfaction"
          />
          <MetricTile
            icon={Users}
            value="97%"
            label="First-Call Resolution"
            description="Issues solved on first contact"
          />
          <MetricTile
            icon={Zap}
            value="85%"
            label="Automation Rate"
            description="Queries handled by AI"
          />
          <MetricTile
            icon={Phone}
            value="24/7"
            label="Support Coverage"
            description="Always-on customer service"
          />
        </StaggerContainer>
      </Section>

      <Section className="bg-slate-950">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Our Capabilities
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            A comprehensive platform for modern customer experience
          </p>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-900 p-2 rounded-lg mb-8">
            <TabsTrigger value="ai" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Bot className="w-4 h-4 mr-2" />
              AI Bots
            </TabsTrigger>
            <TabsTrigger value="engagement" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <MessageSquare className="w-4 h-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="platform" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Database className="w-4 h-4 mr-2" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="channels" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Phone className="w-4 h-4 mr-2" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="wfm" className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
              <Users className="w-4 h-4 mr-2" />
              WFM
            </TabsTrigger>
          </TabsList>

          <div className="bg-slate-900 rounded-xl p-8">
            <TabsContent value="ai" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-50">AI-Powered Automation</h3>
              <p className="text-slate-300">Deploy intelligent bots that understand context, learn from interactions, and handle customer inquiries with human-like understanding.</p>
              <Link href="/platform" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">Learn More <ChevronRight className="w-4 h-4" /></Link>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-50">Customer Engagement Hub</h3>
              <p className="text-slate-300">Centralize all customer interactions across channels for a unified view of every customer journey and touchpoint.</p>
              <Link href="/platform" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">Learn More <ChevronRight className="w-4 h-4" /></Link>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-50">Advanced Analytics</h3>
              <p className="text-slate-300">Transform data into actionable insights with real-time dashboards, predictive analytics, and comprehensive reporting.</p>
              <Link href="/platform" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">Learn More <ChevronRight className="w-4 h-4" /></Link>
            </TabsContent>

            <TabsContent value="platform" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-50">Open Integration Platform</h3>
              <p className="text-slate-300">Seamlessly integrate with your existing systems through our open API architecture and pre-built connectors.</p>
              <Link href="/platform" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">Learn More <ChevronRight className="w-4 h-4" /></Link>
            </TabsContent>

            <TabsContent value="channels" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-50">Omnichannel Support</h3>
              <p className="text-slate-300">Connect with customers on their preferred channels - voice, chat, email, SMS, WhatsApp, and social media.</p>
              <Link href="/platform" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">Learn More <ChevronRight className="w-4 h-4" /></Link>
            </TabsContent>

            <TabsContent value="wfm" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-50">Workforce Management</h3>
              <p className="text-slate-300">Optimize your team with intelligent scheduling, forecasting, quality management, and performance tracking.</p>
              <Link href="/platform" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">Learn More <ChevronRight className="w-4 h-4" /></Link>
            </TabsContent>
          </div>
        </Tabs>
      </Section>

      <Section className="bg-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Customer Success Stories
          </h2>
          <p className="text-lg text-slate-300">
            See how we've helped businesses transform their CX
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-xl p-8 md:p-12 mb-8 border border-slate-800">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full mb-4">
                {customerStories[activeStory].industry}
              </span>
              <h3 className="text-2xl font-bold text-slate-50 mb-2">
                {customerStories[activeStory].company}
              </h3>
            </div>
            <p className="text-lg text-slate-300 mb-6">
              "{customerStories[activeStory].outcome}"
            </p>
            <Link href="/blog">
              <Button variant="link" className="text-emerald-400 hover:text-emerald-300 p-0">
                Read Case Study <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-2">
            {customerStories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStory(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStory === idx ? 'bg-emerald-400 w-8' : 'bg-slate-600'
                }`}
                aria-label={`View story ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-ink-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-white mb-4">
            Latest Insights & Resources
          </h2>
          <p className="text-lg text-gray-300 text-gray-300">
            Stay informed with our latest thinking on CX trends
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          <ResourceCard
            tag="Blog"
            title="The Future of AI in Customer Service"
            description="Discover how artificial intelligence is transforming customer support operations and what it means for your business."
            href="/blog"
          />
          <ResourceCard
            tag="Webinar"
            title="Reducing Contact Center Costs"
            description="Learn proven strategies to cut operational costs while maintaining exceptional service quality."
            href="/blog"
          />
          <ResourceCard
            tag="Report"
            title="2025 CX Trends Report"
            description="Our annual analysis of customer experience trends, technologies, and best practices for the year ahead."
            href="/blog"
          />
        </StaggerContainer>
      </Section>

      <Section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Schedule a consultation to learn how we can help you achieve your CX goals
          </p>
          <Button
            size="lg"
            onClick={openCalendly}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-lg px-8"
            data-testid="button-footer-get-quote"
          >
            Get a Quote
          </Button>
        </div>
      </Section>
    </MotionPage>
  );
}