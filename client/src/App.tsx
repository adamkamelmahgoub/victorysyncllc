
import React from 'react';
import { Router, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { AuthProvider } from '@/hooks/useAuth';

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
import TermsPage from '@/pages/terms';
import PrivacyPolicyPage from '@/pages/privacy-policy';
import HelpCenterPage from '@/pages/help-center';
import CareersPage from '@/pages/careers';
import BlogPage from '@/pages/blog';
import DocsPage from '@/pages/docs';
import RegisterWithCodePage from '@/pages/register-with-code';

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                <Route path="/" component={HomePage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/services" component={ServicesPage} />
                <Route path="/pricing" component={PricingPage} />
                <Route path="/contact" component={ContactPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/register-with-code" component={RegisterWithCodePage} />
                <Route path="/dashboard" component={CustomerDashboard} />
                <Route path="/admin" component={AdminPortal} />
                <Route path="/checkout" component={CheckoutPage} />
                <Route path="/terms" component={TermsPage} />
                <Route path="/privacy" component={PrivacyPolicyPage} />
                <Route path="/help" component={HelpCenterPage} />
                <Route path="/careers" component={CareersPage} />
                <Route path="/blog" component={BlogPage} />
                <Route path="/docs" component={DocsPage} />
                <Route path="/__health" component={() => <div style={{padding:24}}>UI Health Check OK</div>} />
                <Route>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                </Route>
              </main>
              <Footer />
            </div>
          </Router>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
