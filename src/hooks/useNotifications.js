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
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications();

    // 1. Create channel instance
    const channelName = `notifs-${user.id}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase.channel(channelName);

    // 2. Attach .on listener BEFORE subscribe
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      () => {
        fetchNotifications();
      }
    );

    // 3. Subscribe separately
    channel.subscribe();

    // 4. Clean up channel on unmount or re-render
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);

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