
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "wouter";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import { AuthProvider } from "./hooks/useAuth";

// Import actual pages
import AdminPortal from "./pages/admin-portal";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ContactPage from "./pages/contact";
import PricingPage from "./pages/pricing";
import AboutPage from "./pages/about-us";
import ServicesPage from "./pages/services";
import DocsPage from "./pages/docs";
import BlogPage from "./pages/blog";
import CareersPage from "./pages/careers";
import HelpCenterPage from "./pages/help-center";
import PrivacyPolicyPage from "./pages/privacy-policy";
import TermsPage from "./pages/terms";
import CheckoutPage from "./pages/checkout";
import RegisterWithCodePage from "./pages/register-with-code";
import CustomerDashboard from "./pages/customer-dashboard";

function App() {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  <Route path="/admin" component={AdminPortal} />
                  <Route path="/customer" component={CustomerDashboard} />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/register" component={RegisterPage} />
                  <Route path="/register-with-code" component={RegisterWithCodePage} />
                  <Route path="/contact" component={ContactPage} />
                  <Route path="/pricing" component={PricingPage} />
                  <Route path="/about" component={AboutPage} />
                  <Route path="/services" component={ServicesPage} />
                  <Route path="/docs" component={DocsPage} />
                  <Route path="/blog" component={BlogPage} />
                  <Route path="/careers" component={CareersPage} />
                  <Route path="/help" component={HelpCenterPage} />
                  <Route path="/privacy" component={PrivacyPolicyPage} />
                  <Route path="/terms" component={TermsPage} />
                  <Route path="/checkout" component={CheckoutPage} />
                  <Route path="/__health" component={() => <div style={{padding:24}}>UI OK</div>} />
                  <Route path="/" component={HomePage} />
                  <Route path="*" component={() => <div style={{padding:24}}>Page not found</div>} />
                </main>
                <Footer />
              </div>
            </Router>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
