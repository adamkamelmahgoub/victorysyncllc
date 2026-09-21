import { MotionPage } from '@/components/motion-page';
import { Section, StaggerContainer, fadeInUp } from '@/components/section';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { useSeo } from '@/hooks/useSeo';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Phone, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const starterOffer = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'VictorySync Starter contact center service',
  serviceType: 'Inbound or outbound contact center service',
  provider: { '@id': 'https://www.victorysync.com/#organization' },
  offers: {
    '@type': 'Offer',
    price: '10',
    priceCurrency: 'USD',
    priceSpecification: { '@type': 'UnitPriceSpecification', price: '10', priceCurrency: 'USD', unitText: 'per agent hour' },
    url: 'https://www.victorysync.com/pricing',
  },
};

export default function Pricing() {
  const { open: openCalendly } = useCalendly();
  useSeo({
    title: 'Pricing | Contact Center Services Starting at $10/hr | VictorySync',
    description: 'Custom-quoted packages starting at $10/hr per agent. Inbound support, appointment setting, and cold calling — flexible pricing with no long-term contracts required.',
    canonical: 'https://victorysync.com/pricing',
    structuredData: starterOffer,
  });

  const [missedCalls, setMissedCalls] = useState(50);
  const [avgOrderValue, setAvgOrderValue] = useState(100);
  const [conversionRate, setConversionRate] = useState(20);

  const missedRevenue = ((missedCalls * (conversionRate / 100) * avgOrderValue) * 30).toFixed(0);
  const yearlyMissedRevenue = (parseFloat(missedRevenue) * 12).toFixed(0);

  const [currentCost, setCurrentCost] = useState(10000);
  const [teamSize, setTeamSize] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(8);

  const ourCost = currentCost * 0.4;
  const monthlySavings = currentCost - ourCost;
  const yearlySavings = monthlySavings * 12;
  const roi = ((monthlySavings / ourCost) * 100).toFixed(0);

  return (
    <MotionPage className="bg-ink-900">
      <Section className="pt-24 pb-16 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <StaggerContainer className="text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Pricing Sized to Your Needs
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Every business is unique. Let's create a custom solution that fits your specific requirements and budget.
            </p>
          </motion.div>
        </StaggerContainer>
      </Section>

      <section className="border-y border-blue-100 bg-blue-50 px-5 py-12">
        <div className="mx-auto max-w-4xl rounded-xl border border-blue-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Starter</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">From $10/hr per agent</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">A focused starting point with one trained agent and one inbound or outbound workflow.</p>
          <ul className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {['One trained agent', 'One inbound or outbound workflow', 'Approved scripts', 'Daily activity reporting', 'Weekly QA review'].map(feature => <li key={feature}>✓ {feature}</li>)}
          </ul>
          <p className="mt-5 text-xs text-slate-500">Final pricing depends on coverage, channels, tools, and campaign scope.</p>
        </div>
      </section>

      <Section className="bg-ink-800 border-y border-ink-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Get a Custom Quote
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Our pricing is tailored to your business needs. Schedule a free consultation to discuss your requirements and receive a personalized quote.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Hidden Fees</h3>
                <p className="text-slate-300 text-sm">Transparent pricing with no surprises</p>
              </CardContent>
            </Card>
            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Scale as You Grow</h3>
                <p className="text-slate-300 text-sm">Flexible plans that adapt to your needs</p>
              </CardContent>
            </Card>
            <Card className="bg-ink-900 border-ink-700">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Long-Term Contracts</h3>
                <p className="text-slate-300 text-sm">Month-to-month flexibility</p>
              </CardContent>
            </Card>
          </div>
          <Button
            size="lg"
            onClick={openCalendly}
            className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold text-lg px-8"
            data-testid="button-get-quote"
          >
            Get a Quote
          </Button>
        </div>
      </Section>

      <Section className="bg-ink-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Phone className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Missed Calls Calculator
            </h2>
            <p className="text-lg text-slate-300">
              See how much revenue you might be losing from unanswered calls
            </p>
          </div>

          <Card className="bg-ink-800 border-ink-700">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Missed Calls Per Day
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={missedCalls}
                      onChange={(e) => setMissedCalls(Number(e.target.value))}
                      className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      data-testid="input-missed-calls"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>1</span>
                      <span className="text-cyan-400 font-bold text-xl">{missedCalls}</span>
                      <span>200</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Average Order Value ($)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={avgOrderValue}
                      onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                      className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      data-testid="input-avg-order-value"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>$10</span>
                      <span className="text-cyan-400 font-bold text-xl">${avgOrderValue}</span>
                      <span>$1,000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Conversion Rate (%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      data-testid="input-conversion-rate"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>5%</span>
                      <span className="text-cyan-400 font-bold text-xl">{conversionRate}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-8 flex flex-col justify-center">
                  <div className="text-center">
                    <p className="text-slate-300 mb-2">Monthly Lost Revenue</p>
                    <p className="text-5xl font-bold text-cyan-400 mb-6" data-testid="text-monthly-lost-revenue">
                      ${parseFloat(missedRevenue).toLocaleString()}
                    </p>
                    <div className="h-px bg-cyan-500/30 mb-6"></div>
                    <p className="text-slate-300 mb-2">Yearly Lost Revenue</p>
                    <p className="text-4xl font-bold text-white" data-testid="text-yearly-lost-revenue">
                      ${parseFloat(yearlyMissedRevenue).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-ink-900 rounded-lg p-6 text-center border border-ink-700">
                <p className="text-slate-300 mb-4">
                  Don't let missed calls cost you revenue. Our 24/7 contact center ensures you never miss an opportunity.
                </p>
                <Button
                  onClick={openCalendly}
                  className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
                  data-testid="button-missed-calls-cta"
                >
                  Start Capturing Every Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section className="bg-ink-800 border-y border-ink-700">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Calculator className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ROI Calculator
            </h2>
            <p className="text-lg text-slate-300">
              Calculate your potential savings with VictorySync
            </p>
          </div>

          <Card className="bg-ink-900 border-ink-700">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Monthly Support Cost ($)
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="500"
                      value={currentCost}
                      onChange={(e) => setCurrentCost(Number(e.target.value))}
                      className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      data-testid="input-current-cost"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>$1K</span>
                      <span className="text-cyan-400 font-bold text-xl">${(currentCost / 1000).toFixed(1)}K</span>
                      <span>$50K</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Team Size (Agents)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      data-testid="input-team-size"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>1</span>
                      <span className="text-cyan-400 font-bold text-xl">{teamSize}</span>
                      <span>50</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Hours of Coverage Per Day
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="24"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(Number(e.target.value))}
                      className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      data-testid="input-hours-per-day"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>4h</span>
                      <span className="text-cyan-400 font-bold text-xl">{hoursPerDay}h</span>
                      <span>24h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
                    <p className="text-slate-300 text-sm mb-1">Your Current Cost</p>
                    <p className="text-3xl font-bold text-white" data-testid="text-current-cost">
                      ${currentCost.toLocaleString()}/mo
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
                    <p className="text-slate-300 text-sm mb-1">VictorySync Cost (60% savings)</p>
                    <p className="text-3xl font-bold text-cyan-400" data-testid="text-our-cost">
                      ${ourCost.toLocaleString()}/mo
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
                    <p className="text-slate-300 text-sm mb-1">Monthly Savings</p>
                    <p className="text-3xl font-bold text-cyan-400" data-testid="text-monthly-savings">
                      ${monthlySavings.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
                    <p className="text-slate-300 text-sm mb-1">Yearly Savings</p>
                    <p className="text-4xl font-bold text-cyan-400" data-testid="text-yearly-savings">
                      ${yearlySavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-ink-900 to-ink-900 rounded-lg p-6 text-center border border-ink-700">
                <p className="text-slate-300 mb-4">
                  <span className="text-2xl font-bold text-cyan-400">{roi}% ROI</span> • 
                  Save <span className="font-bold text-cyan-400">${monthlySavings.toLocaleString()}/month</span> while improving service quality
                </p>
                <Button
                  onClick={openCalendly}
                  className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
                  data-testid="button-roi-cta"
                >
                  See How Much You Can Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Schedule a consultation and we'll create a custom solution for your business
          </p>
          <Button
            size="lg"
            onClick={openCalendly}
            className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold text-lg px-8"
            data-testid="button-footer-get-quote"
          >
            Get Your Custom Quote
          </Button>
        </div>
      </Section>
    </MotionPage>
  );
}
