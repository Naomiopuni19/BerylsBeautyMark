import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery").select("*").order("sort_order");
    setGalleryItems(
      (data || []).map((g) => ({
        id: g.id,
        category: g.category,
        caption: g.caption,
        image: g.image_url,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { galleryItems, loading, refetch: fetchGallery };
}