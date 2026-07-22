import React, { useState, useEffect, useCallback } from "react";
import { Package, MapPin, Phone, Check } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

const tabs = ["All", "Pending", "Paid", "Fulfilled", "Cancelled"];

const statusStyle = {
  pending: { bg: "#F2C9D8", color: "#9C4767" },
  paid: { bg: "#F2E7CF", color: "#8A6C1F" },
  fulfilled: { bg: "#DCEFE3", color: "#3E7D5A" },
  cancelled: { bg: "#F3ECEE", color: "#A6949A" },
};

export default function AdminOrdersPage() {
  const [tab, setTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(quantity, unit_price, products(name)), profiles(full_name, phone)")
      .order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const markFulfilled = async (id) => {
    setBusyId(id);
    await supabase.from("orders").update({ status: "fulfilled" }).eq("id", id);
    setBusyId(null);
    fetchOrders();
  };

  const filtered = tab === "All" ? orders : orders.filter((o) => o.status === tab.toLowerCase());

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Shop transactions</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Orders</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={tab === t ? { background: "#D6B56E", color: "#1B1216" } : { color: "#B29EA6", border: "1px solid rgba(255,255,255,0.1)" }}
            className="text-xs font-semibold px-4 py-2 rounded-full"
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading orders...</p>
      ) : loadError ? (
        <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "#E8B4BE" }} className="text-sm">{loadError}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-10 text-center">
          <p style={{ color: "#8A757C" }} className="text-sm">Nothing here right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((o) => {
            const style = statusStyle[o.status] || statusStyle.pending;
            return (
              <div key={o.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p style={{ color: "#F7EFF1" }} className="text-sm font-semibold">{o.shipping_name || o.profiles?.full_name || "Customer"}</p>
                    <p style={{ color: "#B29EA6" }} className="text-xs mt-0.5">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span style={{ background: style.bg, color: style.color }} className="text-[11px] font-semibold px-3 py-1 rounded-full capitalize shrink-0">
                    {o.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  {(o.order_items || []).map((item, i) => (
                    <p key={i} style={{ color: "#D9CFD2" }} className="text-xs">
                      {item.products?.name || "Product"} × {item.quantity} — GHC {item.unit_price * item.quantity}
                    </p>
                  ))}
                </div>

                {o.shipping_address && (
                  <div className="flex items-start gap-1.5 mb-1.5">
                    <MapPin size={12} color="#8A757C" className="mt-0.5 shrink-0" />
                    <p style={{ color: "#8A757C" }} className="text-xs">{o.shipping_address}, {o.shipping_city}</p>
                  </div>
                )}
                {o.shipping_phone && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <Phone size={12} color="#8A757C" />
                    <p style={{ color: "#8A757C" }} className="text-xs">{o.shipping_phone}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p style={{ color: "#D6B56E" }} className="text-sm font-semibold">Total GHC {o.total_amount}</p>
                  {o.status === "paid" && (
                    <button
                      onClick={() => markFulfilled(o.id)}
                      disabled={busyId === o.id}
                      style={{ background: "rgba(127,203,156,0.15)", color: "#7FCB9C" }}
                      className="text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Check size={13} /> Mark fulfilled
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}