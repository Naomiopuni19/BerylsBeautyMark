import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/account";

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
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-8 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <span style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36", fontWeight: 700 }} className="text-2xl italic block mb-1">Beryl's</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-1">Welcome back</h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-8">Sign in to book, track orders, and manage your account.</p>

        {error && (
          <div style={{ background: "#FBEAEA", border: "1px solid #F0C9C9" }} className="rounded-xl p-3 flex items-start gap-2 mb-5">
            <AlertCircle size={15} color="#C2537A" className="mt-0.5 shrink-0" />
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A3A50" }} className="text-xs leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Email</label>
            <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center gap-2 rounded-xl px-3">
              <Mail size={14} color="#8A757C" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                className="w-full text-sm py-2.5 outline-none bg-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }}
            className="text-sm font-semibold py-3 rounded-full mt-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm text-center mt-6">
          New here? <Link to="/register" style={{ color: "#C2698A" }} className="font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}