import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const fallback = {
  business_name: "Beryl's Beauty Mark",
  tagline: "A luxury hair and beauty studio dedicated to making you look and feel your absolute best.",
  address: "Adum, Kumasi, Ghana",
  phone: "+233 24 000 0000",
  whatsapp: "+233240000000",
  email: "hello@berylsbeautymark.com",
  hours_weekday: "Mon to Sat, 9:00 AM to 7:00 PM",
  hours_sunday: "By appointment only",
};

export function useBusinessSettings() {
  const [settings, setSettings] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.from("business_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (!active) return;
      if (data) setSettings(data);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { settings, loading };
}