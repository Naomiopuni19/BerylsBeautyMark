import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Heart, ShoppingBag, Star, Calendar, ChevronRight, Instagram,
  ShieldCheck, Award, Users, Gem, Sparkles, Scissors, Package, Check,
  Camera, X, UserRound, Menu, Home as HomeIcon, Grid3x3, MapPin, Phone, Mail
} from "lucide-react";
import { useServices } from "../hooks/useServices";
import { useProducts } from "../hooks/useProducts";
import { useHeroSlides } from "../hooks/useHeroSlides";
import { useApprovedReviews } from "../hooks/useApprovedReviews";
import { useBusinessSettings } from "../hooks/useBusinessSettings";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { sanitizeFileName } from "../lib/sanitizeFileName";
import NotificationBell from "./NotificationBell";
import SearchModal from "./SearchModal";

function Sparkle({ style }) {
  return (
    <svg style={style} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#D6B56E" opacity="0.7" />
    </svg>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <svg width="90" height="14" viewBox="0 0 90 14" fill="none">
        <path d="M0 7 Q 15 0, 30 7 T 60 7 T 90 7" stroke="#D6B56E" strokeWidth="1.4" fill="none" />
      </svg>
      <Gem size={13} color="#D6B56E" strokeWidth={1.5} />
      <svg width="90" height="14" viewBox="0 0 90 14" fill="none">
        <path d="M0 7 Q 15 14, 30 7 T 60 7 T 90 7" stroke="#D6B56E" strokeWidth="1.4" fill="none" />
      </svg>
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }}
       className="text-xs font-semibold uppercase mb-3">
      {children}
    </p>
  );
}

