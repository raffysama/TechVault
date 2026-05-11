import { useEffect, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../../auth/hooks/useAuth";

export default function OrdersPage() {
  const { user } = useAuth();
  const { fetchOrders } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-500">
        Please log in to view your orders.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">Loading orders...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500">
        You haven't placed any orders yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your Orders</h1>
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {/* Order header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Order ID</p>
                <p className="font-mono text-sm text-slate-600">
                  {order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium capitalize text-green-700">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order items */}
            <div className="flex flex-col gap-3">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order total */}
            <div className="mt-4 border-t border-slate-100 pt-4 text-right">
              <span className="text-sm text-slate-500">Total: </span>
              <span className="text-base font-bold text-slate-900">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
