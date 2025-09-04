

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// pages (match your filenames exactly)
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
import Login from "./pages/login";
import CustomerDashboard from "./pages/customer-dashboard";
import ResourceDetail from "./pages/ResourceDetail";

// providers
import { CartProvider } from "./contexts/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

// route guard
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

