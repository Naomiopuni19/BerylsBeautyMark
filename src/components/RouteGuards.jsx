import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center">
      <div style={{ borderColor: "#F2E1E7", borderTopColor: "#C2698A" }} className="w-8 h-8 rounded-full border-4 animate-spin" />
    </div>
  );
}

function AdminLoadingScreen() {
  return (
    <div style={{ background: "#241A20", minHeight: "100vh" }} className="flex items-center justify-center">
      <div style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#D6B56E" }} className="w-8 h-8 rounded-full border-4 animate-spin" />
    </div>
  );
}

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AdminLoadingScreen />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (user.role !== "admin") return <Navigate to="/admin/login" state={{ from: location, denied: true }} replace />;
  return children;
}