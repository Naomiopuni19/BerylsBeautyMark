import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useApprovedReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("customer_reviews")
      .select("*, profiles(full_name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (!active) return;
        setReviews(
          (data || []).map((r) => ({
            id: r.id,
            name: r.profiles?.full_name || "A client",
            rating: r.rating,
            comment: r.comment,
            photo: r.photo_url,
          }))
        );
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { reviews, loading };
}