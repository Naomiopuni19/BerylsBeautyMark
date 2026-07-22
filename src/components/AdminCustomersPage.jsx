import React, { useState, useEffect } from "react";
import { UserRound, Mail, Phone, Calendar, Package } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase.rpc("get_customers").then(({ data, error }) => {
      if (error) setLoadError(error.message);
      else setCustomers(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return (c.full_name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (c.phone || "").includes(q);
  });

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Everyone with an account</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Customers</h1>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, or phone"
        style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
        className="w-full sm:w-80 text-sm rounded-full px-4 py-2.5 outline-none focus:border-[#D6B56E] mb-6"
      />

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading customers...</p>
      ) : loadError ? (
        <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "#E8B4BE" }} className="text-sm">{loadError}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-10 text-center">
          <p style={{ color: "#8A757C" }} className="text-sm">No customers found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div style={{ background: "rgba(214,181,110,0.12)" }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <UserRound size={17} color="#D6B56E" />
                </div>
                <div className="min-w-0">
                  <p style={{ color: "#F7EFF1" }} className="text-sm font-semibold truncate">{c.full_name || "No name on file"}</p>
                  <p style={{ color: "#8A757C" }} className="text-[11px]">Joined {new Date(c.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={12} color="#8A757C" />
                  <span style={{ color: "#B29EA6" }} className="text-xs truncate">{c.email}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} color="#8A757C" />
                    <span style={{ color: "#B29EA6" }} className="text-xs">{c.phone}</span>
                  </div>
                )}
              </div>

              <div style={{ borderColor: "rgba(255,255,255,0.06)" }} className="border-t pt-3 flex items-center gap-4">
                <span style={{ color: "#8A757C" }} className="text-xs flex items-center gap-1.5">
                  <Calendar size={12} /> {c.appointment_count} appointment{c.appointment_count === 1 ? "" : "s"}
                </span>
                <span style={{ color: "#8A757C" }} className="text-xs flex items-center gap-1.5">
                  <Package size={12} /> {c.order_count} order{c.order_count === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
