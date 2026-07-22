import React, { useState } from "react";
import { UserRound, Lock, CreditCard, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setError("");
    setSaving(true);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (error) {
      setError("Could not save your changes, please try again.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-6">Profile</h1>

      <div className="flex flex-col gap-5">
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserRound size={15} color="#8A4560" />
            <p style={{ color: "#3B2E36" }} className="text-sm font-semibold">Personal details</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">Full name</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm((v) => ({ ...v, fullName: e.target.value }))}
                style={{ border: "1px solid #F2E1E7", color: "#3B2E36" }}
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
              />
            </div>
            <div>
              <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">Phone number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
                style={{ border: "1px solid #F2E1E7", color: "#3B2E36" }}
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
              />
            </div>
            <div>
              <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">Email</label>
              <input
                value={form.email}
                readOnly
                style={{ border: "1px solid #F2E1E7", color: "#A6949A", background: "#FAF6F7" }}
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none cursor-not-allowed"
              />
              <p style={{ color: "#B29EA6" }} className="text-[11px] mt-1">Changing email requires a separate confirmation step, not wired up yet.</p>
            </div>
            <div>
              <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))}
                style={{ border: "1px solid #F2E1E7", color: "#3B2E36" }}
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
              />
              <p style={{ color: "#B29EA6" }} className="text-[11px] mt-1">Not saved yet, the address column needs to be added to the database.</p>
            </div>
          </div>
          {error && (
            <div style={{ background: "#FBEAEA", border: "1px solid #F0C9C9" }} className="rounded-xl p-3 flex items-start gap-2 mb-4">
              <AlertCircle size={14} color="#C2537A" className="mt-0.5 shrink-0" />
              <p style={{ color: "#8A3A50" }} className="text-xs leading-relaxed">{error}</p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB" }}
              className="text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span style={{ color: "#3E7D5A" }} className="text-xs flex items-center gap-1">
                <Check size={13} /> Saved
              </span>
            )}
          </div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={15} color="#8A4560" />
            <p style={{ color: "#3B2E36" }} className="text-sm font-semibold">Change password</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { key: "current", label: "Current password" },
              { key: "next", label: "New password" },
              { key: "confirm", label: "Confirm new password" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">{f.label}</label>
                <input
                  type="password"
                  value={passwords[f.key]}
                  onChange={(e) => setPasswords((v) => ({ ...v, [f.key]: e.target.value }))}
                  style={{ border: "1px solid #F2E1E7", color: "#3B2E36" }}
                  className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
                />
              </div>
            ))}
          </div>
          <button style={{ border: "1px solid #C2698A", color: "#8A4560" }} className="text-sm font-semibold px-6 py-2.5 rounded-full">
            Update password
          </button>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={15} color="#8A4560" />
            <p style={{ color: "#3B2E36" }} className="text-sm font-semibold">Saved payment methods</p>
          </div>
          <div style={{ border: "1px solid #F2E1E7" }} className="rounded-xl p-4 flex items-center justify-between">
            <div>
              <p style={{ color: "#3B2E36" }} className="text-sm">Mobile money, ending 1234</p>
              <p style={{ color: "#8A757C" }} className="text-xs">Default payment method</p>
            </div>
            <span style={{ background: "#F2E7CF", color: "#8A6C1F" }} className="text-[10px] font-semibold px-2.5 py-1 rounded-full">Default</span>
          </div>
        </div>
      </div>
    </div>
  );
}