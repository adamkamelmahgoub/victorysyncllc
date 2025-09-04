import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
 id: string;
 name: string;
 price: number;
 quantity: number;
 features?: string[];
}

interface CartContextType {
 items: CartItem[];
 addItem: (item: Omit<CartItem, 'quantity'>) => void;
 removeItem: (id: string) => void;
 updateQuantity: (id: string, quantity: number) => void;
 clearCart: () => void;
 total: number;
 itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
 const [items, setItems] = useState<CartItem[]>([]);

 useEffect(() => {
   const savedCart = localStorage.getItem('cart_items');
   if (savedCart) {
     setItems(JSON.parse(savedCart));
   }
 }, []);

 useEffect(() => {
   localStorage.setItem('cart_items', JSON.stringify(items));
 }, [items]);

 const addItem = (item: Omit<CartItem, 'quantity'>) => {
   setItems(prev => {
     const existing = prev.find(i => i.id === item.id);
     if (existing) {
       return prev.map(i => 
         i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
       );
     }
     return [...prev, { ...item, quantity: 1 }];
   });
 };

 const removeItem = (id: string) => {
   setItems(prev => prev.filter(item => item.id !== id));
 };

 const updateQuantity = (id: string, quantity: number) => {
   if (quantity <= 0) {
     removeItem(id);
     return;
   }
   setItems(prev => 
     prev.map(item => 
       item.id === id ? { ...item, quantity } : item
     )
   );
 };

 const clearCart = () => {
   setItems([]);
 };

 const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
 const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

 return (
   <CartContext.Provider value={{
     items,
     addItem,
     removeItem,
     updateQuantity,
     clearCart,
     total,
     itemCount,
   }}>
     {children}
   </CartContext.Provider>
 );
}

export function useCartContext() {
 const context = useContext(CartContext);
 if (!context) {
   throw new Error('useCartContext must be used within a CartProvider');
 }
 return context;
}