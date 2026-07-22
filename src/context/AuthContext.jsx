import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

function formatMemberSince(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    setUser({
      id: authUser.id,
      email: authUser.email,
      fullName: profile?.full_name || "",
      phone: profile?.phone || "",
      role: profile?.role || "customer",
      memberSince: formatMemberSince(profile?.created_at),
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user || null).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Only full_name and phone actually exist on the profiles table right now.
  // Email changes need supabase.auth.updateUser separately, since email lives
  // on auth.users, not profiles. Address is not a column yet, add one via a
  // schema migration before trying to persist it.
  const updateProfile = async (fields) => {
    if (!user) return { error: new Error("Not signed in") };
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fields.fullName, phone: fields.phone })
      .eq("id", user.id);

    if (!error) {
      setUser((u) => ({ ...u, fullName: fields.fullName, phone: fields.phone }));
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}