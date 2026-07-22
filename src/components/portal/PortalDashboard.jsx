import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Package, Heart, ChevronRight, Clock } from "lucide-react";
import { myAppointments, myOrders, myWishlist, products } from "../../lib/data";

const orderStatusStyle = {
  Delivered: { bg: "#DCEFE3", color: "#3E7D5A" },
  Processing: { bg: "#F2E7CF", color: "#8A6C1F" },
  Cancelled: { bg: "#F3ECEE", color: "#A6949A" },
};

export default function PortalDashboard() {
  const upcoming = myAppointments.filter((a) => a.status === "Upcoming");
  const recentOrders = myOrders.slice(0, 2);
  const wishlistProducts = products.filter((p) => myWishlist.includes(p.id));

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-1">Welcome back</h1>
      <p style={{ color: "#8A757C" }} className="text-sm mb-8">Here is everything on your account at a glance.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Calendar, label: "Upcoming appointments", value: upcoming.length },
          { icon: Package, label: "Orders this year", value: myOrders.length },
          { icon: Heart, label: "Saved products", value: wishlistProducts.length },
        ].map((c) => (
          <div key={c.label} style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5">
            <div style={{ background: "#F7DDE6" }} className="w-9 h-9 rounded-xl flex items-center justify-center mb-3">
              <c.icon size={16} color="#8A4560" />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-1">{c.value}</p>
            <p style={{ color: "#8A757C" }} className="text-xs">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-base">Next appointment</p>
            <Link to="/account/appointments" style={{ color: "#C2698A" }} className="text-xs font-semibold flex items-center gap-0.5">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div>
              <p style={{ color: "#8A757C" }} className="text-sm mb-4">Nothing booked yet.</p>
              <Link to="/book" style={{ background: "#C2698A", color: "#FFF9FB" }} className="inline-block text-xs font-semibold px-4 py-2 rounded-full">Book now</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div style={{ background: "linear-gradient(155deg,#F2C9D8,#F7DDE6)" }} className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={20} color="#8A4560" />
              </div>
              <div>
                <p style={{ color: "#3B2E36" }} className="text-sm font-semibold">{upcoming[0].service}</p>
                <p style={{ color: "#8A757C" }} className="text-xs flex items-center gap-1 mt-0.5">
                  <Clock size={11} /> {upcoming[0].date}, {upcoming[0].time}
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-base">Recent orders</p>
            <Link to="/account/orders" style={{ color: "#C2698A" }} className="text-xs font-semibold flex items-center gap-0.5">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div>
                  <p style={{ color: "#3B2E36" }} className="text-xs font-medium">{o.id}</p>
                  <p style={{ color: "#8A757C" }} className="text-[11px]">{o.date}</p>
                </div>
                <span style={{ background: orderStatusStyle[o.status].bg, color: orderStatusStyle[o.status].color }} className="text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {wishlistProducts.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-base mb-4">Saved for later</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {wishlistProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ border: "1px solid #F2E1E7" }} className="rounded-xl p-3 flex items-center gap-3">
                <div style={{ background: "linear-gradient(155deg,#F7DDE6,#FFFFFF)" }} className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  <Package size={14} color="#8A4560" />
                </div>
                <div className="min-w-0">
                  <p style={{ color: "#3B2E36" }} className="text-xs font-medium truncate">{p.name}</p>
                  <p style={{ color: "#8A757C" }} className="text-[11px]">GHC {p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}