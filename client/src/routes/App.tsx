
import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import RootProviders from "../providers/RootProviders";

export default function App() {
  return (
    <RootProviders>
      {/* a11y: visually hidden until focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000]
                   bg-white text-slate-900 border border-slate-300 rounded-md px-3 py-2 shadow"
      >
        Skip to content
      </a>

      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </RootProviders>
  );
}
