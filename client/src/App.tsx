import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./contexts/CartContext";
import { useState, lazy, Suspense, memo, useEffect } from "react";

// Layout Components
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import CartModal from "./components/cart-modal";
import ScrollToTop from "./components/ScrollToTop";

// Core Pages (loaded immediately)
import Home from "./pages/home";
import Services from "./pages/services";
import Pricing from "./pages/pricing";

// Lazy load less critical pages
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const Checkout = lazy(() => import("./pages/checkout"));
const CustomerDashboard = lazy(() => import("./pages/customer-dashboard"));
const Register = lazy(() => import("./pages/register"));
const Login = lazy(() => import("./pages/login"));
const NotFound = lazy(() => import("./pages/not-found"));

// Footer Pages (lazy loaded)
const AboutUs = lazy(() => import("./pages/about-us"));
const Careers = lazy(() => import("./pages/careers"));
const Blog = lazy(() => import("./pages/blog"));
const HelpCenter = lazy(() => import("./pages/help-center"));
const Documentation = lazy(() => import("./pages/docs"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsOfService = lazy(() => import("./pages/terms"));

// Import Google Fonts
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

import { ErrorBoundary } from 'react-error-boundary'

const Router = memo(function Router() {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation onCartClick={openCartModal} />

      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/services" component={Services} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/dashboard" component={CustomerDashboard} />
            <Route path="/customer-dashboard" component={CustomerDashboard} />
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
        </Suspense>
      </main>

      <Footer />

      <CartModal 
        isOpen={cartModalOpen} 
        onClose={closeCartModal} 
      />
    </div>
  );
});

function App() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Only prevent default for known API errors to avoid hiding other issues
      if (event.reason && typeof event.reason === 'object' && event.reason.message) {
        if (event.reason.message.includes('fetch') || event.reason.message.includes('401')) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary 
            fallback={
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                  <p className="text-gray-600 mb-6">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            }
            onError={(error, errorInfo) => {
              console.error('ErrorBoundary caught an error:', error, errorInfo);
            }}
          >
            <Router />
          </ErrorBoundary>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;