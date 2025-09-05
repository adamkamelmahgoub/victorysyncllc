
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Solutions from "../pages/Solutions";
import Platform from "../pages/Platform";
import Industries from "../pages/Industries";
import Pricing from "../pages/Pricing";
import Resources from "../pages/Resources";
import About from "../pages/About";
import SignIn from "../pages/SignIn";
import Demo from "../pages/Demo";
import Calculator from "../pages/Calculator";
import Contact from "../pages/Contact";
import ScrollToTop from "../components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
