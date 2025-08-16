
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";

const Home    = lazy(() => import("@/pages/index"));
const Services= lazy(() => import("@/pages/services"));
const Pricing = lazy(() => import("@/pages/pricing"));
const About   = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const SignIn  = lazy(() => import("@/pages/signin"));
const NotFound= lazy(() => import("@/pages/not-found"));

export default function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="pricing"  element={<Pricing />} />
          <Route path="about"    element={<About />} />
          <Route path="contact"  element={<Contact />} />
          <Route path="signin"   element={<SignIn />} />
          <Route path="404"      element={<NotFound />} />
          <Route path="*"        element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
