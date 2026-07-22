import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    const audience = user.role === "admin" ? "admin" : "customer";
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("audience", audience)
      .order("created_at", { ascending: false })
      .limit(30);

    if (audience === "customer") query = query.eq("user_id", user.id);

    const { data } = await query;
    setNotifications(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    if (!user) return;

    const channel = supabase
      .channel("notifications-" + user.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const markRead = async (id) => {
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead };
}