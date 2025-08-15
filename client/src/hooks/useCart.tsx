
import { useCartContext } from "@/contexts/CartContext";

/**
 * Compatibility wrapper:
 * - Exposes current context props: items, count, subtotal, add, remove, clear
 * - Also exposes legacy helpers used around the app:
 *   getItemCount(), getSubtotal(), getItems(), addItem(), removeItem(), clearCart()
 * This prevents "getItemCount is not a function" and similar runtime errors.
 */
export function useCart() {
  const ctx = useCartContext();

  return {
    // current API
    ...ctx, // items, count, subtotal, add, remove, clear

    // legacy/compat API (used by older components like navigation.tsx)
    getItemCount: () => ctx.count,
    getSubtotal: () => ctx.subtotal,
    getItems: () => ctx.items,
    addItem: ctx.add,
    removeItem: ctx.remove,
    clearCart: ctx.clear,
  };
}

// Also export default for places that import default
export default useCart;

// Re-export types if other files import them from here
export type { CartItem, CartCtx } from "@/contexts/CartContext";
