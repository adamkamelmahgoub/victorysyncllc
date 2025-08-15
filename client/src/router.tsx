import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/home";
import PricingPage from "@/pages/pricing";
import ContactPage from "@/pages/contact";
import NotFound from "@/pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}