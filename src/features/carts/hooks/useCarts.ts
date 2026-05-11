// src/features/cart/hooks/useCart.ts
import { useCartContext } from "../context/CartContext";
import type { CartItem } from "../context/CartContext";

export function useCart() {
  const { state, dispatch } = useCartContext();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function addToCart(product: CartItem) {
    dispatch({ type: "ADD_ITEM", payload: product });
  }

  function removeFromCart(productId: string) {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }

  function updateQuantity(productId: string, quantity: number) {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  function isInCart(productId: string) {
    return state.items.some((item) => item.id === productId);
  }

  function getItemQuantity(productId: string) {
    return state.items.find((item) => item.id === productId)?.quantity ?? 0;
  }

  return {
    items: state.items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}
