import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';

// Lazy load components
const Home = React.lazy(() => import('./pages/home'));
const Services = React.lazy(() => import('./pages/services'));
const Pricing = React.lazy(() => import('./pages/pricing'));
const About = React.lazy(() => import('./pages/about'));
const Contact = React.lazy(() => import('./pages/contact'));
const Blog = React.lazy(() => import('./pages/blog'));
const Careers = React.lazy(() => import('./pages/careers'));
const HelpCenter = React.lazy(() => import('./pages/help-center'));
const PrivacyPolicy = React.lazy(() => import('./pages/privacy-policy'));
const Terms = React.lazy(() => import('./pages/terms'));
const Login = React.lazy(() => import('./pages/login'));
const Register = React.lazy(() => import('./pages/register'));
const CustomerDashboard = React.lazy(() => import('./pages/customer-dashboard'));
const AdminPortal = React.lazy(() => import('./pages/admin-portal'));
const Checkout = React.lazy(() => import('./pages/checkout'));
const NotFound = React.lazy(() => import('./pages/not-found'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));

export default function App() {
  return (
    <CartProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword variant="customer" />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin auth routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword variant="admin" />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />

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