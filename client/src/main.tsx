
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./routes/App";
import Home from "./pages/home";
import Solutions from "./pages/solutions";
import Platform from "./pages/Platform";
import Industries from "./pages/Industries";
import Pricing from "./pages/pricing";
import RoiCenter from "./pages/RoiCenter";
import Resources from "./pages/Resources";
import About from "./pages/about";
import Contact from "./pages/contact";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "solutions", element: <Solutions /> },
      { path: "platform", element: <Platform /> },
      { path: "industries", element: <Industries /> },
      { path: "pricing", element: <Pricing /> },
      { path: "roi", element: <RoiCenter /> },
      { path: "resources", element: <Resources /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
