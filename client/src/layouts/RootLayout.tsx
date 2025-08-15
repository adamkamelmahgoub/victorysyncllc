
import { Outlet } from "react-router-dom";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
