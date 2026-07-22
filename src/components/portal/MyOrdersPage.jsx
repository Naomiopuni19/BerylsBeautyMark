import React, { useState } from "react";
import { Package, ChevronDown, FileText } from "lucide-react";
import { myOrders } from "../../lib/data";

const statusStyle = {
  Delivered: { bg: "#DCEFE3", color: "#3E7D5A" },
  Processing: { bg: "#F2E7CF", color: "#8A6C1F" },
  Pending: { bg: "#F2C9D8", color: "#9C4767" },
  Cancelled: { bg: "#F3ECEE", color: "#A6949A" },
};

export default function MyOrdersPage() {
  const [openId, setOpenId] = useState(null);

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-6">My orders</h1>

      {myOrders.length === 0 ? (
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-10 text-center">
          <p style={{ color: "#8A757C" }} className="text-sm">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myOrders.map((o) => {
            const open = openId === o.id;
            return (
              <div key={o.id} style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl overflow-hidden">
                <button onClick={() => setOpenId(open ? null : o.id)} className="w-full flex items-center gap-4 p-5 text-left">
                  <div style={{ background: "linear-gradient(155deg,#F7DDE6,#F2C9D8)" }} className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={18} color="#8A4560" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#3B2E36" }} className="text-sm font-semibold">{o.id}</p>
                    <p style={{ color: "#8A757C" }} className="text-xs mt-0.5">{o.date}, {o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                  </div>
                  <p style={{ color: "#3B2E36" }} className="text-sm font-semibold hidden sm:block">GHC {o.total}</p>
                  <span style={{ background: statusStyle[o.status].bg, color: statusStyle[o.status].color }} className="text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
                    {o.status}
                  </span>
                  <ChevronDown size={16} color="#8A757C" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} className="shrink-0" />
                </button>

                {open && (
                  <div style={{ borderColor: "#F2E1E7" }} className="border-t p-5">
                    <div className="flex flex-col gap-2 mb-4">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span style={{ color: "#5A4650" }}>{item.name} x {item.qty}</span>
                          <span style={{ color: "#3B2E36" }}>GHC {item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div style={{ color: "#8A757C" }} className="text-xs">
                        {o.status === "Delivered" && "Delivered to your address"}
                        {o.status === "Processing" && "Being prepared for delivery"}
                        {o.status === "Cancelled" && "This order was cancelled"}
                      </div>
                      <button style={{ color: "#C2698A" }} className="text-xs font-semibold flex items-center gap-1">
                        <FileText size={12} /> View invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}