
import {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";

export type CartItem = { id: string; name?: string; price?: number; qty: number };

export type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartCtx["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i > -1) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const remove: CartCtx["remove"] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0),
    [items]
  );

  const value: CartCtx = { items, count, subtotal, add, remove, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** SAFE HOOK: never crash if provider is missing (prevents white screens) */
export function useCartContext(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) {
    console.warn("useCartContext used without CartProvider — returning no-op cart.");
    return {
      items: [],
      count: 0,
      subtotal: 0,
      add: () => {},
      remove: () => {},
      clear: () => {},
    };
  }
  return ctx;
}
