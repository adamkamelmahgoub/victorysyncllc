import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const { state, dispatch } = useCartContext();
  const { toast } = useToast();

  const addItem = (item: { packageId: number; name: string; price: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast({
      title: "Added to cart",
      description: `${item.name} plan has been added to your cart.`,
    });
  };

  const removeItem = (packageId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: packageId });
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (packageId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { packageId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    items: state.items,
    total: state.total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
  };
};
