import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";

const Home = lazy(() => import("@/pages/home"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Contact = lazy(() => import("@/pages/contact"));
const About = lazy(() => import("@/pages/about"));
const Services = lazy(() => import("@/pages/services"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const CustomerDashboard = lazy(() => import("@/pages/customer-dashboard"));
const AdminPortal = lazy(() => import("@/pages/admin-portal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="admin" element={<AdminPortal />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}