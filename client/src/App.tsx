
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
        <Router>
          <ScrollToTop />
          <div className="min-h-screen">
            <Routes>
              <Route 
                path="/" 
                element={
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <PageTransition>
                    <ServicesPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/pricing" 
                element={
                  <PageTransition>
                    <PricingPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PageTransition>
                    <AboutPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PageTransition>
                    <ContactPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PageTransition>
                    <RegisterPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PageTransition>
                    <DashboardPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/customer-dashboard" 
                element={
                  <PageTransition>
                    <CustomerDashboard />
                  </PageTransition>
                } 
              />
              <Route 
                path="/admin-portal" 
                element={
                  <PageTransition>
                    <AdminPortal />
                  </PageTransition>
                } 
              />
              <Route 
                path="/privacy-policy" 
                element={
                  <PageTransition>
                    <PrivacyPolicy />
                  </PageTransition>
                } 
              />
              <Route 
                path="/terms" 
                element={
                  <PageTransition>
                    <TermsPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/help-center" 
                element={
                  <PageTransition>
                    <HelpCenter />
                  </PageTransition>
                } 
              />
              <Route 
                path="/blog" 
                element={
                  <PageTransition>
                    <BlogPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/careers" 
                element={
                  <PageTransition>
                    <CareersPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/docs" 
                element={
                  <PageTransition>
                    <DocsPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <PageTransition>
                    <CheckoutPage />
                  </PageTransition>
                } 
              />
              <Route 
                path="*" 
                element={
                  <PageTransition>
                    <NotFoundPage />
                  </PageTransition>
                } 
              />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
