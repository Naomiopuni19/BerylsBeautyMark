import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSiteImage(key, fallback = "") {
  const [url, setUrl] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_images")
      .select("image_url")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.image_url) setUrl(data.image_url);
        setLoading(false);
      });
    return () => { active = false; };
  }, [key]);

  return { url, loading };
}