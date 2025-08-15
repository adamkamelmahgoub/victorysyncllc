
import { createContext, useContext, useMemo, useState, PropsWithChildren } from "react";
export type CartItem = { id: string; name?: string; price?: number; qty: number };
export type CartCtx = { items: CartItem[]; count: number; subtotal: number; add: (i:Omit<CartItem,"qty">, qty?:number)=>void; remove:(id:string)=>void; clear:()=>void; };
const CartContext = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const add: CartCtx["add"] = (i, qty=1)=>setItems(p=>{const k=p.findIndex(x=>x.id===i.id); if(k>-1){const c=[...p]; c[k]={...c[k], qty:c[k].qty+qty}; return c;} return [...p,{...i, qty}]});
  const remove: CartCtx["remove"] = id => setItems(p=>p.filter(x=>x.id!==id));
  const clear = ()=> setItems([]);
  const count = useMemo(()=>items.reduce((n,i)=>n+i.qty,0),[items]);
  const subtotal = useMemo(()=>items.reduce((s,i)=>s+(i.price??0)*i.qty,0),[items]);
  return <CartContext.Provider value={{ items, count, subtotal, add, remove, clear }}>{children}</CartContext.Provider>;
}
export function useCartContext(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) { console.warn("useCartContext without provider — no-op cart."); return { items:[], count:0, subtotal:0, add:()=>{}, remove:()=>{}, clear:()=>{} }; }
  return ctx;
}
