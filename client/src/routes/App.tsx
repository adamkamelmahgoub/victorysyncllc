
import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hidden until focused by keyboard */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] 
                   bg-white text-slate-900 border border-slate-300 rounded-md px-3 py-2 shadow"
      >
        Skip to content
      </a>

      <Navigation />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
