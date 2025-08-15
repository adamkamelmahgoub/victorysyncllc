
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from "./router";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRouter />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>
);
