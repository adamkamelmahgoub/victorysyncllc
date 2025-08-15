
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] p-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
