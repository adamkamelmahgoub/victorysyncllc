
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import AboutUs from "@/pages/about-us";
import Services from "@/pages/services";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RegisterWithCode from "@/pages/register-with-code";
import CustomerDashboard from "@/pages/customer-dashboard";
import AdminPortal from "@/pages/admin-portal";
import Checkout from "@/pages/checkout";
import Blog from "@/pages/blog";
import HelpCenter from "@/pages/help-center";
import Careers from "@/pages/careers";
import Docs from "@/pages/docs";
import PrivacyPolicy from "@/pages/privacy-policy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="services" element={<Services />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register-with-code" element={<RegisterWithCode />} />
        <Route path="customer-dashboard" element={<CustomerDashboard />} />
        <Route path="admin-portal" element={<AdminPortal />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="blog" element={<Blog />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="careers" element={<Careers />} />
        <Route path="docs" element={<Docs />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
