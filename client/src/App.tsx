
import React, { useEffect } from 'react';
import { Router, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/home';
import ServicesPage from './pages/services';
import PricingPage from './pages/pricing';
import AboutPage from './pages/about-us';
import ContactPage from './pages/contact';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import CustomerDashboard from './pages/customer-dashboard';
import AdminPortal from './pages/admin-portal';
import PrivacyPolicy from './pages/privacy-policy';
import TermsPage from './pages/terms';
import HelpCenter from './pages/help-center';
import BlogPage from './pages/blog';
import CareersPage from './pages/careers';
import DocsPage from './pages/docs';
import CheckoutPage from './pages/checkout';
import NotFoundPage from './pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle scroll reset on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Component to handle page transitions
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div>
          <ScrollToTop />
          <div className="min-h-screen">
            <Router>
              <Route path="/">
                <PageTransition>
                  <HomePage />
                </PageTransition>
              </Route>
              <Route path="/services">
                <PageTransition>
                  <ServicesPage />
                </PageTransition>
              </Route>
              <Route path="/pricing">
                <PageTransition>
                  <PricingPage />
                </PageTransition>
              </Route>
              <Route path="/about">
                <PageTransition>
                  <AboutPage />
                </PageTransition>
              </Route>
              <Route path="/contact">
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              </Route>
              <Route path="/login">
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              </Route>
              <Route path="/register">
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              </Route>
              <Route path="/dashboard">
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </Route>
              <Route path="/customer-dashboard">
                <PageTransition>
                  <CustomerDashboard />
                </PageTransition>
              </Route>
              <Route path="/admin-portal">
                <PageTransition>
                  <AdminPortal />
                </PageTransition>
              </Route>
              <Route path="/privacy-policy">
                <PageTransition>
                  <PrivacyPolicy />
                </PageTransition>
              </Route>
              <Route path="/terms">
                <PageTransition>
                  <TermsPage />
                </PageTransition>
              </Route>
              <Route path="/help-center">
                <PageTransition>
                  <HelpCenter />
                </PageTransition>
              </Route>
              <Route path="/blog">
                <PageTransition>
                  <BlogPage />
                </PageTransition>
              </Route>
              <Route path="/careers">
                <PageTransition>
                  <CareersPage />
                </PageTransition>
              </Route>
              <Route path="/docs">
                <PageTransition>
                  <DocsPage />
                </PageTransition>
              </Route>
              <Route path="/checkout">
                <PageTransition>
                  <CheckoutPage />
                </PageTransition>
              </Route>
              <Route>
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              </Route>
            </Router>
          </div>
          <Toaster />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
