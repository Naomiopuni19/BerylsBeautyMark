import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!active) return;
        setServices(
          (data || []).map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            duration: s.duration_label,
            priceMin: s.price_min,
            priceMax: s.price_max,
            tag: s.tag,
            dailyCapacity: s.daily_capacity,
            description: s.description,
            prepTips: s.prep_tips,
            aftercare: s.aftercare,
            image: s.image_url,
          }))
        );
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { services, loading };
}