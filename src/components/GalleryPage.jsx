import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, X, Camera } from "lucide-react";
import { serviceCategories } from "../lib/data";
import { useGallery } from "../hooks/useGallery";

const gradients = ["#F2C9D8", "#F7DDE6", "#EBC7D3", "#F2D9C9", "#E9C9D8"];

export default function GalleryPage() {
  const { galleryItems, loading } = useGallery();
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState(null);

  const filtered = category === "all" ? galleryItems : galleryItems.filter((g) => g.category === category);

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Our portfolio
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-8">Gallery</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory("all")}
            style={category === "all" ? { background: "#C2698A", color: "#FFF9FB" } : { color: "#5A4650", border: "1px solid #F2E1E7" }}
            className="text-xs font-semibold px-4 py-2 rounded-full"
          >
            All work
          </button>
          {serviceCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              style={category === c.key ? { background: "#C2698A", color: "#FFF9FB" } : { color: "#5A4650", border: "1px solid #F2E1E7" }}
              className="text-xs font-semibold px-4 py-2 rounded-full"
            >
              {c.label}
            </button>
          ))}
        </div>

       {loading ? (
          <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm text-center py-10">Loading gallery...</p>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setActive(g)}
                style={{ height: 160 + (i % 3) * 60 }}
                className="w-full rounded-2xl flex items-end p-4 break-inside-avoid relative overflow-hidden text-left"
              >
                <img src={g.image} alt={g.caption} className="absolute inset-0 w-full h-full object-cover" />
                <div style={{ background: "linear-gradient(180deg, rgba(59,46,54,0) 55%, rgba(59,46,54,0.55) 100%)" }} className="absolute inset-0" />
                <span style={{ background: "rgba(255,249,251,0.9)", color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }} className="relative text-[11px] px-2.5 py-1 rounded-full font-medium">
                  {g.caption}
                </span>
              </button>
            ))}
          </div>
        )}

        {active && (
          <div onClick={() => setActive(null)} style={{ background: "rgba(59,46,54,0.75)" }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div onClick={(e) => e.stopPropagation()} className="relative max-w-lg w-full">
              <button onClick={() => setActive(null)} style={{ background: "#FFFFFF" }} className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center z-10">
                <X size={16} color="#3B2E36" />
              </button>
              <img src={active.image} alt={active.caption} className="rounded-3xl aspect-square w-full object-cover" />
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#FFFFFF" }} className="text-center mt-4 text-lg">{active.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}