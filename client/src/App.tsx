import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { ErrorBoundary } from '@/components/error-boundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/navigation';

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
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;