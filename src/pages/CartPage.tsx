// src/pages/CartPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../features/carts/hooks/useCarts";
import { useOrders } from "../features/orders/hooks/useOrders";
import { useAuth } from "../features/auth/hooks/useAuth";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const { placeOrder, loading: orderLoading } = useOrders();
  const { user } = useAuth();

  const shipping = totalPrice > 100 ? 0 : 9.99;
  const grandTotal = totalPrice + shipping;

  async function handleCheckout() {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }
    try {
      await placeOrder(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        grandTotal,
      );
      clearCart();
      toast.success("Order placed!");
      navigate("/orders");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order.");
    }
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <svg
            className="h-9 w-9 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Your cart is empty
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Looks like you haven't added anything yet.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Cart with items ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Remove all items from your cart?")) {
              clearCart();
            }
          }}
          className="text-sm font-medium text-slate-400 transition hover:text-red-500"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Cart items ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              {/* Image */}
              <Link to={`/products/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-lg object-cover transition hover:opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/96x96/f8fafc/94a3b8?text=?";
                  }}
                />
              </Link>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                      {item.category}
                    </span>
                    <Link
                      to={`/products/${item.id}`}
                      className="mt-0.5 block truncate font-semibold text-slate-900 transition hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-400"
                    title="Remove"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Qty + line total */}
                <div className="mt-3 flex items-center justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                    >
                      −
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center border-x border-slate-200 text-sm font-semibold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      ${item.price.toLocaleString()} × {item.quantity}
                    </p>
                    <p className="font-bold text-slate-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-blue-600"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ── Order summary ────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-bold text-slate-900">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span
                  className={shipping === 0 ? "font-medium text-green-600" : ""}
                >
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-slate-400">
                  Free shipping on orders over $100
                </p>
              )}

              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={orderLoading}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {orderLoading ? "Placing order..." : "Proceed to Checkout →"}
            </button>

            {/* Trust badges */}
            <div className="mt-4 flex flex-col gap-1.5">
              {[
                "🔒 Secure checkout",
                "↩ 30-day returns",
                "🚚 Tracked shipping",
              ].map((text) => (
                <p key={text} className="text-center text-xs text-slate-400">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
