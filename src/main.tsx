
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../client/src/index.css";

// ROUTES / PAGES - using actual file paths from your structure
import App from "./routes/App";
import Home from "../client/src/pages/home";
import Solutions from "../client/src/pages/solutions";
import Platform from "../client/src/pages/Platform";
import Industries from "../client/src/pages/Industries";
import Pricing from "../client/src/pages/pricing";
import RoiCenter from "../client/src/pages/RoiCenter";
import Resources from "../client/src/pages/Resources";
import About from "../client/src/pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import CustomerDashboard from "./pages/customer-dashboard";
import ResourceDetail from "./pages/ResourceDetail";

// PROVIDERS
import { CartProvider } from "./contexts/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

// GUARD
import PrivateRoute from "./ui/PrivateRoute";

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
      { path: "resources/:slug", element: <ResourceDetail /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      {
        path: "customer-dashboard",
        element: (
          <PrivateRoute>
            <CustomerDashboard />
          </PrivateRoute>
        )
      },
      { path: "*", element: <div className="p-8 text-center">404 — Not found</div> }
    ]
  }
]);

const qc = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<div className="p-6">Loading…</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
