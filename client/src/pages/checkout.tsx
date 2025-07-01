import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, CreditCard, Check } from 'lucide-react';
import { Link } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create order record
        await apiRequest('POST', '/api/orders', {
          items: items.map(item => ({
            packageId: item.packageId,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
        });

        clearCart();
        
        toast({
          title: "Payment Successful!",
          description: "Thank you for your purchase! You can now access your services in the dashboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || processing}
        className="w-full bg-victory-purple hover:bg-purple-700 text-white py-3"
      >
        {processing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Complete Payment - ${total.toLocaleString()}</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { items, total } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Create payment intent
  useEffect(() => {
    if (items.length === 0 || !isAuthenticated) {
      setLoadingPayment(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          items: items.map(item => ({
            packageId: item.packageId,
            quantity: item.quantity,
          })),
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          title: "Payment Setup Failed",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingPayment(false);
      }
    };

    createPaymentIntent();
  }, [items, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold victory-dark mb-4">Your Cart is Empty</h2>
            <p className="victory-gray mb-6">Add some services to your cart before checking out.</p>
            <Link href="/pricing">
              <Button className="bg-victory-purple hover:bg-purple-700 text-white">
                View Pricing Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="victory-gray">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold victory-dark mb-4">Payment System Setup Required</h2>
            <p className="victory-gray mb-6">
              Payment processing is being configured. Please contact our sales team to complete your order.
            </p>
            <div className="space-y-3">
              <Link href="/contact">
                <Button className="w-full bg-victory-purple hover:bg-purple-700 text-white">
                  Contact Sales Team
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="w-full">
                  Back to Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold victory-dark mb-4">Payment Setup Error</h2>
            <p className="victory-gray mb-6">Unable to initialize payment. Please try again.</p>
            <Link href="/pricing">
              <Button variant="outline">
                Back to Pricing
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold victory-dark mb-2">Secure Checkout</h1>
          <p className="victory-gray">Complete your order to get started with VictorySync</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.packageId} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
                  <div>
                    <h4 className="font-semibold victory-dark">{item.name} Plan</h4>
                    <p className="text-sm victory-gray">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold victory-dark">
                      ${(item.price * item.quantity).toLocaleString()}/month
                    </p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="victory-purple">${total.toLocaleString()}/month</span>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">What's included:</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 24/7 customer support</li>
                  <li>• Dedicated account manager</li>
                  <li>• No setup fees</li>
                  <li>• Cancel anytime</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 victory-purple" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm victory-gray">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Your payment is secured by 256-bit SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
