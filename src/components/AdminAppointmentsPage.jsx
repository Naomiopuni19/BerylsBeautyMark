import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, Check, X, Banknote, Smartphone,
  CreditCard as CardIcon, AlertCircle
} from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

const tabs = ["Pending", "Upcoming", "Completed", "Declined"];

const statusStyle = {
  pending: { bg: "#F2C9D8", color: "#9C4767", label: "Pending" },
  accepted: { bg: "#F2E7CF", color: "#8A6C1F", label: "Awaiting payment" },
  confirmed: { bg: "#DCEFE3", color: "#3E7D5A", label: "Confirmed" },
  completed: { bg: "#E4E1F0", color: "#5A4E8A", label: "Completed" },
  rejected: { bg: "#F3ECEE", color: "#A6949A", label: "Declined" },
  cancelled: { bg: "#F3ECEE", color: "#A6949A", label: "Cancelled" },
};

const paymentIcon = { cash: Banknote, momo: Smartphone, card: CardIcon };

export default function AdminAppointmentsPage() {
  const [tab, setTab] = useState("Pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("appointments")
     .select("*, services(name), profiles!customer_id(full_name, phone)")
      .order("appointment_date", { ascending: true });
    if (error) {
      setLoadError(error.message);
      setAppointments([]);
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const accept = async (id) => {
    setBusyId(id);
    await supabase.from("appointments").update({ status: "accepted" }).eq("id", id);
    setBusyId(null);
    fetchAppointments();
  };

  const reject = async (id) => {
    setBusyId(id);
    await supabase.from("appointments").update({ status: "rejected", rejection_reason: reason || null }).eq("id", id);
    setBusyId(null);
    setRejectingId(null);
    setReason("");
    fetchAppointments();
  };

  const markCompleted = async (id) => {
    setBusyId(id);
    await supabase.from("appointments").update({ status: "completed" }).eq("id", id);
    setBusyId(null);
    fetchAppointments();
  };

  const markCashPaid = async (id) => {
    // Cash appointments skip online payment, accepting moves them straight to confirmed
    setBusyId(id);
    await supabase.from("appointments").update({ status: "confirmed" }).eq("id", id);
    setBusyId(null);
    fetchAppointments();
  };

  const filtered = appointments.filter((a) => {
    if (tab === "Pending") return a.status === "pending";
    if (tab === "Upcoming") return a.status === "accepted" || a.status === "confirmed";
    if (tab === "Completed") return a.status === "completed";
    if (tab === "Declined") return a.status === "rejected" || a.status === "cancelled";
    return true;
  });

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Manage requests</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Appointments</h1>
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
            {t === "Pending" && appointments.filter((a) => a.status === "pending").length > 0 && (
              <span style={{ background: tab === t ? "rgba(27,18,22,0.2)" : "rgba(214,181,110,0.2)", color: tab === t ? "#1B1216" : "#D6B56E" }} className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full">
                {appointments.filter((a) => a.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading appointments...</p>
      ) : loadError ? (
        <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "#E8B4BE" }} className="text-sm font-medium mb-1">Could not load appointments</p>
          <p style={{ color: "#E8B4BE" }} className="text-xs">{loadError}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-10 text-center">
          <p style={{ color: "#8A757C" }} className="text-sm">Nothing here right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => {
            const PayIcon = paymentIcon[a.payment_method] || Banknote;
            const style = statusStyle[a.status];
            return (
              <div key={a.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p style={{ color: "#F7EFF1" }} className="text-sm font-semibold">{a.services?.name || "Service"}</p>
                    <p style={{ color: "#B29EA6" }} className="text-xs mt-0.5">{a.profiles?.full_name || "Customer"} • {a.profiles?.phone || "No phone on file"}</p>
                  </div>
                  <span style={{ background: style.bg, color: style.color }} className="text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
                    {style.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span style={{ color: "#B29EA6" }} className="text-xs flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span style={{ color: "#B29EA6" }} className="text-xs flex items-center gap-1.5">
                    <Clock size={12} /> {a.time_slot?.slice(0, 5)}
                  </span>
                  <span style={{ color: "#B29EA6" }} className="text-xs flex items-center gap-1.5">
                    <PayIcon size={12} /> {a.payment_method === "momo" ? "Mobile money" : a.payment_method === "card" ? "Card" : "Cash"}
                  </span>
                  <span style={{ color: "#D6B56E" }} className="text-xs font-semibold">GHC {a.estimated_price} plus</span>
                </div>

                {a.notes && (
                  <div style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl p-3 mb-3">
                    <p style={{ color: "#8A757C" }} className="text-[10px] uppercase tracking-wide font-semibold mb-1">Note from client</p>
                    <p style={{ color: "#D9CFD2" }} className="text-xs leading-relaxed">{a.notes}</p>
                  </div>
                )}

                {a.status === "rejected" && a.rejection_reason && (
                  <p style={{ color: "#B29EA6" }} className="text-xs mb-3 italic">Reason given: {a.rejection_reason}</p>
                )}

                {a.status === "pending" && rejectingId !== a.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => accept(a.id)}
                      disabled={busyId === a.id}
                      style={{ background: "rgba(127,203,156,0.15)", color: "#7FCB9C" }}
                      className="text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Check size={13} /> Accept
                    </button>
                    <button
                      onClick={() => setRejectingId(a.id)}
                      disabled={busyId === a.id}
                      style={{ background: "rgba(227,139,154,0.15)", color: "#E38B9A" }}
                      className="text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <X size={13} /> Decline
                    </button>
                  </div>
                )}

                {a.status === "pending" && rejectingId === a.id && (
                  <div style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl p-4 mt-2">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle size={13} color="#E38B9A" className="mt-0.5 shrink-0" />
                      <p style={{ color: "#B29EA6" }} className="text-xs">Let the client know why, this is optional but appreciated.</p>
                    </div>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Example, fully booked that day, please try a different date"
                      style={{ background: "#1B1216", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                      className="w-full text-xs rounded-lg p-3 outline-none resize-none h-16 mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => reject(a.id)}
                        disabled={busyId === a.id}
                        style={{ background: "#E38B9A", color: "#1B1216" }}
                        className="text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-60"
                      >
                        Confirm decline
                      </button>
                      <button
                        onClick={() => { setRejectingId(null); setReason(""); }}
                        style={{ color: "#8A757C" }}
                        className="text-xs font-semibold px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {a.status === "accepted" && a.payment_method === "cash" && (
                  <button
                    onClick={() => markCashPaid(a.id)}
                    disabled={busyId === a.id}
                    style={{ background: "rgba(214,181,110,0.15)", color: "#D6B56E" }}
                    className="text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-60"
                  >
                    Mark as confirmed
                  </button>
                )}

                {a.status === "accepted" && a.payment_method !== "cash" && (
                  <p style={{ color: "#B29EA6" }} className="text-xs italic">Waiting on the client to complete payment.</p>
                )}

                {a.status === "confirmed" && new Date(a.appointment_date + "T00:00:00") <= new Date() && (
                  <button
                    onClick={() => markCompleted(a.id)}
                    disabled={busyId === a.id}
                    style={{ background: "rgba(127,203,156,0.15)", color: "#7FCB9C" }}
                    className="text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-60"
                  >
                    Mark visit as completed
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}