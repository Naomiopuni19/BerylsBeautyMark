import React, { useState } from "react";
import {
  Calendar, Package, TrendingUp, AlertTriangle, ArrowUpRight,
  Camera, Check, X, UserRound
} from "lucide-react";
import { inventory, appointments, initialPendingReviews } from "../lib/data";
import AdminShell from "./AdminShell";

const statusStyle = {
  Confirmed: { bg: "#F2E7CF", color: "#8A6C1F" },
  Pending: { bg: "#F2C9D8", color: "#9C4767" },
  Completed: { bg: "#DCEFE3", color: "#3E7D5A" },
};

export default function AdminDashboard() {
  const [pendingReviews, setPendingReviews] = useState(initialPendingReviews);

  const decide = (id, approve) => {
    setPendingReviews((r) => r.filter((item) => item.id !== id));
  };

  const chartPoints = [40, 65, 50, 80, 60, 90, 75];
  const maxPoint = Math.max(...chartPoints);
  const chartPath = chartPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * 55} ${120 - (p / maxPoint) * 100}`)
    .join(" ");

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <p style={{ color: "#B29EA6" }} className="text-xs mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">How's it going, Beryl?</h1>
        </div>
        <div style={{ background: "#332529" }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <UserRound size={17} color="#F7DDE6" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Today's appointments", value: "12", icon: Calendar, up: "2 more than usual" },
          { label: "Today's revenue", value: "GHC 3,450", icon: TrendingUp, up: "12 percent this week" },
          { label: "Products sold", value: "28", icon: Package, up: "6 percent this week" },
          { label: "Low stock items", value: "4", icon: AlertTriangle, up: "needs attention", warn: true },
        ].map((c) => (
          <div key={c.label} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div style={{ background: "rgba(214,181,110,0.12)" }} className="w-9 h-9 rounded-xl flex items-center justify-center">
                <c.icon size={16} color="#D6B56E" />
              </div>
              <ArrowUpRight size={14} color={c.warn ? "#E38B9A" : "#7FCB9C"} />
            </div>
            <p style={{ color: "#F7EFF1", fontFamily: "'Playfair Display', serif" }} className="text-xl sm:text-2xl mb-1">{c.value}</p>
            <p style={{ color: "#B29EA6" }} className="text-xs">{c.label}</p>
            <p style={{ color: c.warn ? "#E38B9A" : "#7FCB9C" }} className="text-[11px] mt-2">{c.up}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="lg:col-span-2 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg">Revenue overview</p>
            <span style={{ color: "#B29EA6" }} className="text-xs">This week</span>
          </div>
          <svg viewBox="0 0 330 130" className="w-full h-32">
            <path d={chartPath} fill="none" stroke="#D6B56E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {chartPoints.map((p, i) => (
              <circle key={i} cx={i * 55} cy={120 - (p / maxPoint) * 100} r="3.5" fill="#241A20" stroke="#D6B56E" strokeWidth="2" />
            ))}
          </svg>
          <div style={{ color: "#8A757C" }} className="flex justify-between text-[10px] mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-4 self-start">Top services</p>
          <div style={{ background: "conic-gradient(#D6B56E 0% 45%, #C2698A 45% 70%, #8A4560 70% 90%, #4A3A40 90% 100%)" }}
               className="w-28 h-28 rounded-full flex items-center justify-center">
            <div style={{ background: "#2E2126" }} className="w-16 h-16 rounded-full" />
          </div>
          <div style={{ color: "#B29EA6" }} className="text-[11px] mt-4 grid grid-cols-2 gap-x-4 gap-y-1 self-start">
            <span><span style={{ color: "#D6B56E" }}>&#9679;</span> Knotless 45</span>
            <span><span style={{ color: "#C2698A" }}>&#9679;</span> Wig install 25</span>
            <span><span style={{ color: "#8A4560" }}>&#9679;</span> Bohemian 20</span>
            <span><span style={{ color: "#4A3A40" }}>&#9679;</span> Others 10</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="lg:col-span-2 rounded-2xl p-5 sm:p-6">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-5">Recent appointments</p>
          <div className="flex flex-col gap-3">
            {appointments.map((a, i) => (
              <div key={i} style={{ borderColor: "rgba(255,255,255,0.06)" }} className="flex items-center justify-between gap-2 py-3 border-b last:border-0">
                <div className="min-w-0">
                  <p style={{ color: "#F7EFF1" }} className="text-sm font-medium truncate">{a.client}</p>
                  <p style={{ color: "#8A757C" }} className="text-xs truncate">{a.service}</p>
                </div>
                <p style={{ color: "#B29EA6" }} className="text-xs hidden sm:block shrink-0">{a.time}</p>
                <span style={{ background: statusStyle[a.status].bg, color: statusStyle[a.status].color }}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-5">Inventory levels</p>
          <div className="flex flex-col gap-4">
            {inventory.map((item) => {
              const pct = Math.round((item.left / item.total) * 100);
              const low = item.left <= 5;
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: "#F7EFF1" }} className="text-xs">{item.name}</span>
                    <span style={{ color: low ? "#E38B9A" : "#B29EA6" }} className="text-xs">
                      {item.left === 0 ? "Out of stock" : `${item.left} left`}
                    </span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)" }} className="w-full h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%`, background: low ? "#E38B9A" : "#D6B56E" }} className="h-full rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg">Photo reviews waiting for approval</p>
          <span style={{ background: "rgba(194,105,138,0.15)", color: "#E38B9A" }} className="text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
            {pendingReviews.length} pending
          </span>
        </div>
        {pendingReviews.length === 0 ? (
          <p style={{ color: "#8A757C" }} className="text-sm py-6 text-center">Nothing waiting, you are all caught up.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {pendingReviews.map((r) => (
              <div key={r.id} style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-xl p-4 flex gap-4">
                <div style={{ background: "linear-gradient(155deg,#F2C9D8,#F7DDE6)" }} className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0">
                  <Camera size={18} color="#8A4560" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p style={{ color: "#F7EFF1" }} className="text-sm font-medium truncate">{r.name}</p>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button onClick={() => decide(r.id, true)} style={{ background: "rgba(127,203,156,0.15)" }} className="w-6 h-6 rounded-full flex items-center justify-center">
                        <Check size={12} color="#7FCB9C" />
                      </button>
                      <button onClick={() => decide(r.id, false)} style={{ background: "rgba(227,139,154,0.15)" }} className="w-6 h-6 rounded-full flex items-center justify-center">
                        <X size={12} color="#E38B9A" />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: "#8A757C" }} className="text-xs mb-1">{r.service}</p>
                  <p style={{ color: "#B29EA6" }} className="text-xs leading-snug line-clamp-2">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}