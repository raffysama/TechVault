import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  created_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        return;
      }
      setProducts(data as Product[]);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return { products, loading };
};
