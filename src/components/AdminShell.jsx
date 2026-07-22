import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Calendar, Scissors, Package, Boxes, ClipboardList,
  UserRound, CreditCard, BarChart3, Settings, LogOut, Menu, X,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", to: "/admin" },
  { icon: Calendar, label: "Appointments", to: "/admin/appointments" },
  { icon: Scissors, label: "Services", to: "/admin/services" },
  { icon: Package, label: "Products", to: "/admin/products" },
  { icon: Boxes, label: "Inventory", to: "/admin/inventory" },
  { icon: ClipboardList, label: "Orders", to: "/admin/orders" },
  { icon: ImageIcon, label: "Media library", to: "/admin/media" },
  { icon: UserRound, label: "Customers", to: "/admin/customers" },
  { icon: CreditCard, label: "Payments", to: "/admin/payments" },
  { icon: BarChart3, label: "Analytics", to: "/admin/analytics" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

function SidebarLinks({ pathname, onNavigate }) {
  const { signOut } = useAuth();
  return (
    <>
      <div className="flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const active = item.to && pathname === item.to;
          const content = (
            <>
              <item.icon size={16} />
              {item.label}
            </>
          );
          const style = active
            ? { background: "linear-gradient(90deg,#C2698A,#8A4560)", color: "#FFF9FB" }
            : { color: item.to ? "#B29EA6" : "#6E5F65" };
          const className = `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${item.to ? "cursor-pointer hover:text-[#F7DDE6]" : "cursor-default"}`;

          return item.to ? (
            <Link key={item.label} to={item.to} onClick={onNavigate} style={style} className={className}>
              {content}
            </Link>
          ) : (
            <div key={item.label} style={style} className={className}>
              {content}
            </div>
          );
        })}
      </div>
      <div
        onClick={signOut}
        style={{ color: "#B29EA6", borderColor: "rgba(255,255,255,0.06)" }}
        className="flex items-center gap-3 px-4 py-2.5 mt-8 border-t pt-6 text-sm cursor-pointer"
      >
        <LogOut size={16} /> Log out
      </div>
    </>
  );
}

export default function AdminShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={{ background: "#241A20", fontFamily: "'Poppins', sans-serif" }} className="min-h-full flex">
      <aside style={{ background: "#1B1216", borderColor: "rgba(255,255,255,0.06)" }} className="w-64 shrink-0 border-r px-5 py-7 hidden md:block">
        <div className="flex items-baseline gap-2 mb-10 px-2">
          <span style={{ fontFamily: "'Playfair Display', serif", color: "#F7DDE6" }} className="text-xl italic">Beryl's</span>
          <span style={{ color: "#D6B56E", letterSpacing: "0.15em" }} className="text-[9px] font-semibold uppercase">Admin</span>
        </div>
        <SidebarLinks pathname={location.pathname} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div onClick={() => setMobileOpen(false)} style={{ background: "rgba(0,0,0,0.55)" }} className="absolute inset-0" />
          <div style={{ background: "#1B1216" }} className="absolute top-0 left-0 h-full w-72 max-w-[82%] shadow-2xl px-5 py-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: "'Playfair Display', serif", color: "#F7DDE6" }} className="text-xl italic">Beryl's</span>
                <span style={{ color: "#D6B56E", letterSpacing: "0.15em" }} className="text-[9px] font-semibold uppercase">Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} color="#F7EFF1" />
              </button>
            </div>
            <SidebarLinks pathname={location.pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div style={{ background: "#1B1216", borderColor: "rgba(255,255,255,0.06)" }} className="md:hidden flex items-center justify-between border-b px-5 py-4 sticky top-0 z-30">
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: "'Playfair Display', serif", color: "#F7DDE6" }} className="text-lg italic">Beryl's</span>
            <span style={{ color: "#D6B56E", letterSpacing: "0.15em" }} className="text-[9px] font-semibold uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell dark />
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} color="#F7EFF1" />
            </button>
          </div>
        </div>

        <div style={{ borderColor: "rgba(255,255,255,0.06)" }} className="hidden md:flex items-center justify-end px-9 py-4 border-b">
          <NotificationBell dark />
        </div>

        <main className="flex-1 p-5 sm:p-6 md:p-9 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}