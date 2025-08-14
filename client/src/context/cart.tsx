
import React, { createContext, useContext, useState } from "react";

type CartItem = { id: string; qty: number };
type CartContextValue = {
  items: CartItem[];
  addItem: (id: string, qty?: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const addItem = (id: string, qty = 1) =>
    setItems(prev => {
      const i = prev.findIndex(x => x.id === id);
      if (i > -1) { const copy = [...prev]; copy[i] = { ...copy[i], qty: copy[i].qty + qty }; return copy; }
      return [...prev, { id, qty }];
    });
  const clear = () => setItems([]);
  return <CartContext.Provider value={{ items, addItem, clear }}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a CartProvider");
  return ctx;
};
