import { MotionPage } from '@/components/motion-page';
import { Section, StaggerContainer, fadeInUp } from '@/components/section';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Pricing() {
  const { open: openCalendly } = useCalendly();

  const { data: packages, isLoading } = useQuery<any[]>({
    queryKey: ['/api/packages'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 dark:bg-ink-900">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <MotionPage className="bg-ink-900 dark:bg-ink-900">
      <Section className="pt-24 pb-16 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <StaggerContainer className="text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-white mb-6">
              Flexible Pricing for Every Business
            </h1>
            <p className="text-xl text-gray-300 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Choose a plan that fits your needs. No hidden fees, no long-term contracts. Scale as you grow.
            </p>
            <div className="inline-block bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-6 py-3">
              <p className="text-lg font-semibold text-cyan-400">
                💰 Save up to 60% compared to US-based services
              </p>
            </div>
          </motion.div>
        </StaggerContainer>
      </Section>

      <Section className="bg-ink-800">
        {packages && packages.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg: any, index: number) => {
              const isPopular = index === 1;
              return (
                <motion.div
                  key={pkg.id}
                  variants={fadeInUp}
                  className={`relative bg-ink-900 dark:bg-ink-900 border ${
                    isPopular ? 'border-cyan-400' : 'border-ink-700'
                  } rounded-xl p-8 hover:-translate-y-1 transition-all duration-200`}
                  data-testid={`plan-card-${pkg.name.toLowerCase()}`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-cyan-500 text-ink-900 px-4 py-1 rounded-full text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      <span className="text-base font-normal text-gray-400">From</span>{' '}
                      ${parseFloat(pkg.price).toLocaleString()}
                      <span className="text-base font-normal text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 dark:text-gray-400">{pkg.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="text-cyan-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={openCalendly}
                    className={`w-full ${
                      isPopular
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-ink-900'
                        : 'bg-ink-800 hover:bg-ink-700 text-white border border-ink-600'
                    }`}
                    data-testid={`button-get-quote-${pkg.name.toLowerCase()}`}
                  >
                    Get a Quote
                  </Button>
                </motion.div>
              );
            })}
          </StaggerContainer>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">Loading pricing packages...</p>
          </div>
        )}
      </Section>

      <Section className="bg-ink-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-gray-300 dark:text-gray-300">
              Find the perfect fit for your business needs
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="features" className="bg-ink-800 border border-ink-700 rounded-lg px-6">
              <AccordionTrigger className="text-white dark:text-white hover:text-cyan-400">
                What features are included in each plan?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 dark:text-gray-300">
                All plans include 24/7 support, multi-channel capabilities, and advanced analytics. Higher-tier plans add features like AI automation, dedicated account management, and custom integrations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="scaling" className="bg-ink-800 border border-ink-700 rounded-lg px-6">
              <AccordionTrigger className="text-white dark:text-white hover:text-cyan-400">
                Can I change plans later?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 dark:text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contract" className="bg-ink-800 border border-ink-700 rounded-lg px-6">
              <AccordionTrigger className="text-white dark:text-white hover:text-cyan-400">
                Are there any long-term contracts?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 dark:text-gray-300">
                No long-term contracts required. We offer flexible month-to-month billing. Annual commitments are available for additional savings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom" className="bg-ink-800 border border-ink-700 rounded-lg px-6">
              <AccordionTrigger className="text-white dark:text-white hover:text-cyan-400">
                Do you offer custom enterprise plans?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 dark:text-gray-300">
                Absolutely! For large-scale deployments or unique requirements, we can create a custom plan tailored to your needs. Schedule a consultation to discuss your requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-6">
            Not Sure Which Plan is Right?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-300 mb-8">
            Schedule a consultation and we'll help you choose the perfect plan for your business
          </p>
          <Button
            size="lg"
            onClick={openCalendly}
            className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-medium text-lg px-8"
            data-testid="button-footer-get-quote"
          >
            Get a Quote
          </Button>
        </div>
      </Section>
    </MotionPage>
  );
}