function PrimaryButton({ children, big, style, ...rest }) {
  return (
    <button
      {...rest}
      style={{
        background: "linear-gradient(135deg, #D98BA3, #C2698A)",
        color: "#FFF9FB",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 10px 24px rgba(194,105,138,0.35)",
        ...style,
      }}
      className={`rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${big ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, ...rest }) {
  return (
    <button
      {...rest}
      style={{ border: "1px solid #D6B56E", color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }}
      className="rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:bg-white"
    >
      {children}
    </button>
  );
}

function Hero() {
  const { heroSlides, loading } = useHeroSlides();
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (heroSlides.length === 0) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer.current);
  }, [heroSlides]);

  const goTo = (i) => {
    clearInterval(timer.current);
    setIndex(i);
    timer.current = setInterval(() => setIndex((j) => (j + 1) % heroSlides.length), 6000);
  };

  if (loading || heroSlides.length === 0) {
    return <section style={{ background: "#F7DDE6", height: "520px" }} className="animate-pulse" />;
  }

  const slide = heroSlides[index];

  return (
    <section className="relative overflow-hidden" style={{ background: "radial-gradient(120% 100% at 80% 0%, #F7DDE6 0%, #FFF9FB 55%, #FFF9FB 100%)" }}>
      <div style={{ background: "radial-gradient(circle, rgba(214,181,110,0.25), transparent 70%)" }} className="absolute w-[420px] h-[420px] rounded-full -top-20 -right-20" />
      <div style={{ background: "radial-gradient(circle, rgba(242,201,216,0.6), transparent 70%)" }} className="absolute w-[360px] h-[360px] rounded-full bottom-0 left-0" />
      <Sparkle style={{ position: "absolute", top: "18%", left: "44%" }} />
      <Sparkle style={{ position: "absolute", top: "60%", left: "40%", transform: "scale(0.7)" }} />
      <Sparkle style={{ position: "absolute", top: "30%", left: "56%", transform: "scale(0.55)" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-24 grid md:grid-cols-2 gap-14 items-center relative">
        <div key={index} style={{ animation: "fadeSlide 0.6s ease" }}>
          <Eyebrow>Premium hair studio in Kumasi</Eyebrow>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36", lineHeight: 1.08 }} className="text-5xl md:text-6xl font-medium mb-6">
            {slide.headline}<br />
            <span style={{ fontStyle: "italic", color: "#C2698A" }}>{slide.accent}</span>
          </h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-base mb-9 max-w-md leading-relaxed">
            {slide.subtext}
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <PrimaryButton big onClick={() => navigate("/book")}>Book Appointment</PrimaryButton>
            <GhostButton onClick={() => navigate("/services")}>Explore Services <ChevronRight size={16} /></GhostButton>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {["#F2C9D8", "#D6B56E", "#C2698A", "#F7DDE6"].map((c, i) => (
                <div key={i} style={{ background: c, borderColor: "#FFF9FB" }} className="w-9 h-9 rounded-full border-2" />
              ))}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#D6B56E" color="#D6B56E" />)}
                <span style={{ color: "#3B2E36" }} className="text-xs font-semibold ml-1">4.9</span>
              </div>
              <p style={{ color: "#8A757C" }} className="text-xs">Trusted by 10,000 plus happy clients</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2.5rem] aspect-[4/5] w-full max-w-md mx-auto relative overflow-hidden shadow-2xl">
            <img
              key={slide.image}
              src={slide.image}
              alt="Beryl's Beauty Mark client style"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ animation: "fadeSlide 0.6s ease" }}
            />
            <div style={{ background: "linear-gradient(180deg, rgba(59,46,54,0) 40%, rgba(59,46,54,0.55) 100%)" }} className="absolute inset-0" />
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 380">
              <path d="M60 40 C 100 10, 200 10, 240 60 C 260 90, 250 140, 220 170 C 260 200, 260 260, 220 300 C 180 340, 110 340, 80 300 C 50 260, 60 200, 90 170 C 60 140, 50 90, 60 40 Z" fill="none" stroke="#FFF9FB" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Show slide ${i + 1}`}
                  style={{ background: i === index ? "#FFF9FB" : "rgba(255,249,251,0.5)", width: i === index ? 22 : 8 }}
                  className="h-2 rounded-full transition-all duration-300"
                />
              ))}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", boxShadow: "0 20px 50px rgba(59,46,54,0.15)" }} className="absolute -bottom-8 -left-6 md:-left-10 rounded-3xl p-6 w-64">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-4">Book with ease</p>
            {[
              { icon: Scissors, label: "Choose your service" },
              { icon: Calendar, label: "Pick date and time" },
              { icon: ShieldCheck, label: "Pay securely" },
              { icon: Check, label: "You are all set" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <div style={{ background: "#F7DDE6" }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  <step.icon size={14} color="#C2698A" />
                </div>
                <span style={{ fontFamily: "'Poppins', sans-serif", color: "#5A4650" }} className="text-xs">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoReviewSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { reviews } = useApprovedReviews();

  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const openForm = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }
    setShowForm(true);
  };

  const pickFile = (files) => {
    const picked = files && files[0];
    if (!picked || !picked.type.startsWith("image/")) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const submit = async () => {
    if (!file || !user) return;
    setSubmitting(true);
    setError("");

    const path = `reviews/${user.id}-${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage.from("salon-media").upload(path, file);

    if (uploadError) {
      setSubmitting(false);
      setError("Could not upload your photo, please try again.");
      return;
    }

    const { data: urlData } = supabase.storage.from("salon-media").getPublicUrl(path);

    const { error: insertError } = await supabase.from("customer_reviews").insert({
      customer_id: user.id,
      photo_url: urlData.publicUrl,
      rating,
      comment,
    });

    setSubmitting(false);

    if (insertError) {
      if (insertError.message.includes("row-level security")) {
        setError("Photo reviews open up once you've completed an appointment with us, we can't wait to see yours then.");
      } else {
        setError("Something went wrong submitting your review, please try again.");
      }
      return;
    }

    setSubmitted(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setFile(null);
    setPreview(null);
    setComment("");
    setRating(5);
    setError("");
  };

  return (
    <section id="reviews" style={{ background: "#FFFFFF" }} className="py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
        <Eyebrow>Client voices</Eyebrow>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-4">Real results, from real clients</h2>
        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-10 max-w-md mx-auto">
          Every finished look here was uploaded by the client who wore it and approved by our team.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {reviews.length === 0 ? (
            <div style={{ background: "#FFF9FB", border: "1px solid #F2E1E7" }} className="md:col-span-2 rounded-3xl p-10 flex items-center justify-center">
              <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Be the first to share your look.</p>
            </div>
          ) : (
            reviews.map((t) => (
              <div key={t.id} style={{ background: "#FFF9FB", border: "1px solid #F2E1E7" }} className="rounded-3xl overflow-hidden text-left">
                <div className="h-40">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={13} fill="#D6B56E" color="#D6B56E" />)}
                  </div>
                  {t.comment && (
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="italic text-base mb-5 leading-relaxed">
                      "{t.comment}"
                    </p>
                  )}
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold">{t.name}</p>
                </div>
              </div>
            ))
          )}

          <button
            onClick={openForm}
            style={{ border: "1.5px dashed #D6B56E", background: "#FFF9FB" }}
            className="rounded-3xl flex flex-col items-center justify-center gap-3 py-10 transition-colors duration-300 hover:bg-white"
          >
            <div style={{ background: "#F7DDE6" }} className="w-11 h-11 rounded-full flex items-center justify-center">
              <Camera size={18} color="#8A4560" />
            </div>
            <span style={{ fontFamily: "'Poppins', sans-serif", color: "#8A4560" }} className="text-sm font-semibold">Share your look</span>
          </button>
        </div>

        {showForm && (
          <div style={{ background: "rgba(59,46,54,0.5)" }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div style={{ background: "#FFFFFF" }} className="rounded-3xl p-7 w-full max-w-md text-left relative">
              <button onClick={closeForm} style={{ color: "#8A757C" }} className="absolute top-5 right-5">
                <X size={18} />
              </button>

              {!submitted ? (
                <>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-xl mb-1">Share your look</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs mb-6">Our team reviews every photo before it goes live.</p>

                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files)} />
                  <div
                    onClick={() => inputRef.current?.click()}
                    style={{ border: "1.5px dashed #E7C6D3", background: "#FFF9FB" }}
                    className="rounded-2xl h-40 flex items-center justify-center cursor-pointer mb-5 overflow-hidden"
                  >
                    {preview ? (
                      <img src={preview} alt="Your upload" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Camera size={20} color="#C2698A" className="mx-auto mb-2" />
                        <span style={{ fontFamily: "'Poppins', sans-serif", color: "#8A4560" }} className="text-xs font-medium">Tap to add a photo</span>
                      </div>
                    )}
                  </div>

                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#5A4650" }} className="text-xs mb-2">Your rating</p>
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setRating(n)}>
                        <Star size={20} fill={n <= rating ? "#D6B56E" : "none"} color="#D6B56E" />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience"
                    style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                    className="w-full rounded-2xl p-3 text-sm outline-none resize-none h-20 mb-5"
                  />

                  {error && (
                    <p style={{ color: "#C2537A", fontFamily: "'Poppins', sans-serif" }} className="text-xs mb-4 leading-relaxed">{error}</p>
                  )}

                  <PrimaryButton style={{ width: "100%", justifyContent: "center" }} onClick={submit} disabled={!file || submitting}>
                    {submitting ? "Submitting..." : "Submit for review"}
                  </PrimaryButton>
                </>
              ) : (
                <div className="text-center py-8">
                  <div style={{ background: "#DCEFE3" }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={22} color="#3E7D5A" />
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-2">Thank you</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm">
                    Your photo is with our team. Once approved, it will appear here for everyone to see.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SiteView() {
  const [wishlist, setWishlist] = useState({});
  const [notifiedId, setNotifiedId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { addItem, count: cartCount } = useCart();
  const { services } = useServices();
  const { products } = useProducts();
  const { user } = useAuth();
  const { settings: businessSettings } = useBusinessSettings();

  const notifyMe = async (product) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }
    await supabase.from("notifications").insert({
      audience: "admin",
      type: "stock",
      title: "Restock request",
      body: `${user.fullName || "A customer"} wants to know when ${product.name} is back in stock.`,
      link: "/admin",
    });
    setNotifiedId(product.id);
    setTimeout(() => setNotifiedId(""), 3000);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Shop", to: "/#shop" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <div>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ background: "linear-gradient(90deg,#F2C9D8,#F7DDE6,#F2C9D8)", color: "#6B3B50" }}
           className="text-center text-xs py-2 font-medium tracking-wide">
        <span style={{ fontFamily: "'Poppins', sans-serif" }}>Confidence. Beauty. You. That is the Beryl's experience.</span>
      </div>

      <nav className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b" style={{ borderColor: "#F2E1E7" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36", fontWeight: 700 }} className="text-2xl italic">Beryl's</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", color: "#B98F3F", letterSpacing: "0.2em" }} className="text-[10px] font-semibold uppercase">Beauty Mark</span>
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", color: "#5A4650" }} className="hidden lg:flex items-center gap-9 text-sm font-medium">
            {navLinks.map((item, i) => (
              <Link key={item.label} to={item.to} className="relative group">
                {item.label}
                {i === 0 && <span style={{ background: "#D6B56E" }} className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full" />}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hidden lg:block">
              <Search size={18} color="#3B2E36" className="cursor-pointer" />
            </button>
            <Heart size={18} color="#3B2E36" className="hidden lg:block cursor-pointer" />
            {user && <NotificationBell className="hidden lg:flex" />}
            <Link to="/account" className="hidden lg:block">
              <UserRound size={18} color="#3B2E36" className="cursor-pointer" />
            </Link>
            <Link to="/cart" className="relative hidden lg:block">
              <ShoppingBag size={18} color="#3B2E36" className="cursor-pointer" />
              {cartCount > 0 && (
                <span style={{ background: "#C2698A" }} className="absolute -top-2 -right-2 text-[9px] text-white rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <PrimaryButton className="hidden sm:inline-flex" onClick={() => navigate("/book")}>Book Now</PrimaryButton>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden" aria-label="Open menu">
              <Menu size={22} color="#3B2E36" />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div onClick={() => setMenuOpen(false)} style={{ background: "rgba(59,46,54,0.45)" }} className="absolute inset-0" />
          <div style={{ background: "#FFF9FB" }} className="absolute top-0 right-0 h-full w-[82%] max-w-xs shadow-2xl flex flex-col">
            <div style={{ borderColor: "#F2E1E7" }} className="flex items-center justify-between px-6 py-5 border-b">
              <span style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36", fontWeight: 700 }} className="text-xl italic">Beryl's</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} color="#3B2E36" />
              </button>
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif" }} className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  style={{ color: "#3B2E36", borderColor: "#F2E1E7" }}
                  className="py-3.5 text-base border-b flex items-center justify-between"
                >
                  {item.label} <ChevronRight size={15} color="#C2A6AF" />
                </Link>
              ))}
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                style={{ color: "#3B2E36", borderColor: "#F2E1E7" }}
                className="py-3.5 text-base border-b flex items-center justify-between"
              >
                My account <ChevronRight size={15} color="#C2A6AF" />
              </Link>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                style={{ color: "#3B2E36" }}
                className="py-3.5 text-base flex items-center justify-between"
              >
                Cart {cartCount > 0 ? `(${cartCount})` : ""} <ChevronRight size={15} color="#C2A6AF" />
              </Link>
            </div>
            <div className="mt-auto px-6 py-6">
              <PrimaryButton
                big
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => { setMenuOpen(false); navigate("/book"); }}
              >
                Book Appointment
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#FFFFFF", borderColor: "#F2E1E7" }} className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="relative flex items-center justify-between py-2.5">
          {[
            { label: "Home", icon: HomeIcon, to: "/" },
            { label: "Services", icon: Scissors, to: "/services" },
          ].map((item) => (
            <Link key={item.label} to={item.to} className="flex flex-col items-center gap-1 w-16">
              <item.icon size={19} color="#5A4650" />
              <span style={{ fontFamily: "'Poppins', sans-serif", color: "#5A4650" }} className="text-[10px]">{item.label}</span>
            </Link>
          ))}

          <button onClick={() => navigate("/book")} className="flex flex-col items-center -mt-7">
            <span
              style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", boxShadow: "0 8px 20px rgba(194,105,138,0.45)" }}
              className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-white"
            >
              <Calendar size={20} color="#FFF9FB" />
            </span>
            <span style={{ fontFamily: "'Poppins', sans-serif", color: "#8A4560" }} className="text-[10px] mt-1 font-medium">Book</span>
          </button>

          <Link to="/#shop" className="flex flex-col items-center gap-1 w-16">
            <Grid3x3 size={19} color="#5A4650" />
            <span style={{ fontFamily: "'Poppins', sans-serif", color: "#5A4650" }} className="text-[10px]">Shop</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center gap-1 w-16 relative">
            <UserRound size={19} color="#5A4650" />
            <span style={{ fontFamily: "'Poppins', sans-serif", color: "#5A4650" }} className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
      <div className="lg:hidden" style={{ height: "78px" }} />

      <Hero />

      <section style={{ background: "#FFFFFF" }} className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Award, title: "Certified stylists", desc: "Trained and passionate professionals" },
            { icon: Sparkles, title: "Premium products", desc: "Quality hair care for lasting results" },
            { icon: Calendar, title: "Easy online booking", desc: "Reserve in minutes, anytime" },
            { icon: Users, title: "Loved by thousands", desc: "Ten thousand plus clients and counting" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#FFF9FB", border: "1px solid #F2E1E7" }}
                 className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div style={{ background: "#F7DDE6" }} className="w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                <f.icon size={19} color="#B98F3F" />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-1">{f.title}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#FFF9FB" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-4">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl">Popular services</h2>
            </div>
            <GhostButton onClick={() => navigate("/services")}>View all services <ChevronRight size={16} /></GhostButton>
          </div>
          <GoldDivider />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-8">
            {services.map((s, i) => (
              <div key={i} style={{ border: "1px solid #F2E1E7" }} className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="h-36 relative overflow-hidden">
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div style={{ background: `linear-gradient(155deg, ${["#F2C9D8","#F7DDE6","#EBC7D3","#F2D9C9","#E9C9D8"][i % 5]}, #FFF9FB)` }} className="w-full h-full flex items-center justify-center">
                      <Scissors size={30} color="#C2698A" strokeWidth={1.4} />
                    </div>
                  )}
                  <span style={{ background: "rgba(255,249,251,0.9)", color: "#8A6C1F", fontFamily: "'Poppins', sans-serif" }} className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full">{s.duration}</span>
                </div>
                <div className="p-4">
                  <p style={{ color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-[10px] uppercase tracking-widest font-semibold mb-1">{s.tag}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-base mb-1 leading-snug">{s.name}</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs mb-3">Starting from <span style={{ color: "#3B2E36" }} className="font-semibold">GHC {s.priceMin}</span></p>
                  <button onClick={() => navigate("/book")} style={{ background: "#F7DDE6", color: "#8A4560", fontFamily: "'Poppins', sans-serif" }} className="w-full text-xs font-semibold py-2.5 rounded-full transition-colors duration-300 hover:bg-[#F2C9D8]">
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" style={{ background: "#FFF9FB" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-4">
            <Eyebrow>The shop</Eyebrow>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl">Take the studio home</h2>
          </div>
          <GoldDivider />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-8">
            {products.map((p, i) => {
              const outOfStock = p.stock === 0;
              return (
                <div key={p.id} style={{ border: "1px solid #F2E1E7" }} className="rounded-2xl overflow-hidden bg-white relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <button onClick={() => setWishlist((w) => ({ ...w, [i]: !w[i] }))}
                          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
                    <Heart size={13} color="#C2698A" fill={wishlist[i] ? "#C2698A" : "none"} />
                  </button>
                  <Link to={`/product/${p.id}`} className="h-32 relative block overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div style={{ background: `linear-gradient(155deg, ${["#F7DDE6","#F2D9C9","#EBC7D3","#E9C9D8","#F2C9D8"][i % 5]}, #FFFFFF)` }} className="w-full h-full flex items-center justify-center">
                        <Package size={26} color="#8A4560" strokeWidth={1.3} />
                      </div>
                    )}
                    {outOfStock && (
                      <div style={{ background: "rgba(59,46,54,0.55)" }} className="absolute inset-0 flex items-center justify-center">
                        <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-white text-[10px] font-semibold tracking-widest uppercase">Out of stock</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={11} fill="#D6B56E" color="#D6B56E" />
                      <span style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-[11px]">{p.rating}</span>
                    </div>
                    <Link to={`/product/${p.id}`} style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-sm mb-2 block hover:underline">{p.name}</Link>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }} className="text-sm font-semibold">GHC {p.price}</span>
                      <button
                              onClick={() => (outOfStock ? notifyMe(p) : addItem(p))}
                              style={{
                                background: outOfStock ? "#F0EBEC" : "#C2698A",
                                color: outOfStock ? "#8A757C" : "#FFFFFF",
                                fontFamily: "'Poppins', sans-serif",
                              }}
                              className="text-[11px] font-semibold px-3 py-1.5 rounded-full">
                        {outOfStock ? (notifiedId === p.id ? "We'll let you know" : "Notify me") : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PhotoReviewSection />

      <section style={{ background: "linear-gradient(135deg,#F2C9D8,#F7DDE6)" }} className="py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-3xl md:text-4xl mb-4">Ready for your best hair day</h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm mb-8">Reserve your seat before the week fills up.</p>
          <PrimaryButton big onClick={() => navigate("/book")} style={{ background: "#3B2E36", boxShadow: "0 10px 24px rgba(59,46,54,0.3)" }}>Book your appointment now</PrimaryButton>
        </div>
      </section>

      <footer style={{ background: "#3B2E36", color: "#F2E7EA" }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)" }} className="w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                <Sparkles size={22} color="#FFF9FB" />
              </div>
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }} className="text-3xl italic block leading-tight">Beryl's</span>
                <span style={{ color: "#D98BA3", letterSpacing: "0.15em" }} className="text-xs font-semibold uppercase">Beauty Mark</span>
              </div>
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#C7B4BB" }} className="text-sm leading-relaxed mb-5">
              {businessSettings.tagline}
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" style={{ background: "rgba(255,255,255,0.08)" }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><Instagram size={15} /></a>
              <a href="#" aria-label="TikTok" style={{ background: "rgba(255,255,255,0.08)" }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M16.5 3c.4 2.2 1.9 3.9 4.1 4.3v3.1c-1.5.1-2.9-.4-4.1-1.2v6.6c0 3.4-2.7 6.2-6.1 6.2S4.3 19.2 4.3 15.8c0-3.4 2.7-6.2 6.1-6.2.4 0 .8 0 1.1.1v3.2c-.3-.1-.7-.2-1.1-.2-1.7 0-3 1.4-3 3.1s1.4 3.1 3 3.1 3.1-1.3 3.1-3V3h3Z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" style={{ background: "rgba(255,255,255,0.08)" }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm5.2 14.2c-.22.62-1.28 1.2-1.77 1.24-.45.05-1.02.07-1.65-.1-.38-.11-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.97-.13-.18-1.08-1.43-1.08-2.73s.68-1.94.92-2.2c.24-.27.53-.33.7-.33h.5c.16 0 .38-.06.6.45.22.53.75 1.83.82 1.96.07.14.12.3.02.48-.1.18-.15.29-.3.45-.15.16-.31.35-.44.47-.15.14-.3.3-.13.58.16.28.72 1.19 1.55 1.92 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.44.2.5.31.07.11.07.63-.15 1.25Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg mb-4">Explore</p>
            {[
              { label: "Services", to: "/services" },
              { label: "Book Appointment", to: "/book" },
              { label: "Shop Products", to: "/#shop" },
              { label: "Gallery", to: "/gallery" },
              { label: "About Us", to: "/about" },
            ].map((l) => (
              <Link key={l.label} to={l.to} style={{ color: "#C7B4BB" }} className="text-sm mb-2.5 block hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg mb-4">Support</p>
            {[
              { label: "FAQs", to: "/faqs" },
              { label: "Reviews", to: "/#reviews" },
              { label: "Contact Us", to: "/contact" },
              { label: "Privacy Policy", to: "/privacy-policy" },
              { label: "Terms & Conditions", to: "/terms" },
              { label: "Refund Policy", to: "/refund-policy" },
            ].map((l) => (
              <Link key={l.label} to={l.to} style={{ color: "#C7B4BB" }} className="text-sm mb-2.5 block hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          <div style={{ fontFamily: "'Poppins', sans-serif" }} className="col-span-2 lg:col-span-1">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg mb-4">Get in Touch</p>
            <div className="flex items-start gap-2.5 mb-3">
              <MapPin size={15} color="#D98BA3" className="mt-0.5 shrink-0" />
              <span style={{ color: "#C7B4BB" }} className="text-sm">{businessSettings.address}</span>
            </div>
            <a href={`tel:${businessSettings.phone?.replace(/\s/g, "")}`} className="flex items-center gap-2.5 mb-3 w-fit">
              <Phone size={15} color="#D98BA3" className="shrink-0" />
              <span style={{ color: "#C7B4BB" }} className="text-sm hover:text-white transition-colors">{businessSettings.phone}</span>
            </a>
            <a href={`mailto:${businessSettings.email}`} className="flex items-center gap-2.5 mb-4 w-fit">
              <Mail size={15} color="#D98BA3" className="shrink-0" />
              <span style={{ color: "#C7B4BB" }} className="text-sm hover:text-white transition-colors">{businessSettings.email}</span>
            </a>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} className="rounded-xl p-4">
              <p style={{ color: "#F2E7EA" }} className="text-xs font-semibold mb-1.5">Opening hours</p>
              <p style={{ color: "#C7B4BB" }} className="text-xs mb-1">{businessSettings.hours_weekday}</p>
              <p style={{ color: "#8F7C84" }} className="text-xs">Sunday, {businessSettings.hours_sunday}</p>
            </div>
          </div>
        </div>
        <div style={{ borderColor: "rgba(255,255,255,0.1)", fontFamily: "'Poppins', sans-serif", color: "#9A868D" }} className="border-t pt-6 pb-4 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs">
          <span>Beryl's Beauty Mark. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <Link to="/admin/login" style={{ color: "#D6B56E" }} className="hover:text-white transition-colors font-medium">Staff portal</Link>
        </div>
      </footer>
      <div className="lg:hidden" style={{ height: "78px" }} />

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}