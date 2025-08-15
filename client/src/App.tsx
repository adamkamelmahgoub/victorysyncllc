import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import About from './pages/about';
import Services from './pages/services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/login';
import Register from './pages/register';
import CustomerDashboard from './pages/customer-dashboard';
import AdminPortal from './pages/admin-portal';
import Checkout from './pages/checkout';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';
import { ErrorBoundary } from './components/error-boundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <RootLayout>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/services" component={Services} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/contact" component={Contact} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/dashboard" component={CustomerDashboard} />
                <Route path="/admin" component={AdminPortal} />
                <Route path="/checkout" component={Checkout} />
                <Route component={NotFound} />
              </Switch>
            </RootLayout>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;