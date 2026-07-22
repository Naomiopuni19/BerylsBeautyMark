import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Check, Smartphone, CreditCard as CardIcon, Package, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { payWithPaystack } from "../lib/paystack";

const DELIVERY_FEE = 15;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.fullName || "", phone: user?.phone || "", address: "", city: "Kumasi" });
  const [payment, setPayment] = useState("momo");
  const [placed, setPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal + (items.length ? DELIVERY_FEE : 0);
  const canSubmit = form.name && form.phone && form.address && items.length > 0;

  const completeOrder = async () => {
    setProcessing(true);
    setError("");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        status: "pending",
        total_amount: total,
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_address: form.address,
        shipping_city: form.city,
      })
      .select()
      .single();

    if (orderError || !order) {
      setProcessing(false);
      setError("Could not start your order, please try again.");
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.qty,
      unit_price: item.price,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      setProcessing(false);
      setError("Could not save your order items, please try again.");
      return;
    }

    payWithPaystack({
      email: user.email,
      amountGHS: total,
      metadata: { order_id: order.id, type: "order" },
      onSuccess: async (response) => {
        await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);
        await supabase.from("payments").insert({
          order_id: order.id,
          amount: total,
          provider: payment === "momo" ? "momo" : "card",
          status: "success",
          reference: response.reference,
        });
        setProcessing(false);
        clearCart();
        setPlaced(true);
      },
      onClose: () => {
        setProcessing(false);
        setError("Payment was not completed. Your order is saved, you can try paying again from your account.");
      },
    });
  };

  if (placed) {
    return (
      <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-10 text-center max-w-md">
          <div style={{ background: "#DCEFE3" }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={26} color="#3E7D5A" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-2">Order placed</h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-6">
            Thank you, {form.name.split(" ")[0]}. We are preparing your order for delivery to {form.address}.
          </p>
          <Link to="/" style={{ background: "#C2698A", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <Link to="/cart" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to cart
        </Link>

        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-3xl mb-8">Checkout</h1>

        {items.length === 0 ? (
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm">
            Your cart is empty, <Link to="/" style={{ color: "#C2698A" }}>visit the shop</Link> before checking out.
          </p>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="flex flex-col gap-5">
              <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold mb-4">Shipping details</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full name", placeholder: "Ama Serwaa" },
                    { key: "phone", label: "Phone number", placeholder: "024 000 0000" },
                    { key: "city", label: "City", placeholder: "Kumasi" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">{f.label}</label>
                      <input
                        value={form[f.key]}
                        onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                        className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Delivery address</label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))}
                      placeholder="House number, street, landmark"
                      style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                      className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
                    />
                  </div>
                </div>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold mb-4">Payment method</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { key: "momo", label: "Mobile money", icon: Smartphone },
                    { key: "card", label: "Debit or credit card", icon: CardIcon },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPayment(p.key)}
                      style={{ border: payment === p.key ? "1.5px solid #C2698A" : "1px solid #F2E1E7", background: payment === p.key ? "#FFF9FB" : "#FFFFFF" }}
                      className="rounded-xl p-4 flex items-center gap-3 text-left"
                    >
                      <p.icon size={17} color="#8A4560" />
                      <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-6 h-fit sticky top-8">
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-5">Order summary</p>
              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div style={{ background: "linear-gradient(155deg,#F7DDE6,#FFFFFF)" }} className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                      <Package size={14} color="#8A4560" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-xs truncate">{item.name}</p>
                      <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-[11px]">Qty {item.qty}</p>
                    </div>
                    <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-xs font-semibold">GHC {item.price * item.qty}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderColor: "#F2E1E7", fontFamily: "'Poppins', sans-serif" }} className="border-t pt-4 flex flex-col gap-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#8A757C" }}>Subtotal</span>
                  <span style={{ color: "#3B2E36" }}>GHC {subtotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#8A757C" }}>Delivery</span>
                  <span style={{ color: "#3B2E36" }}>GHC {DELIVERY_FEE}</span>
                </div>
                <div style={{ borderColor: "#F2E1E7" }} className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span style={{ color: "#3B2E36" }}>Total</span>
                  <span style={{ color: "#3B2E36" }}>GHC {total}</span>
                </div>
              </div>

              {error && (
                <div style={{ background: "#FBEAEA", border: "1px solid #F0C9C9" }} className="rounded-xl p-3 flex items-start gap-2 mb-4">
                  <AlertCircle size={14} color="#C2537A" className="mt-0.5 shrink-0" />
                  <p style={{ color: "#8A3A50", fontFamily: "'Poppins', sans-serif" }} className="text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <button
                onClick={completeOrder}
                disabled={!canSubmit || processing}
                style={{
                  background: canSubmit ? "linear-gradient(135deg,#D98BA3,#C2698A)" : "#F0EBEC",
                  color: canSubmit ? "#FFF9FB" : "#A6949A",
                  fontFamily: "'Poppins', sans-serif",
                }}
                className="w-full text-sm font-semibold py-3 rounded-full disabled:opacity-60"
              >
                {processing ? "Processing..." : `Pay GHC ${total}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}