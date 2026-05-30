import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

// Layout Components
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CartModal from "@/components/cart-modal";

// Pages
import Home from "@/pages/home";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Checkout from "@/pages/checkout";
import Register from "@/pages/register";
import Login from "@/pages/login";
import CustomerDashboard from "@/pages/customer-dashboard";
import Platform from "@/pages/platform";
import BookCall from "@/pages/book-call";
import NotFound from "@/pages/not-found";

// Service Pages
import InboundSupport from "@/pages/inbound-support";
import AppointmentSetting from "@/pages/appointment-setting";
import ColdCalling from "@/pages/cold-calling";
import AiAutomation from "@/pages/ai-automation";

// Footer Pages
import AboutUs from "@/pages/about-us";
import Careers from "@/pages/careers";
import Blog from "@/pages/blog";
import HelpCenter from "@/pages/help-center";
import Documentation from "@/pages/docs";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms";

// Import Google Fonts
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

function Router() {
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [location] = useLocation();

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navigation />

      <main className="flex-1">
        <AnimatePresence mode="wait">
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

            {/* Footer Pages */}
            <Route path="/about-us" component={AboutUs} />
            <Route path="/careers" component={Careers} />
            <Route path="/blog/:slug" component={Blog} />
            <Route path="/blog" component={Blog} />
            <Route path="/help-center" component={HelpCenter} />
            <Route path="/docs" component={Documentation} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>

      <Footer />

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
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;