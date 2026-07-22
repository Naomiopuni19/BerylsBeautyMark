import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, X, Check, AlertCircle, EyeOff, Eye, Package } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = { name: "", category: "hair care", description: "", howToUse: "", price: "", stockQuantity: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) setLoadError(error.message);
    else setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openNew = () => {
    setForm(emptyForm);
    setEditing({});
    setSaveError("");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, category: p.category || "hair care", description: p.description || "",
      howToUse: p.how_to_use || "", price: p.price, stockQuantity: p.stock_quantity,
    });
    setEditing(p);
    setSaveError("");
  };

  const save = async () => {
    if (!form.name.trim() || !form.price) {
      setSaveError("Name and price are required.");
      return;
    }
    setSaving(true);
    setSaveError("");

    const payload = {
      name: form.name,
      category: form.category || null,
      description: form.description || null,
      how_to_use: form.howToUse || null,
      price: Number(form.price),
      stock_quantity: Number(form.stockQuantity) || 0,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    } else {
      const id = slugify(form.name);
      ({ error } = await supabase.from("products").insert({ id, is_active: true, rating: 5.0, ...payload }));
    }

    setSaving(false);
    if (error) {
      setSaveError(error.message.includes("duplicate") ? "A product with a similar name already exists." : "Something went wrong saving, please try again.");
      return;
    }

    setEditing(null);
    fetchProducts();
  };

  const toggleActive = async (p) => {
    setBusyId(p.id);
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    setBusyId(null);
    fetchProducts();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Manage the shop</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Products</h1>
        </div>
        <button
          onClick={openNew}
          style={{ background: "#D6B56E", color: "#1B1216" }}
          className="text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5"
        >
          <Plus size={14} /> New product
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading products...</p>
      ) : loadError ? (
        <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "#E8B4BE" }} className="text-sm">{loadError}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const lowStock = p.stock_quantity <= 5;
            return (
              <div key={p.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)", opacity: p.is_active ? 1 : 0.55 }} className="rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <p style={{ color: "#F7EFF1" }} className="text-sm font-semibold">{p.name}</p>
                  {!p.is_active && <span style={{ background: "rgba(255,255,255,0.08)", color: "#B29EA6" }} className="text-[10px] px-2 py-0.5 rounded-full shrink-0">Hidden</span>}
                </div>
                <p style={{ color: "#8A757C" }} className="text-xs mb-3">{p.category || "Uncategorized"}</p>
                <div className="flex items-center justify-between mb-4">
                  <p style={{ color: "#D6B56E" }} className="text-sm font-semibold">GHC {p.price}</p>
                  <span style={{ color: lowStock ? "#E38B9A" : "#8A757C" }} className="text-xs flex items-center gap-1">
                    <Package size={12} /> {p.stock_quantity === 0 ? "Out of stock" : `${p.stock_quantity} in stock`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} style={{ background: "rgba(214,181,110,0.12)", color: "#D6B56E" }} className="text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5">
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => toggleActive(p)}
                    disabled={busyId === p.id}
                    style={{ background: "rgba(255,255,255,0.06)", color: "#B29EA6" }}
                    className="text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {p.is_active ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div style={{ background: "rgba(0,0,0,0.6)" }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-3xl p-6 sm:p-7 w-full max-w-lg my-8">
            <div className="flex items-center justify-between mb-5">
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg">{editing.id ? "Edit product" : "New product"}</p>
              <button onClick={() => setEditing(null)} style={{ color: "#8A757C" }}><X size={18} /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Name</label>
                <input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Category</label>
                <input value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Price, GHC</label>
                <input type="number" value={form.price} onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div className="sm:col-span-2">
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Stock quantity</label>
                <input type="number" min="0" value={form.stockQuantity} onChange={(e) => setForm((v) => ({ ...v, stockQuantity: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div className="sm:col-span-2">
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none resize-none h-16 focus:border-[#D6B56E]" />
              </div>
              <div className="sm:col-span-2">
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">How to use</label>
                <textarea value={form.howToUse} onChange={(e) => setForm((v) => ({ ...v, howToUse: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none resize-none h-16 focus:border-[#D6B56E]" />
              </div>
            </div>

            {saveError && (
              <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-xl p-3 flex items-start gap-2 mb-4">
                <AlertCircle size={14} color="#E38B9A" className="mt-0.5 shrink-0" />
                <p style={{ color: "#E8B4BE" }} className="text-xs leading-relaxed">{saveError}</p>
              </div>
            )}

            <p style={{ color: "#6E5F65" }} className="text-[11px] mb-4">Photos are managed separately, from Media Library once this is saved.</p>

            <button onClick={save} disabled={saving}
              style={{ background: "#D6B56E", color: "#1B1216" }}
              className="text-sm font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-50">
              <Check size={15} /> {saving ? "Saving..." : "Save product"}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}