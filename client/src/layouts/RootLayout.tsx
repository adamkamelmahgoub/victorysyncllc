
import { Outlet } from "react-router-dom";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function RootLayout() {
  return (
    <>
      <Navigation />
      <main className="min-h-[calc(100vh-64px)]"><Outlet /></main>
      <Footer />
    </>
  );
}
