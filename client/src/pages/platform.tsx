import { MotionPage } from '@/components/motion-page';
import { Section, StaggerContainer, fadeInUp } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCalendly } from '@/hooks/useCalendly';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Database, 
  BarChart3, 
  Users, 
  Phone, 
  MessageSquare
} from 'lucide-react';

const capabilities = [
  {
    id: 'ai-bots',
    label: 'AI Bots',
    icon: Bot,
    title: 'Intelligent AI Automation',
    description: 'Deploy conversational AI bots that handle customer inquiries 24/7 with natural language understanding and context-aware responses.',
    features: [
      'Natural language processing',
      'Multi-channel support',
      'Sentiment analysis',
      'Self-learning capabilities'
    ]
  },
  {
    id: 'engagement',
    label: 'Engagement Hub',
    icon: MessageSquare,
    title: 'Customer Engagement Data Hub',
    description: 'Centralize all customer interactions across channels for a unified view of your customer engagement.',
    features: [
      'Omnichannel integration',
      'Real-time data sync',
      'Customer journey tracking',
      'Interaction analytics'
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    title: 'Advanced Analytics & Insights',
    description: 'Gain actionable insights from your customer data with powerful analytics and reporting tools.',
    features: [
      'Real-time dashboards',
      'Predictive analytics',
      'Custom reports',
      'Performance metrics'
    ]
  },
  {
    id: 'wfm',
    label: 'WFM/WFO',
    icon: Users,
    title: 'Workforce Management & Optimization',
    description: 'Optimize your workforce with intelligent scheduling, forecasting, and performance management.',
    features: [
      'Smart scheduling',
      'Forecasting tools',
      'Performance tracking',
      'Quality management'
    ]
  },
  {
    id: 'channels',
    label: 'Channels',
    icon: Phone,
    title: 'Multi-Channel Support',
    description: 'Connect with customers on their preferred channels - voice, chat, email, SMS, and social media.',
    features: [
      'Voice & IVR',
      'Live chat',
      'Email support',
      'SMS & WhatsApp'
    ]
  },
  {
    id: 'platform',
    label: 'Open Platform',
    icon: Database,
    title: 'Open Integration Platform',
    description: 'Integrate seamlessly with your existing tools and systems through our open API architecture.',
    features: [
      'RESTful APIs',
      'Webhook support',
      'Pre-built integrations',
      'Custom connectors'
    ]
  }
];

export default function Platform() {
  const { open: openCalendly } = useCalendly();

  return (
    <MotionPage className="bg-ink-900">
      <Section className="pt-24 pb-16 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <StaggerContainer className="text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Platform
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              A comprehensive suite of tools designed to transform your customer experience operations
            </p>
            <Button 
              size="lg"
              onClick={openCalendly}
              className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
              data-testid="button-hero-get-quote"
            >
              Get a Quote
            </Button>
          </motion.div>
        </StaggerContainer>
      </Section>

      <Section className="bg-ink-800">
        <Tabs defaultValue="ai-bots" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-ink-900 p-2 rounded-lg mb-12">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <TabsTrigger 
                  key={cap.id} 
                  value={cap.id}
                  className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 text-slate-400 hover:text-slate-200"
                  data-testid={`tab-${cap.id}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">{cap.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <TabsContent key={cap.id} value={cap.id} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-cyan-500/10 text-cyan-400 mb-6">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {cap.title}
                    </h2>
                    <p className="text-lg text-slate-300 mb-6">
                      {cap.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {cap.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={openCalendly}
                      className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
                    >
                      Learn More
                    </Button>
                  </div>
                  <div className="bg-ink-700 rounded-xl p-12 flex items-center justify-center min-h-[400px]">
                    <Icon className="w-48 h-48 text-cyan-400/20" />
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </Section>

      <Section className="bg-ink-900">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your CX Operations?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Schedule a consultation to see how our platform can help you achieve your goals
          </p>
          <Button 
            size="lg"
            onClick={openCalendly}
            className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
          >
            Get a Quote
          </Button>
        </div>
      </Section>
    </MotionPage>
  );
}
