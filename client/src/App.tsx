
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Navigation from './components/navigation';
import Footer from './components/footer';

// Pages
import Home from './pages/home';
import About from './pages/about';
import Services from './pages/services';
import Pricing from './pages/pricing';
import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import CustomerDashboard from './pages/customer-dashboard';
import AdminPortal from './pages/admin-portal';
import Checkout from './pages/checkout';
import NotFound from './pages/not-found';
import Blog from './pages/blog';
import Careers from './pages/careers';
import HelpCenter from './pages/help-center';
import Docs from './pages/docs';
import TermsOfService from './pages/terms';
import PrivacyPolicy from './pages/privacy-policy';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
