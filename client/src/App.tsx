
import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// Adjust these import paths if our components live elsewhere:
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import CartModal from "./components/cart-modal";
import { CartProvider } from "./contexts/CartContext";

// Helper: scroll to top on route change
function ScrollToTop() {
  React.useEffect(() => {
    const onHashChange = () => window.scrollTo({ top: 0, behavior: "instant" as any });
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return null;
}

// Lazily import pages. IMPORTANT: If a path doesn't exist in the repo,
// create a minimal page in client/src/pages/<name>.tsx that exports default component.
// Prefer existing files; only create stubs if missing.
const Home = lazy(() => import("./pages/home"));            // or "./pages/Home"
const About = lazy(() => import("./pages/about"));          // or "./pages/About"
const Services = lazy(() => import("./pages/services"));    // or "./pages/Services"
const Contact = lazy(() => import("./pages/contact"));      // or "./pages/Contact"
const Pricing = lazy(() => import("./pages/pricing"));      // or "./pages/Pricing"
const SignIn = lazy(() => import("./pages/login"));         // or "./pages/SignIn" / "./pages/Login"
const Register = lazy(() => import("./pages/register"));    // or "./pages/Register"
const Dashboard = lazy(() => import("./pages/customer-dashboard")); // optional

function PageFallback() {
  return (
    <div style={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
      <div>Loading…</div>
    </div>
  );
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ErrorBoundary>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navigation onCartClick={() => setIsCartOpen(true)} />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              {/* OPTIONAL: only enable if the page exists */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Legacy/unknown paths -> home (adjust if we have a NotFound page) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Footer />
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </BrowserRouter>
      </CartProvider>
    </ErrorBoundary>
  );
}
