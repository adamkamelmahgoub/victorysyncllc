import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Link } from 'wouter';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-ink-800 border border-ink-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-ink-700">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Shopping Cart</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">Your cart is empty</p>
              <Button onClick={onClose} variant="outline" className="border-ink-600 text-slate-300 hover:bg-ink-700">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.packageId} className="flex items-center justify-between p-4 border border-ink-700 rounded-lg bg-ink-900">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name} Plan</h4>
                      <p className="text-slate-400">${item.price.toLocaleString()}/month</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.packageId, item.quantity - 1)}
                        className="w-8 h-8 bg-ink-700 rounded-full flex items-center justify-center hover:bg-ink-600 transition-colors text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.packageId, item.quantity + 1)}
                        className="w-8 h-8 bg-ink-700 rounded-full flex items-center justify-center hover:bg-ink-600 transition-colors text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.packageId)}
                        className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-ink-700 pt-6">
                <div className="flex justify-between items-center text-xl font-bold mb-6">
                  <span className="text-white">Total:</span>
                  <span className="text-cyan-400">${total.toLocaleString()}/month</span>
                </div>
                
                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button 
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-ink-900 font-semibold"
                      onClick={onClose}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full border-ink-600 text-slate-300 hover:bg-ink-700" 
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
