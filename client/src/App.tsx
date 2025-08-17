import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { useState } from "react";

// Layout Components
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CartModal from "@/components/cart-modal";

// Pages
import Home from "@/pages/home";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Checkout from "@/pages/checkout";
import CustomerDashboard from "@/pages/customer-dashboard";
import Register from "@/pages/register";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import AdminPortal from "@/pages/admin-portal";

// Footer Pages
import AboutUs from "@/pages/about-us";
import Careers from "@/pages/careers";
import Blog from "@/pages/blog";
import HelpCenter from "@/pages/help-center";
import Documentation from "@/pages/docs";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms";

// Placeholder for Admin and Customer Apps (assuming these components exist)
const AdminApp = () => <div>Admin App Placeholder</div>;
const CustomerApp = () => <div>Customer App Placeholder</div>;


// Import Google Fonts
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

function Router() {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  // Placeholder for itemCount and isCartOpen, assuming they are managed elsewhere or will be defined
  const itemCount = 0; // Example value
  const isCartOpen = false; // Example value

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <Switch>
          {/* Admin and Customer Apps (no public nav/footer) */}
          <Route path="/admin/:rest*">
            {() => <AdminApp />}
          </Route>
          <Route path="/app/:rest*">
            {() => <CustomerApp />}
          </Route>

          {/* Public routes with nav/footer */}
          <Route>
            {() => (
              <>
                <Navigation onCartClick={openCartModal} />
                <main className="flex-1">
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/services" component={Services} />
                    <Route path="/pricing" component={Pricing} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/customer-dashboard" component={CustomerDashboard} />
                    <Route path="/dashboard" component={CustomerDashboard} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/signup" component={Register} />
                    {/* Footer Pages */}
                    <Route path="/about-us" component={AboutUs} />
                    <Route path="/careers" component={Careers} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/help-center" component={HelpCenter} />
                    <Route path="/docs" component={Documentation} />
                    <Route path="/privacy-policy" component={PrivacyPolicy} />
                    <Route path="/terms" component={TermsOfService} />
                    {/* Admin Portal Route */}
                    <Route path="/admin-portal" component={AdminPortal} />
                    <Route component={NotFound} />
                  </Switch>
                </main>
                <Footer />
              </>
            )}
          </Route>
        </Switch>
      </div>
      <Toaster />
      <CartModal isOpen={cartModalOpen} onClose={closeCartModal} />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;