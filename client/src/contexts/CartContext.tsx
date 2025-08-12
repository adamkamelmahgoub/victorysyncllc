
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  packageId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (packageId: number) => void;
  updateQuantity: (packageId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.packageId === newItem.packageId);
      if (existing) {
        return prev.map(item => 
          item.packageId === newItem.packageId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (packageId: number) => {
    setItems(prev => prev.filter(item => item.packageId !== packageId));
  };

  const updateQuantity = (packageId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(packageId);
      return;
    }
    setItems(prev => 
      prev.map(item => 
        item.packageId === packageId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
