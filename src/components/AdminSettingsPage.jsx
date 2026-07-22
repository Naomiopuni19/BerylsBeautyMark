import React, { useState, useEffect } from "react";
import { Check, AlertCircle, Building2, Lock } from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [passwords, setPasswords] = useState({ next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    supabase.from("business_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      setForm(data || {
        business_name: "", tagline: "", address: "", phone: "", whatsapp: "", email: "", hours_weekday: "", hours_sunday: "",
      });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("business_settings").update({
      business_name: form.business_name,
      tagline: form.tagline,
      address: form.address,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      hours_weekday: form.hours_weekday,
      hours_sunday: form.hours_sunday,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);

    setSaving(false);
    if (error) {
      setError("Could not save, please try again.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = async () => {
    setPwError("");
    if (passwords.next.length < 6) {
      setPwError("New password needs to be at least 6 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.next });
    setPwSaving(false);
    if (error) {
      setPwError(error.message);
      return;
    }
    setPwSaved(true);
    setPasswords({ next: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const field = (key, label, placeholder) => (
    <div>
      <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">{label}</label>
      <input
        value={form[key] || ""}
        onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
        className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]"
      />
    </div>
  );

  return (
    <AdminShell>
      <div className="mb-6 sm:mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Business info and account</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Settings</h1>
      </div>

      {loading ? (
        <p style={{ color: "#8A757C" }} className="text-sm py-10 text-center">Loading settings...</p>
      ) : (
        <div className="flex flex-col gap-5 max-w-2xl">
          <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 size={15} color="#D6B56E" />
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg">Business info</p>
            </div>
            <p style={{ color: "#6E5F65" }} className="text-xs mb-5">This shows on your footer and contact page, changes go live immediately.</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {field("business_name", "Business name")}
              {field("email", "Email")}
              {field("phone", "Phone")}
              {field("whatsapp", "WhatsApp number, digits only, with country code")}
              {field("hours_weekday", "Opening hours, Monday to Saturday")}
              {field("hours_sunday", "Opening hours, Sunday")}
              <div className="sm:col-span-2">{field("address", "Address")}</div>
              <div className="sm:col-span-2">
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Tagline</label>
                <textarea
                  value={form.tagline || ""}
                  onChange={(e) => setForm((v) => ({ ...v, tagline: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none resize-none h-16 focus:border-[#D6B56E]"
                />
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-xl p-3 flex items-start gap-2 mb-4">
                <AlertCircle size={14} color="#E38B9A" className="mt-0.5 shrink-0" />
                <p style={{ color: "#E8B4BE" }} className="text-xs leading-relaxed">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={save} disabled={saving} style={{ background: "#D6B56E", color: "#1B1216" }} className="text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-50">
                {saving ? "Saving..." : "Save changes"}
              </button>
              {saved && <span style={{ color: "#7FCB9C" }} className="text-xs flex items-center gap-1"><Check size={13} /> Saved</span>}
            </div>
          </div>

          <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock size={15} color="#D6B56E" />
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-lg">Change your password</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">New password</label>
                <input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords((v) => ({ ...v, next: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]"
                />
              </div>
              <div>
                <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((v) => ({ ...v, confirm: e.target.value }))}
                  style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                  className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]"
                />
              </div>
            </div>

            {pwError && (
              <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-xl p-3 flex items-start gap-2 mb-4">
                <AlertCircle size={14} color="#E38B9A" className="mt-0.5 shrink-0" />
                <p style={{ color: "#E8B4BE" }} className="text-xs leading-relaxed">{pwError}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={changePassword} disabled={pwSaving} style={{ border: "1px solid #D6B56E", color: "#D6B56E" }} className="text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-50">
                {pwSaving ? "Updating..." : "Update password"}
              </button>
              {pwSaved && <span style={{ color: "#7FCB9C" }} className="text-xs flex items-center gap-1"><Check size={13} /> Updated</span>}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}