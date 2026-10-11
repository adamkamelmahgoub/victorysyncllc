import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function MarketingEffects({ enabled, location }: { enabled: boolean; location: string }) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 640px)').matches) return;
    let active = true;
    let frame = 0;
    let instance: { raf: (time: number) => void; destroy: () => void } | undefined;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      if (!active) return;
      instance = new Lenis({ duration: 1.05 });
      const loop = (time: number) => { instance?.raf(time); frame = requestAnimationFrame(loop); };
      frame = requestAnimationFrame(loop);
    });
    return () => { active = false; cancelAnimationFrame(frame); instance?.destroy(); };
  }, [enabled]);
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observed = new Set<Element>();
    const reveal = (element: Element) => element.classList.add("is-visible");
    const observer = reducedMotion ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer?.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    const scan = () => {
      document.querySelectorAll(".marketing-site main section").forEach((section, index) => {
        if (observed.has(section)) return;
        observed.add(section);
        section.classList.add("reveal-section");
        (section as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(index, 3) * 45}ms`);
        if (reducedMotion) reveal(section);
        else observer?.observe(section);
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    const main = document.querySelector(".marketing-site main");
    if (main) mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, location]);

  return null;
}

// Layout Components
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CartModal from "@/components/cart-modal";
import CmsRuntime from "@/components/cms-runtime";
import CookieConsent from "@/components/cookie-consent";

// Pages
const Home = lazy(() => import("@/pages/home"));
const Services = lazy(() => import("@/pages/services"));
const Pricing = lazy(() => import("@/pages/pricing"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Checkout = lazy(() => import("@/pages/checkout"));
import Register from "@/pages/register";
import Login from "@/pages/login";
import CustomerDashboard from "@/pages/customer-dashboard";
const Platform = lazy(() => import("@/pages/platform"));
const BookCall = lazy(() => import("@/pages/book-call"));
const NotFound = lazy(() => import("@/pages/not-found"));
const CmsPage = lazy(() => import("@/pages/cms"));

// Service Pages
const InboundSupport = lazy(() => import("@/pages/inbound-support"));
const AppointmentSetting = lazy(() => import("@/pages/appointment-setting"));
const ColdCalling = lazy(() => import("@/pages/cold-calling"));
const AiAutomation = lazy(() => import("@/pages/ai-automation"));
const DigitalMarketing = lazy(() => import("@/pages/digital-marketing"));
const VerticalService = lazy(() => import("@/pages/vertical-services"));

// Footer Pages
const AboutUs = lazy(() => import("@/pages/about-us"));
const HelpCenter = lazy(() => import("@/pages/help-center"));
const Reviews = lazy(() => import("@/pages/reviews"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms"));

import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

function Router() {
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [location] = useLocation();
  const isMarketingRoute = !['/login', '/register', '/signup', '/dashboard', '/checkout'].includes(location);

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  if (location === "/cms") return <Suspense fallback={null}><CmsPage /></Suspense>;

  return (
    <div className={`${isMarketingRoute ? 'marketing-site' : ''} min-h-screen flex flex-col bg-white text-slate-900`}>
      <ScrollToTop />
      <MarketingEffects enabled={isMarketingRoute} location={location} />
      <Navigation />

      <main className="flex-1">
        <Suspense fallback={null}><AnimatePresence mode="wait">
          <Switch key={location}>
            <Route path="/" component={Home} />
            <Route path="/services" component={Services} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/book-call" component={BookCall} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/register" component={Register} />
            <Route path="/signup" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={CustomerDashboard} />
            <Route path="/platform" component={Platform} />

            {/* Service Pages */}
            <Route path="/inbound-support" component={InboundSupport} />
            <Route path="/appointment-setting" component={AppointmentSetting} />
            <Route path="/cold-calling" component={ColdCalling} />
            <Route path="/ai-automation" component={AiAutomation} />
            <Route path="/digital-marketing" component={DigitalMarketing} />
            <Route path="/appointment-setting-for-home-services"><VerticalService path="/appointment-setting-for-home-services" /></Route>
            <Route path="/cold-calling-for-plumbers"><VerticalService path="/cold-calling-for-plumbers" /></Route>
            <Route path="/answering-service-for-plumbers"><VerticalService path="/answering-service-for-plumbers" /></Route>
            <Route path="/appointment-setting-for-hvac"><VerticalService path="/appointment-setting-for-hvac" /></Route>
            <Route path="/appointment-setting-for-real-estate"><VerticalService path="/appointment-setting-for-real-estate" /></Route>
            <Route path="/inbound-support-for-law-firms"><VerticalService path="/inbound-support-for-law-firms" /></Route>

            {/* Footer Pages */}
            <Route path="/about-us" component={AboutUs} />
            <Route path="/help-center" component={HelpCenter} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence></Suspense>
        <div id="cms-blocks" />
      </main>

      <Footer />
      {isMarketingRoute && <CookieConsent />}

      <CartModal 
        isOpen={cartModalOpen} 
        onClose={closeCartModal} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CmsRuntime />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
