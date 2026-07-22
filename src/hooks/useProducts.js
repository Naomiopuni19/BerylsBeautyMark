import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        if (!active) return;
        setProducts(
          (data || []).map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            rating: p.rating,
            stock: p.stock_quantity,
            description: p.description,
            howToUse: p.how_to_use,
            image: p.image_url,
          }))
        );
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { products, loading };
}