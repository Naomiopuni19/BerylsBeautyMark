import React, { useState, useEffect } from "react";
import { CreditCard, Smartphone, Banknote, Calendar, Package } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

const providerIcon = { card: CreditCard, momo: Smartphone, paystack: CreditCard };

const statusStyle = {
  success: { bg: "#DCEFE3", color: "#3E7D5A" },
  pending: { bg: "#F2E7CF", color: "#8A6C1F" },
  failed: { bg: "#F3ECEE", color: "#A6949A" },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    supabase
      .from("payments")
      .select("*, orders(id), appointments(id, services(name))")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setLoadError(error.message);
        else setPayments(data || []);
        setLoading(false);
      });
  }, []);

  const total = payments.filter((p) => p.status === "success").reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Transaction log</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Payments</h1>
      </div>

      <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6 mb-6 w-full sm:w-fit">
        <p style={{ color: "#8A757C" }} className="text-xs mb-1">Total received</p>
        <p style={{ fontFamily: "'Playfair Display', serif", color: "#D6B56E" }} className="text-2xl">GHC {total.toFixed(2)}</p>
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading payments...</p>
      ) : loadError ? (
        <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "#E8B4BE" }} className="text-sm">{loadError}</p>
        </div>
      ) : payments.length === 0 ? (
        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-10 text-center">
          <p style={{ color: "#8A757C" }} className="text-sm">No payments recorded yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {payments.map((p) => {
            const Icon = providerIcon[p.provider] || CreditCard;
            const style = statusStyle[p.status] || statusStyle.pending;
            const forWhat = p.appointments ? p.appointments.services?.name || "Appointment" : p.orders ? "Shop order" : "Payment";
            return (
              <div key={p.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-4">
                <div style={{ background: "rgba(214,181,110,0.12)" }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <Icon size={16} color="#D6B56E" />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p style={{ color: "#F7EFF1" }} className="text-sm font-medium flex items-center gap-1.5">
                    {p.appointments ? <Calendar size={12} /> : <Package size={12} />} {forWhat}
                  </p>
                  <p style={{ color: "#8A757C" }} className="text-xs mt-0.5">
                    {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}{p.provider === "momo" ? "Mobile money" : p.provider === "card" ? "Card" : p.provider}
                  </p>
                </div>
                <span style={{ background: style.bg, color: style.color }} className="text-[11px] font-semibold px-3 py-1 rounded-full capitalize shrink-0">
                  {p.status}
                </span>
                <p style={{ color: "#D6B56E" }} className="text-sm font-semibold shrink-0">GHC {p.amount}</p>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}