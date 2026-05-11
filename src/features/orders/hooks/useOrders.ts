import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../auth/hooks/useAuth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useOrders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function placeOrder(items: CartItem[], total: number) {
    if (!user) throw new Error("You must be logged in to place an order.");
    setLoading(true);

    try {
      // 1. Insert the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total, status: "pending" })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert all order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    if (!user) return [];

    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  return { placeOrder, fetchOrders, loading };
}
