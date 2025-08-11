
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/navigation";
import Footer from "./components/footer";

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

// Lazily import pages
const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Services = lazy(() => import("./pages/services"));
const Contact = lazy(() => import("./pages/contact"));
const Pricing = lazy(() => import("./pages/pricing"));
const SignIn = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Dashboard = lazy(() => import("./pages/customer-dashboard"));

function PageFallback() {
  return (
    <div style={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
      <div>Loading…</div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Navigation />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
