import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";
import { PublicPage, PricingPage, HowItWorksPage, FaqPage, ReviewsPage } from '@/pages/public-page';

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

// Layout Components
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CmsRuntime from "@/components/cms-runtime";
import CookieConsent from "@/components/cookie-consent";

// Pages
const Home = lazy(() => import("@/pages/home"));
const Contact = lazy(() => import("@/pages/contact"));
import CustomerDashboard from "@/pages/customer-dashboard";
const BookCall = lazy(() => import("@/pages/book-call"));
const NotFound = lazy(() => import("@/pages/not-found"));
const CmsPage = lazy(() => import("@/pages/cms"));

// Service Pages

// Footer Pages
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms"));

import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

function Router() {
  const [location] = useLocation();
  const isMarketingRoute = location !== '/dashboard';

  if (location === "/cms") return <Suspense fallback={null}><CmsPage /></Suspense>;

  return (
    <div className={`${isMarketingRoute ? 'marketing-site' : ''} min-h-screen flex flex-col bg-white text-slate-900`}>
      <ScrollToTop />
      <Navigation />

      <main className="flex-1">
        <Suspense fallback={null}><AnimatePresence mode="wait">
          <Switch key={location}>
            <Route path="/" component={Home} />
            <Route path="/services"><PublicPage path="/services" /></Route>
            <Route path="/pricing" component={PricingPage} />
            <Route path="/about"><PublicPage path="/about-us" /></Route>
            <Route path="/how-it-works" component={HowItWorksPage} />
            <Route path="/faq"><FaqPage /></Route>
            <Route path="/contact" component={Contact} />
            <Route path="/book-call" component={BookCall} />
            <Route path="/dashboard" component={CustomerDashboard} />
            <Route path="/platform"><PublicPage path="/platform" /></Route>

            {/* Service Pages */}
            <Route path="/inbound-support"><PublicPage path="/inbound-support" /></Route>
            <Route path="/appointment-setting"><PublicPage path="/appointment-setting" /></Route>
            <Route path="/cold-calling"><PublicPage path="/cold-calling" /></Route>
            <Route path="/live-transfers"><PublicPage path="/live-transfers" /></Route>
            <Route path="/sales-closers"><PublicPage path="/sales-closers" /></Route>
            <Route path="/ai-automation"><PublicPage path="/ai-automation" /></Route>
            <Route path="/digital-marketing"><PublicPage path="/digital-marketing" /></Route>
            <Route path="/appointment-setting-for-home-services"><PublicPage path="/appointment-setting-for-home-services" /></Route>
            <Route path="/cold-calling-for-plumbers"><PublicPage path="/cold-calling-for-plumbers" /></Route>
            <Route path="/answering-service-for-plumbers"><PublicPage path="/answering-service-for-plumbers" /></Route>
            <Route path="/appointment-setting-for-hvac"><PublicPage path="/appointment-setting-for-hvac" /></Route>
            <Route path="/appointment-setting-for-real-estate"><PublicPage path="/appointment-setting-for-real-estate" /></Route>
            <Route path="/inbound-support-for-law-firms"><PublicPage path="/inbound-support-for-law-firms" /></Route>

            {/* Footer Pages */}
            <Route path="/about-us"><PublicPage path="/about-us" /></Route>
            <Route path="/help-center"><FaqPage path="/help-center" /></Route>
            <Route path="/reviews" component={ReviewsPage} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence></Suspense>
        <div id="cms-blocks" />
      </main>

      <Footer />
      {isMarketingRoute && <CookieConsent />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CmsRuntime />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
