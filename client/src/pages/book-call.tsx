import { useEffect } from "react";
import { Link } from "wouter";
import { useCalendly } from "@/hooks/useCalendly";
import { useSeo } from "@/hooks/useSeo";
import { CheckCircle, Clock, Users, ArrowRight, Phone, Mail } from "lucide-react";

const BookCall = () => {
  const { open } = useCalendly();
  useSeo({
    title: 'Book a Free Strategy Call | VictorySync Contact Center',
    description: 'Schedule a free 30-minute strategy call with VictorySync. Discover how US-managed contact center services can reduce your customer service costs by up to 60%.',
    canonical: 'https://victorysync.com/book-call',
  });

  useEffect(() => {
    if (!(window as Window & { __PRERENDERING__?: boolean }).__PRERENDERING__) open();
  }, [open]);

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 border-b border-ink-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Book a Free Strategy Call with VictorySync
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            In 30 minutes, discover exactly how our US-managed contact center can reduce your customer service costs by up to 60% — without sacrificing quality.
          </p>
          <button
            onClick={open}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Schedule My Call
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">What We'll Cover</h2>
            <ul className="space-y-4">
              {[
                "Your current customer service challenges and cost structure",
                "How VictorySync's US-managed agents can close gaps in your support",
                "AI automation opportunities specific to your business",
                "A realistic timeline and pricing for your situation",
                "How other companies in your industry have cut costs 40–60%",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Who This Call Is For</h2>
            <ul className="space-y-4">
              {[
                "Business owners spending over $5,000/month on customer support",
                "Operations managers looking to scale without hiring in-house",
                "Companies needing 24/7 coverage without the overhead",
                "Teams dealing with inconsistent service quality or high churn",
                "Founders ready to move from reactive to proactive support",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">30-Minute Session</h3>
            <p className="text-slate-400 text-sm">Focused consultation — no fluff, no pressure. We respect your time.</p>
          </div>
          <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Completely Free</h3>
            <p className="text-slate-400 text-sm">No obligation. Walk away with a clear picture of your options.</p>
          </div>
          <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Senior Consultant</h3>
            <p className="text-slate-400 text-sm">You'll speak directly with an experienced VictorySync strategist — not a junior rep.</p>
          </div>
        </div>

        <div className="bg-ink-800 border border-ink-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Prefer Not to Schedule Online?</h2>
          <p className="text-slate-300 mb-6">
            Reach our team directly — we're available Monday to Friday, 9 AM – 6 PM ET.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+201070394707"
              className="inline-flex items-center gap-2 border border-ink-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              +20 107 039 4707
            </a>
            <a
              href="mailto:info@victorysync.com"
              className="inline-flex items-center gap-2 border border-ink-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@victorysync.com
            </a>
            <Link href="/contact">
              <span className="inline-flex items-center gap-2 border border-ink-600 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                Contact Form
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCall;
