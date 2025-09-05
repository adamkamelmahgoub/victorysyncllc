
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { ReactNode, useMemo } from "react";

export default function RootProviders({ children }: { children: ReactNode }) {
  // new client per app boot; memo to avoid re-creation on re-renders
  const qc = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
