
import { Outlet } from "react-router-dom";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
