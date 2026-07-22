import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, X, Check, AlertCircle, EyeOff, Eye } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";
import { serviceCategories } from "../lib/data";

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = {
  name: "", category: serviceCategories[0]?.key || "braiding", description: "",
  prepTips: "", aftercare: "", durationLabel: "", priceMin: "", priceMax: "",
  tag: "", dailyCapacity: 6,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, object = editing
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) setLoadError(error.message);
    else setServices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openNew = () => {
    setForm(emptyForm);
    setEditing({});
    setSaveError("");
  };

  const openEdit = (s) => {
    setForm({
      name: s.name, category: s.category, description: s.description || "",
      prepTips: s.prep_tips || "", aftercare: s.aftercare || "", durationLabel: s.duration_label,
      priceMin: s.price_min, priceMax: s.price_max || "", tag: s.tag || "", dailyCapacity: s.daily_capacity,
    });
    setEditing(s);
    setSaveError("");
  };

  const save = async () => {
    if (!form.name.trim() || !form.durationLabel.trim() || !form.priceMin) {
      setSaveError("Name, duration, and starting price are required.");
      return;
    }
    setSaving(true);
    setSaveError("");

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description || null,
      prep_tips: form.prepTips || null,
      aftercare: form.aftercare || null,
      duration_label: form.durationLabel,
      price_min: Number(form.priceMin),
      price_max: form.priceMax ? Number(form.priceMax) : null,
      tag: form.tag || null,
      daily_capacity: Number(form.dailyCapacity) || 6,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("services").update(payload).eq("id", editing.id));
    } else {
      const id = slugify(form.name);
      ({ error } = await supabase.from("services").insert({ id, is_active: true, sort_order: services.length + 1, ...payload }));
    }

    setSaving(false);
    if (error) {
      setSaveError(error.message.includes("duplicate") ? "A service with a similar name already exists." : "Something went wrong saving, please try again.");
      return;
    }

    setEditing(null);
    fetchServices();
  };

  const toggleActive = async (s) => {
    setBusyId(s.id);
    await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
    setBusyId(null);
    fetchServices();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Manage your offerings</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Services</h1>
        </div>
        <button
          onClick={openNew}
          style={{ background: "#D6B56E", color: "#1B1216" }}
          className="text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5"
        >
          <Plus size={14} /> New service
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading services...</p>
      ) : loadError ? (
        <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-2xl p-6 text-center">
          <p style={{ color: "#E8B4BE" }} className="text-sm">{loadError}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)", opacity: s.is_active ? 1 : 0.55 }} className="rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <p style={{ color: "#F7EFF1" }} className="text-sm font-semibold">{s.name}</p>
                {!s.is_active && <span style={{ background: "rgba(255,255,255,0.08)", color: "#B29EA6" }} className="text-[10px] px-2 py-0.5 rounded-full shrink-0">Hidden</span>}
              </div>
              <p style={{ color: "#8A757C" }} className="text-xs mb-3">{s.category} • {s.duration_label}</p>
              <p style={{ color: "#D6B56E" }} className="text-sm font-semibold mb-4">GHC {s.price_min}{s.price_max ? ` to ${s.price_max}` : ""}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} style={{ background: "rgba(214,181,110,0.12)", color: "#D6B56E" }} className="text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5">
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => toggleActive(s)}
                  disabled={busyId === s.id}
                  style={{ background: "rgba(255,255,255,0.06)", color: "#B29EA6" }}
                  className="text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1.5 disabled:opacity-50"
                >
                  {s.is_active ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ background: "rgba(0,0,0,0.6)" }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-3xl p-6 sm:p-7 w-full max-w-lg my-8">
            <div className="flex items-center justify-between mb-5">
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg">{editing.id ? "Edit service" : "New service"}</p>
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
                <select value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]">
                  {serviceCategories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Tag, example Popular</label>
                <input value={form.tag} onChange={(e) => setForm((v) => ({ ...v, tag: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Duration, example 2 to 4 hrs</label>
                <input value={form.durationLabel} onChange={(e) => setForm((v) => ({ ...v, durationLabel: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Daily capacity</label>
                <input type="number" min="1" value={form.dailyCapacity} onChange={(e) => setForm((v) => ({ ...v, dailyCapacity: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Price from, GHC</label>
                <input type="number" value={form.priceMin} onChange={(e) => setForm((v) => ({ ...v, priceMin: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Price to, GHC, optional</label>
                <input type="number" value={form.priceMax} onChange={(e) => setForm((v) => ({ ...v, priceMax: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]" />
              </div>
              <div className="sm:col-span-2">
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none resize-none h-16 focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Preparation tips</label>
                <textarea value={form.prepTips} onChange={(e) => setForm((v) => ({ ...v, prepTips: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none resize-none h-16 focus:border-[#D6B56E]" />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Aftercare</label>
                <textarea value={form.aftercare} onChange={(e) => setForm((v) => ({ ...v, aftercare: e.target.value }))}
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
              <Check size={15} /> {saving ? "Saving..." : "Save service"}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}