
import { createContext, useContext, useMemo, useState } from "react";

type CartItem = { sku: string; qty: number; title?: string };
type CartValue = {
  items: CartItem[];
  add: (sku: string, qty?: number, title?: string) => void;
  remove: (sku: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartValue>(() => ({
    items,
    add(sku, qty = 1, title) {
      setItems(prev => {
        const i = prev.findIndex(p => p.sku === sku);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return [...prev, { sku, qty, title }];
      });
    },
    remove(sku) { setItems(prev => prev.filter(p => p.sku !== sku)); },
    clear() { setItems([]); }
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const v = useContext(CartContext);
  if (!v) throw new Error("useCartContext must be used within CartProvider");
  return v;
}
