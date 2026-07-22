import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Mail, Lock, UserRound, AlertCircle, MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password needs to be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { data, error } = await signUp(form.email, form.password, form.fullName);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data?.session) {
      navigate("/account", { replace: true });
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) {
    return (
      <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center px-6 py-12">
        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="w-full max-w-sm rounded-3xl p-8 text-center">
          <div style={{ background: "#F7DDE6" }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailCheck size={22} color="#8A4560" />
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-xl mb-2">Check your email</p>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm leading-relaxed mb-6">
            We sent a confirmation link to {form.email}. Click it to activate your account, then come back and sign in.
          </p>
          <Link to="/login" style={{ background: "#C2698A", color: "#FFF9FB" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-8 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <span style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36", fontWeight: 700 }} className="text-2xl italic block mb-1">Beryl's</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-1">Create your account</h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-8">Book appointments and track orders in one place.</p>

        {error && (
          <div style={{ background: "#FBEAEA", border: "1px solid #F0C9C9" }} className="rounded-xl p-3 flex items-start gap-2 mb-5">
            <AlertCircle size={15} color="#C2537A" className="mt-0.5 shrink-0" />
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A3A50" }} className="text-xs leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Full name</label>
            <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center gap-2 rounded-xl px-3">
              <UserRound size={14} color="#8A757C" />
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm((v) => ({ ...v, fullName: e.target.value }))}
                style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                className="w-full text-sm py-2.5 outline-none bg-transparent"
              />
            </div>
          </div>
          <div>
            <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Email</label>
            <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center gap-2 rounded-xl px-3">
              <Mail size={14} color="#8A757C" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                className="w-full text-sm py-2.5 outline-none bg-transparent"
              />
            </div>
          </div>
          <div>
            <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Password</label>
            <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center gap-2 rounded-xl px-3">
              <Lock size={14} color="#8A757C" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
                style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                className="w-full text-sm py-2.5 outline-none bg-transparent"
              />
            </div>
            <p style={{ color: "#B29EA6", fontFamily: "'Poppins', sans-serif" }} className="text-[11px] mt-1.5">At least 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }}
            className="text-sm font-semibold py-3 rounded-full mt-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm text-center mt-6">
          Already have an account? <Link to="/login" style={{ color: "#C2698A" }} className="font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}