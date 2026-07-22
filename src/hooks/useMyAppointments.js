import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useMyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*, services(name, image_url)")
      .eq("customer_id", user.id)
      .order("appointment_date", { ascending: false });

    setAppointments(
      (data || []).map((a) => ({
        id: a.id,
        service: a.services?.name || "Service",
        image: a.services?.image_url,
        date: new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        time: a.time_slot?.slice(0, 5),
        status: a.status,
        paymentMethod: a.payment_method,
        rejectionReason: a.rejection_reason,
        price: a.estimated_price,
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, refetch: fetchAppointments };
}