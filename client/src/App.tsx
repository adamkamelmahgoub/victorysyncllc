
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";

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

// Footer Pages
import AboutUs from "@/pages/about-us";
import Careers from "@/pages/careers";
import Blog from "@/pages/blog";
import HelpCenter from "@/pages/help-center";
import Documentation from "@/pages/docs";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms";

// Lazy-load Admin app so public bundle stays lean
const AdminApp = lazy(() => import("@/admin/App"));

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartModal />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/customer-dashboard" element={<PublicLayout><CustomerDashboard /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

        {/* Footer Pages */}
        <Route path="/about-us" element={<PublicLayout><AboutUs /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/help-center" element={<PublicLayout><HelpCenter /></PublicLayout>} />
        <Route path="/docs" element={<PublicLayout><Documentation /></PublicLayout>} />
        <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
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
