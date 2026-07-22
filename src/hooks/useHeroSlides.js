import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useHeroSlides() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!active) return;
        setHeroSlides(
          (data || []).map((h) => ({
            id: h.id,
            headline: h.headline,
            accent: h.accent,
            subtext: h.subtext,
            image: h.image_url,
          }))
        );
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { heroSlides, loading };
}