import { Router, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import CartModal from '@/components/cart-modal';
import { CartProvider } from '@/contexts/CartContext';
import { useState } from 'react';

// Pages
import Home from '@/pages/home';
import Services from '@/pages/services';
import Pricing from '@/pages/pricing';
import About from '@/pages/about';
import AboutUs from '@/pages/about-us';
import Contact from '@/pages/contact';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Checkout from '@/pages/checkout';
import CustomerDashboard from '@/pages/customer-dashboard';
import AdminPortal from '@/pages/admin-portal';
import Blog from '@/pages/blog';
import Careers from '@/pages/careers';
import Documentation from '@/pages/docs';
import HelpCenter from '@/pages/help-center';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsOfService from '@/pages/terms';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="min-h-screen bg-white">
          <Navigation onCartClick={() => setIsCartOpen(true)} />
          
          <Router>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/services" component={Services} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/about" component={About} />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/signup" component={Register} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/dashboard" component={CustomerDashboard} />
            <Route path="/admin" component={AdminPortal} />
            <Route path="/blog" component={Blog} />
            <Route path="/careers" component={Careers} />
            <Route path="/docs" component={Documentation} />
            <Route path="/help" component={HelpCenter} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            <Route component={NotFound} />
          </Router>

          <Footer />
          
          <CartModal 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
          />
          
          <Toaster />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
