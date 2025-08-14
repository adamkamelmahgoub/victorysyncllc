
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { ErrorBoundary } from '@/components/error-boundary';

// Pages
import HomePage from '@/pages/home';
import AboutPage from '@/pages/about';
import ServicesPage from '@/pages/services';
import PricingPage from '@/pages/pricing';
import ContactPage from '@/pages/contact';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import CustomerDashboard from '@/pages/customer-dashboard';
import AdminPortal from '@/pages/admin-portal';
import CheckoutPage from '@/pages/checkout';
import NotFoundPage from '@/pages/not-found';
import TermsPage from '@/pages/terms';
import PrivacyPolicyPage from '@/pages/privacy-policy';
import HelpCenterPage from '@/pages/help-center';
import CareersPage from '@/pages/careers';
import BlogPage from '@/pages/blog';
import DocsPage from '@/pages/docs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Router>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/services" component={ServicesPage} />
              <Route path="/pricing" component={PricingPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/dashboard" component={CustomerDashboard} />
              <Route path="/admin" component={AdminPortal} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/terms" component={TermsPage} />
              <Route path="/privacy" component={PrivacyPolicyPage} />
              <Route path="/help" component={HelpCenterPage} />
              <Route path="/careers" component={CareersPage} />
              <Route path="/blog" component={BlogPage} />
              <Route path="/docs" component={DocsPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
