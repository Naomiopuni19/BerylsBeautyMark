import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, CreditCard, Banknote, Smartphone, AlertCircle } from "lucide-react";
import { useMyAppointments } from "../../hooks/useMyAppointments";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { payWithPaystack } from "../../lib/paystack";

const tabs = ["Pending", "Upcoming", "Completed", "Declined"];

const statusStyle = {
  pending: { bg: "#F2C9D8", color: "#9C4767", label: "Pending review" },
  accepted: { bg: "#F2E7CF", color: "#8A6C1F", label: "Awaiting payment" },
  confirmed: { bg: "#DCEFE3", color: "#3E7D5A", label: "Confirmed" },
  completed: { bg: "#E4E1F0", color: "#5A4E8A", label: "Completed" },
  rejected: { bg: "#F3ECEE", color: "#A6949A", label: "Declined" },
  cancelled: { bg: "#F3ECEE", color: "#A6949A", label: "Cancelled" },
};

const paymentIcon = { cash: Banknote, momo: Smartphone, card: CreditCard };

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const { appointments, loading, refetch } = useMyAppointments();
  const [tab, setTab] = useState("Pending");
  const [payingId, setPayingId] = useState(null);

  const filtered = appointments.filter((a) => {
    if (tab === "Pending") return a.status === "pending";
    if (tab === "Upcoming") return a.status === "accepted" || a.status === "confirmed";
    if (tab === "Completed") return a.status === "completed";
    if (tab === "Declined") return a.status === "rejected" || a.status === "cancelled";
    return true;
  });

  const payNow = (appointment) => {
    setPayingId(appointment.id);
    payWithPaystack({
      email: user.email,
      amountGHS: appointment.price,
      metadata: { appointment_id: appointment.id, type: "appointment" },
      onSuccess: async (response) => {
        await supabase.from("appointments").update({ status: "confirmed" }).eq("id", appointment.id);
        await supabase.from("payments").insert({
          appointment_id: appointment.id,
          amount: appointment.price,
          provider: appointment.paymentMethod === "momo" ? "momo" : "card",
          status: "success",
          reference: response.reference,
        });
        setPayingId(null);
        refetch();
      },
      onClose: () => setPayingId(null),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl">My appointments</h1>
        <Link to="/book" style={{ background: "#C2698A", color: "#FFF9FB" }} className="text-xs font-semibold px-4 py-2.5 rounded-full">
          Book new
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={tab === t ? { background: "#C2698A", color: "#FFF9FB" } : { color: "#5A4650", border: "1px solid #F2E1E7" }}
            className="text-xs font-semibold px-4 py-2 rounded-full"
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading your appointments...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-10 text-center">
          <p style={{ color: "#8A757C" }} className="text-sm">Nothing in {tab.toLowerCase()} right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => {
            const PayIcon = paymentIcon[a.paymentMethod] || Banknote;
            const style = statusStyle[a.status];
            const needsPayment = a.status === "accepted" && a.paymentMethod !== "cash";
            return (
              <div key={a.id} style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-3">
                  <div style={{ background: "linear-gradient(155deg,#F2C9D8,#F7DDE6)" }} className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    {a.image ? <img src={a.image} alt={a.service} className="w-full h-full object-cover" /> : <Calendar size={18} color="#8A4560" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#3B2E36" }} className="text-sm font-semibold">{a.service}</p>
                    <p style={{ color: "#8A757C" }} className="text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {a.date}, {a.time}
                    </p>
                  </div>
                  <p style={{ color: "#3B2E36" }} className="text-sm font-semibold hidden sm:block shrink-0">GHC {a.price}</p>
                  <span style={{ background: style.bg, color: style.color }} className="text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
                    {style.label}
                  </span>
                </div>

                {a.status === "rejected" && a.rejectionReason && (
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle size={13} color="#A6949A" className="mt-0.5 shrink-0" />
                    <p style={{ color: "#8A757C" }} className="text-xs italic">{a.rejectionReason}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <PayIcon size={12} color="#8A757C" />
                  <span style={{ color: "#8A757C" }} className="text-xs">
                    {a.paymentMethod === "momo" ? "Mobile money" : a.paymentMethod === "card" ? "Card" : "Cash in studio"}
                  </span>
                </div>

                {needsPayment && (
                  <button
                    onClick={() => payNow(a)}
                    disabled={payingId === a.id}
                    style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB" }}
                    className="text-xs font-semibold px-5 py-2.5 rounded-full mt-3 disabled:opacity-60"
                  >
                    {payingId === a.id ? "Opening payment..." : `Pay GHC ${a.price} now`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}