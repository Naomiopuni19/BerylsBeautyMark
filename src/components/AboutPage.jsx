import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Heart, Award, Users, Sparkles } from "lucide-react";
import { founderPhoto as fallbackPhoto } from "../lib/data";
import { useSiteImage } from "../hooks/useSiteImage";

export default function AboutPage() {
  const { url: founderPhoto } = useSiteImage("founder_photo", fallbackPhoto);

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-8 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-center mb-16 sm:mb-20">
          <div className="rounded-3xl overflow-hidden order-1">
            <img
              src={founderPhoto}
              alt="Beryl, founder of Beryl's Beauty Mark"
              className="w-full h-full object-cover aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5]"
            />
          </div>

          <div className="order-2">
            <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-4">
              Our story
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36", lineHeight: 1.05 }} className="text-5xl sm:text-6xl md:text-7xl font-medium mb-6">
              About<br /><span style={{ fontStyle: "italic", color: "#C2698A" }}>Beryl</span>.
            </h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm sm:text-base leading-relaxed mb-4">
              I'm Beryl, founder of Beryl's Beauty Mark. What began as one stylist's chair in Kumasi has grown into
              a full studio built on the idea that beauty work is a craft worth taking seriously.
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm sm:text-base leading-relaxed mb-8">
              Every stylist on the team trains under my eye before they touch a client's hair, which is why the
              standard here never slips, no matter who is in the chair. This page shares a little of that story,
              and where the studio is headed next.
            </p>
            <Link to="/book" style={{ background: "#C2698A", color: "#FFF9FB" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
              Book your visit
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-16">
          <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6 sm:p-7">
            <div style={{ background: "#F7DDE6" }} className="w-11 h-11 rounded-xl flex items-center justify-center mb-4">
              <Heart size={19} color="#B98F3F" />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-xl mb-2">Our mission</p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed">
              To give every client an experience that feels considered from the moment they book to the moment
              they leave the chair, no rushing, no guesswork, just skilled hands and honest care.
            </p>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6 sm:p-7">
            <div style={{ background: "#F7DDE6" }} className="w-11 h-11 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={19} color="#B98F3F" />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-xl mb-2">Our vision</p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed">
              To be the studio Kumasi trusts first, known as much for consistency and warmth as for the finished
              look, and to keep growing without ever feeling like just another salon.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {[
            { icon: Award, value: "5+", label: "Years perfecting the craft" },
            { icon: Users, value: "10,000+", label: "Clients served with care" },
            { icon: Sparkles, value: "8", label: "Services under one roof" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-4 sm:p-6 text-center">
              <s.icon size={20} color="#C2698A" className="mx-auto mb-2 sm:mb-3" />
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg sm:text-2xl mb-1">{s.value}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-[11px] sm:text-xs leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}