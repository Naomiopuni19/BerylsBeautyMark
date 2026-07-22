import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, Package, Users } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from("payments").select("amount, status, created_at").eq("status", "success"),
      supabase.from("appointments").select("status, service_id, services(name)"),
      supabase.from("orders").select("status, total_amount"),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    ]).then(([paymentsRes, appointmentsRes, ordersRes, customersRes]) => {
      setPayments(paymentsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setOrders(ordersRes.data || []);
      setCustomerCount(customersRes.count || 0);
      setLoading(false);
    });
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const revenueByDay = last7Days.map((d) => {
    const dayKey = d.toDateString();
    return payments.filter((p) => new Date(p.created_at).toDateString() === dayKey).reduce((sum, p) => sum + Number(p.amount), 0);
  });
  const maxRevenue = Math.max(...revenueByDay, 1);

  const serviceCounts = {};
  appointments.forEach((a) => {
    const name = a.services?.name || "Unknown";
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxServiceCount = Math.max(...topServices.map((s) => s[1]), 1);

  const completedAppointments = appointments.filter((a) => a.status === "completed").length;
  const fulfilledOrders = orders.filter((o) => o.status === "fulfilled" || o.status === "paid").length;

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">How the business is doing</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Analytics</h1>
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { icon: TrendingUp, value: `GHC ${totalRevenue.toFixed(0)}`, label: "Total revenue" },
              { icon: Calendar, value: completedAppointments, label: "Completed visits" },
              { icon: Package, value: fulfilledOrders, label: "Orders processed" },
              { icon: Users, value: customerCount, label: "Registered customers" },
            ].map((c) => (
              <div key={c.label} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-4 sm:p-5">
                <div style={{ background: "rgba(214,181,110,0.12)" }} className="w-9 h-9 rounded-xl flex items-center justify-center mb-3">
                  <c.icon size={16} color="#D6B56E" />
                </div>
                <p style={{ color: "#F7EFF1", fontFamily: "'Playfair Display', serif" }} className="text-xl sm:text-2xl mb-1">{c.value}</p>
                <p style={{ color: "#B29EA6" }} className="text-xs">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-5">Revenue, last 7 days</p>
              <div className="flex items-end justify-between gap-2 h-32 mb-2">
                {revenueByDay.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      style={{ height: `${Math.max(4, (v / maxRevenue) * 100)}%`, background: "linear-gradient(180deg,#D6B56E,#8A6C1F)" }}
                      className="w-full rounded-t-md self-end"
                    />
                  </div>
                ))}
              </div>
              <div style={{ color: "#8A757C" }} className="flex justify-between text-[10px]">
                {last7Days.map((d, i) => <span key={i}>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>)}
              </div>
            </div>

            <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-5">Most booked services</p>
              {topServices.length === 0 ? (
                <p style={{ color: "#8A757C" }} className="text-sm">No bookings yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {topServices.map(([name, count]) => (
                    <div key={name}>
                      <div className="flex justify-between mb-1.5">
                        <span style={{ color: "#F7EFF1" }} className="text-xs">{name}</span>
                        <span style={{ color: "#8A757C" }} className="text-xs">{count}</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)" }} className="w-full h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${(count / maxServiceCount) * 100}%`, background: "#D6B56E" }} className="h-full rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}