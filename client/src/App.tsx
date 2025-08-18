
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/ui/layout';

// Lazy load pages
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about-us'));
const Services = lazy(() => import('./pages/services'));
const Pricing = lazy(() => import('./pages/pricing'));
const Contact = lazy(() => import('./pages/contact'));
const Blog = lazy(() => import('./pages/blog'));
const Careers = lazy(() => import('./pages/careers'));
const HelpCenter = lazy(() => import('./pages/help-center'));
const Terms = lazy(() => import('./pages/terms'));
const PrivacyPolicy = lazy(() => import('./pages/privacy-policy'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminForgotPassword = lazy(() => import('./pages/admin/AdminForgotPassword'));
const AdminResetPassword = lazy(() => import('./pages/admin/AdminResetPassword'));
const CustomerDashboard = lazy(() => import('./pages/customer-dashboard'));
const AdminPortal = lazy(() => import('./pages/admin-portal'));
const Checkout = lazy(() => import('./pages/checkout'));
const NotFound = lazy(() => import('./pages/not-found'));

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/help" element={<Layout><HelpCenter /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin auth routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </CartProvider>
  );
}
