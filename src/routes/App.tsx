
import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
