import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const denied = location.state?.denied;
  const from = location.state?.from?.pathname || "/admin";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "That email or password doesn't match our records." : error.message);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div style={{ background: "#241A20", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }} className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" style={{ color: "#8A757C" }} className="text-xs flex items-center gap-1 mb-8 w-fit">
          <ChevronLeft size={14} /> Back to site
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)" }} className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
            <Sparkles size={18} color="#FFF9FB" />
          </div>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", color: "#F7DDE6" }} className="text-xl italic block leading-tight">Beryl's</span>
            <span style={{ color: "#D6B56E", letterSpacing: "0.15em" }} className="text-[10px] font-semibold uppercase">Staff Portal</span>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-2xl mb-1">Staff sign in</h1>
        <p style={{ color: "#8A757C" }} className="text-sm mb-8">This area is for Beryl's Beauty Mark staff only.</p>

        {denied && !error && (
          <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-xl p-3 flex items-start gap-2 mb-5">
            <AlertCircle size={15} color="#E38B9A" className="mt-0.5 shrink-0" />
            <p style={{ color: "#E8B4BE" }} className="text-xs leading-relaxed">That account does not have staff access. Sign in with a staff account instead.</p>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-xl p-3 flex items-start gap-2 mb-5">
            <AlertCircle size={15} color="#E38B9A" className="mt-0.5 shrink-0" />
            <p style={{ color: "#E8B4BE" }} className="text-xs leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">Email</label>
            <div style={{ border: "1px solid rgba(255,255,255,0.12)", background: "#1B1216" }} className="flex items-center gap-2 rounded-xl px-3">
              <Mail size={14} color="#8A757C" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ color: "#F7EFF1" }}
                className="w-full text-sm py-2.5 outline-none bg-transparent"
              />
            </div>
          </div>
          <div>
            <label style={{ color: "#8A757C" }} className="text-xs block mb-1.5">Password</label>
            <div style={{ border: "1px solid rgba(255,255,255,0.12)", background: "#1B1216" }} className="flex items-center gap-2 rounded-xl px-3">
              <Lock size={14} color="#8A757C" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ color: "#F7EFF1" }}
                className="w-full text-sm py-2.5 outline-none bg-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: "#D6B56E", color: "#1B1216" }}
            className="text-sm font-semibold py-3 rounded-full mt-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in to staff portal"}
          </button>
        </form>

        <p style={{ color: "#6E5F65" }} className="text-xs text-center mt-8">
          Looking for your customer account? <Link to="/login" style={{ color: "#D6B56E" }}>Sign in here</Link> instead.
        </p>
      </div>
    </div>
  );
}