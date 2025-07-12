import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { useState, Suspense, lazy } from "react";

// Layout Components
import { SiteLayout } from "@/layouts/SiteLayout";
import CartModal from "@/components/cart-modal";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import Home from "@/pages/home";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Checkout from "@/pages/checkout";
import CustomerDashboard from "@/pages/customer-dashboard";
import Dashboard from "@/pages/dashboard";
import AdminPortal from "@/pages/admin-portal";
import Register from "@/pages/register";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

// Footer Pages
import AboutUs from "@/pages/about-us";
import Careers from "@/pages/careers";
import Blog from "@/pages/blog";
import HelpCenter from "@/pages/help-center";
import Documentation from "@/pages/docs";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms";

// Lazy load admin components
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const IntegrationsSettings = lazy(() => import('./pages/dashboard/Settings/Integrations'));

// Import Google Fonts
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

function Router() {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      <Switch>
        {/* Admin routes without main layout */}
        <Route path="/admin/login">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AdminLogin />
          </Suspense>
        </Route>
        
        <Route path="/admin*" component={AdminPortal} />
        
        {/* Dashboard routes without cart */}
        <Route path="/dashboard*">
          <SiteLayout showCart={false}>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/dashboard/settings/integrations">
                <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                  <IntegrationsSettings />
                </Suspense>
              </Route>
            </Switch>
          </SiteLayout>
        </Route>

        {/* Main site routes with cart */}
        <Route>
          <SiteLayout onCartClick={openCartModal}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/services" component={Services} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/register" component={Register} />
              <Route path="/signup" component={Register} />
              <Route path="/login" component={Login} />

              {/* Footer Pages */}
              <Route path="/about-us" component={AboutUs} />
              <Route path="/careers" component={Careers} />
              <Route path="/blog" component={Blog} />
              <Route path="/help-center" component={HelpCenter} />
              <Route path="/docs" component={Documentation} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms" component={TermsOfService} />

              <Route component={NotFound} />
            </Switch>
          </SiteLayout>
        </Route>
      </Switch>

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