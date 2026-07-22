import React, { useState, useEffect, useCallback } from "react";
import { Package, Plus, AlertTriangle } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restocking, setRestocking] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: productData }, { data: movementData }] = await Promise.all([
      supabase.from("products").select("*").order("stock_quantity"),
      supabase.from("stock_movements").select("*, products(name)").order("created_at", { ascending: false }).limit(15),
    ]);
    setProducts(productData || []);
    setMovements(movementData || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const submitRestock = async () => {
    const amount = Number(restockAmount);
    if (!amount || amount <= 0) return;
    setSaving(true);

    const product = products.find((p) => p.id === restocking);
    await supabase.from("products").update({ stock_quantity: product.stock_quantity + amount }).eq("id", restocking);
    await supabase.from("stock_movements").insert({ product_id: restocking, change_qty: amount, reason: "restock" });

    setSaving(false);
    setRestocking(null);
    setRestockAmount("");
    fetchAll();
  };

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Track stock</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Inventory</h1>
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading inventory...</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="lg:col-span-2 rounded-2xl p-5 sm:p-6">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-5">Stock levels</p>
            <div className="flex flex-col gap-4">
              {products.map((p) => {
                const low = p.stock_quantity <= 5;
                const pct = Math.min(100, (p.stock_quantity / 30) * 100);
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ color: "#F7EFF1" }} className="text-sm">{p.name}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: low ? "#E38B9A" : "#B29EA6" }} className="text-xs flex items-center gap-1">
                          {low && <AlertTriangle size={11} />} {p.stock_quantity === 0 ? "Out of stock" : `${p.stock_quantity} left`}
                        </span>
                        <button
                          onClick={() => { setRestocking(p.id); setRestockAmount(""); }}
                          style={{ background: "rgba(214,181,110,0.15)", color: "#D6B56E" }}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                        >
                          <Plus size={11} /> Restock
                        </button>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.08)" }} className="w-full h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%`, background: low ? "#E38B9A" : "#D6B56E" }} className="h-full rounded-full" />
                    </div>

                    {restocking === p.id && (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          min="1"
                          autoFocus
                          value={restockAmount}
                          onChange={(e) => setRestockAmount(e.target.value)}
                          placeholder="Quantity to add"
                          style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                          className="text-xs rounded-lg px-3 py-2 outline-none focus:border-[#D6B56E] w-32"
                        />
                        <button onClick={submitRestock} disabled={saving} style={{ background: "#D6B56E", color: "#1B1216" }} className="text-xs font-semibold px-3 py-2 rounded-full disabled:opacity-50">
                          {saving ? "Saving..." : "Confirm"}
                        </button>
                        <button onClick={() => setRestocking(null)} style={{ color: "#8A757C" }} className="text-xs">Cancel</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg mb-5">Recent movement</p>
            {movements.length === 0 ? (
              <p style={{ color: "#8A757C" }} className="text-sm">No stock changes yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {movements.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div style={{ background: m.change_qty > 0 ? "rgba(127,203,156,0.15)" : "rgba(227,139,154,0.15)" }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                      <Package size={13} color={m.change_qty > 0 ? "#7FCB9C" : "#E38B9A"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: "#F7EFF1" }} className="text-xs truncate">{m.products?.name || "Product"}</p>
                      <p style={{ color: "#8A757C" }} className="text-[11px] capitalize">{m.reason}</p>
                    </div>
                    <span style={{ color: m.change_qty > 0 ? "#7FCB9C" : "#E38B9A" }} className="text-xs font-semibold shrink-0">
                      {m.change_qty > 0 ? "+" : ""}{m.change_qty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}