import { MotionPage } from "@/components/motion-page";
import { Section, StaggerContainer, fadeInUp } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCalendly } from "@/hooks/useCalendly";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSubmissionSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useEffect } from "react";

type ContactFormData = z.infer<typeof insertContactSubmissionSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { open: openCalendly } = useCalendly();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(insertContactSubmissionSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Calendly) {
      const elem = document.getElementById("calendly-inline");
      const calendlyUrl =
        (import.meta as any).env?.VITE_CALENDLY_URL || "https://calendly.com";
      if (elem && (window as any).Calendly.initInlineWidget) {
        (window as any).Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: elem,
          prefill: {},
          utm: {},
        });
      }
    }
  }, []);

  return (
    <MotionPage className="bg-ink-900">
      <Section className="pt-24 pb-16 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <StaggerContainer className="text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Let's Start a Conversation
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Ready to transform your customer experience? Get in touch with our
              team.
            </p>
            <Button
              size="lg"
              onClick={openCalendly}
              className="bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold text-lg px-8"
              data-testid="button-schedule-call"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule a Call
            </Button>
          </motion.div>
        </StaggerContainer>
      </Section>

      <Section className="bg-ink-800">
        <div className="grid md:grid-cols-2 gap-12">
          <StaggerContainer>
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Have questions? We're here to help. Send us a message and we'll
                respond as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Email
                    </h3>
                    <p className="text-slate-300">
                      info@victorysync.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Phone
                    </h3>
                    <p className="text-slate-300">
                      Available via scheduled call
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Location
                    </h3>
                    <p className="text-slate-300">
                      Millstone, New Jersey, USA
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerContainer>

          <motion.div
            variants={fadeInUp}
            className="bg-ink-900 border border-ink-700 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-slate-300"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    className={`bg-ink-800 border-ink-600 text-white ${errors.firstName ? "border-red-500" : ""}`}
                    data-testid="input-first-name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-slate-300"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Doe"
                    className={`bg-ink-800 border-ink-600 text-white ${errors.lastName ? "border-red-500" : ""}`}
                    data-testid="input-last-name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="company"
                  className="text-slate-300"
                >
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Your Company"
                  className="bg-ink-800 border-ink-600 text-white"
                  data-testid="input-company"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className={`bg-ink-800 border-ink-600 text-white ${errors.email ? "border-red-500" : ""}`}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-slate-300"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  placeholder="Tell us about your needs..."
                  className={`bg-ink-800 border-ink-600 text-white ${errors.message ? "border-red-500" : ""}`}
                  data-testid="textarea-message"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
                disabled={contactMutation.isPending}
                data-testid="button-submit-contact"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </Section>

      <Section className="bg-ink-900">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Or Schedule a Call Directly
          </h2>
          <p className="text-lg text-slate-300">
            Pick a time that works best for you
          </p>
        </div>

        <div
          id="calendly-inline"
          className="calendly-inline-widget w-full rounded-xl overflow-hidden border border-ink-700"
          style={{ minHeight: "700px" }}
          data-url={`${(import.meta as any).env?.VITE_CALENDLY_URL || "https://calendly.com"}?hide_event_type_details=1&background_color=0f172a&text_color=e2e8f0&primary_color=10b981`}
        />
      </Section>
    </MotionPage>
  );
}
