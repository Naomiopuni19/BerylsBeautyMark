import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Calendar, CreditCard, Package, Star, AlertTriangle, Info } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

const typeIcon = {
  booking: Calendar,
  payment: CreditCard,
  order: Package,
  review: Star,
  stock: AlertTriangle,
  system: Info,
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function NotificationBell({ dark, className }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleClick = (n) => {
    if (!n.read) markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const iconColor = dark ? "#F7DDE6" : "#3B2E36";

  return (
    <div ref={ref} className={`relative flex items-center ${className || ""}`}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notifications" className="relative flex items-center justify-center leading-none">
        <Bell size={18} color={iconColor} className="cursor-pointer" />
        {unreadCount > 0 && (
          <span style={{ background: "#C2698A" }} className="absolute -top-2 -right-2 text-[9px] text-white rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="absolute right-0 mt-3 w-80 max-w-[85vw] rounded-2xl shadow-2xl overflow-hidden z-50">
          <div style={{ borderColor: "#F2E1E7" }} className="flex items-center justify-between px-4 py-3 border-b">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ color: "#C2698A", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm text-center py-8">Nothing yet.</p>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcon[n.type] || Info;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    style={{ background: n.read ? "#FFFFFF" : "#FFF9FB", borderColor: "#F2E1E7" }}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 border-b last:border-0"
                  >
                    <div style={{ background: "#F7DDE6" }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} color="#8A4560" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p style={{ color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold leading-snug">{n.title}</p>
                      {n.body && <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-[11px] mt-0.5 leading-snug line-clamp-2">{n.body}</p>}
                      <p style={{ color: "#B29EA6", fontFamily: "'Poppins', sans-serif" }} className="text-[10px] mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.read && <span style={{ background: "#C2698A" }} className="w-2 h-2 rounded-full shrink-0 mt-1.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}