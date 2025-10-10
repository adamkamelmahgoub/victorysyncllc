import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import Company from "./pages/Company";
import Services from "./pages/Services";
import Book from "./pages/Book";
import CollabCRM from "./pages/services/CollabCRM";
import Omnichannel from "./pages/services/Omnichannel";
import Automation from "./pages/services/Automation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/products" element={<Products />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/company" element={<Company />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/collaboration" element={<CollabCRM />} />
      <Route path="/services/omnichannel" element={<Omnichannel />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/book" element={<Book />} />
    </Routes>
  );
}
