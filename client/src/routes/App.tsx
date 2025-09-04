
import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTop from "../ui/ScrollToTop";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation />
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
