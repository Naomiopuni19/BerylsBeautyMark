import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Trash2, Package, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

const DELIVERY_FEE = 15;

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const navigate = useNavigate();

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "BERYL10") {
      setApplied({ code: "BERYL10", percent: 10 });
    } else {
      setApplied({ code: coupon, invalid: true });
    }
  };

  const discount = applied && !applied.invalid ? Math.round(subtotal * (applied.percent / 100)) : 0;
  const total = subtotal === 0 ? 0 : subtotal - discount + DELIVERY_FEE;

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Continue shopping
        </Link>

        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-3xl mb-8">Your cart</h1>

        {items.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-12 text-center">
            <div style={{ background: "#F7DDE6" }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={22} color="#8A4560" />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-2">Your cart is empty</p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-6">Add something from the shop to see it here.</p>
            <Link to="/" style={{ background: "#C2698A", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
              Visit the shop
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-4 flex items-center gap-4">
                  <div style={{ background: "linear-gradient(155deg,#F7DDE6,#FFFFFF)" }} className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={20} color="#8A4560" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-sm hover:underline block truncate">{item.name}</Link>
                    <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs">GHC {item.price} each</p>
                  </div>
                  <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center rounded-full overflow-hidden shrink-0">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center" style={{ color: "#3B2E36" }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="w-6 text-center text-xs">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center" style={{ color: "#3B2E36" }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold w-16 text-right shrink-0">GHC {item.price * item.qty}</p>
                  <button onClick={() => removeItem(item.id)} style={{ color: "#C2698A" }} className="shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-6 h-fit sticky top-8">
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-5">Order summary</p>

              <div className="flex items-center gap-2 mb-5">
                <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center flex-1 rounded-full px-3">
                  <Tag size={13} color="#8A757C" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                    className="flex-1 text-xs px-2 py-2.5 outline-none bg-transparent"
                  />
                </div>
                <button onClick={applyCoupon} style={{ background: "#F7DDE6", color: "#8A4560", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold px-4 py-2.5 rounded-full">
                  Apply
                </button>
              </div>
              {applied && (
                <p style={{ color: applied.invalid ? "#C2698A" : "#3E7D5A", fontFamily: "'Poppins', sans-serif" }} className="text-[11px] mb-4">
                  {applied.invalid ? "That code is not valid" : `${applied.code} applied, 10 percent off`}
                </p>
              )}

              <div style={{ borderColor: "#F2E1E7", fontFamily: "'Poppins', sans-serif" }} className="border-t pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#8A757C" }}>Subtotal</span>
                  <span style={{ color: "#3B2E36" }}>GHC {subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#8A757C" }}>Discount</span>
                    <span style={{ color: "#3E7D5A" }}>minus GHC {discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#8A757C" }}>Delivery</span>
                  <span style={{ color: "#3B2E36" }}>GHC {DELIVERY_FEE}</span>
                </div>
                <div style={{ borderColor: "#F2E1E7" }} className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span style={{ color: "#3B2E36" }}>Total</span>
                  <span style={{ color: "#3B2E36" }}>GHC {total}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }}
                className="w-full text-sm font-semibold py-3 rounded-full mt-5"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}