import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "wouter";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "./components/error-boundary";
import Navigation from "./components/navigation";
import Footer from "./components/footer";

function App() {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                <Route path="/admin" component={AdminPortal} />
                <Route path="/customer" component={CustomerPortal} />
                <Route path="/cart">
                  {({ cartItems }) => <CartPage cartItems={cartItems} />}
                </Route>
                <Route path="/checkout">
                  {({ cartItems }) => <CheckoutPage cartItems={cartItems} />}
                </Route>
                <Route path="/products/:id">
                  {({ id }) => <ProductDetailPage productId={id} />}
                </Route>
                <Route path="/products">
                  {() => <ProductListPage />}
                </Route>
                <Route path="/">{() => <HomePage />}</Route>
              </main>
              <Footer />
            </div>
          </Router>
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

// Mock components (replace with actual imports as you build them)
const AdminPortal = () => <div>Admin Portal</div>;
const CustomerPortal = () => <div>Customer Portal</div>;
const CartPage = ({ cartItems }) => <div>Cart Page</div>;
const CheckoutPage = ({ cartItems }) => <div>Checkout Page</div>;
const ProductDetailPage = ({ productId }) => (
  <div>Product Detail Page for {productId}</div>
);
const ProductListPage = () => <div>Product List Page</div>;
const HomePage = () => <div>Home Page</div>;