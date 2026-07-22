import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("gallery")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (!active) return;
        setGalleryItems(
          (data || []).map((g) => ({
            id: g.id,
            category: g.category,
            caption: g.caption,
            image: g.image_url,
          }))
        );
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { galleryItems, loading };
}