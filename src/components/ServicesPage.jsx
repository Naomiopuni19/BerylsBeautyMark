import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, ChevronLeft } from "lucide-react";
import { serviceCategories } from "../lib/data";
import { useServices } from "../hooks/useServices";

const gradients = ["#F2C9D8", "#F7DDE6", "#EBC7D3", "#F2D9C9", "#E9C9D8", "#F2C9D8", "#F7DDE6"];

export default function ServicesPage() {
  const { services, loading } = useServices();
  const [category, setCategory] = useState("all");
  const filtered = category === "all" ? services : services.filter((s) => s.category === category);

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Everything we offer
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-8">Our services</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory("all")}
            style={category === "all" ? { background: "#C2698A", color: "#FFF9FB" } : { color: "#5A4650", border: "1px solid #F2E1E7" }}
            className="text-xs font-semibold px-4 py-2 rounded-full"
          >
            All services
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
          <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm text-center py-10">Loading services...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <Link
                key={s.id}
                to={`/services/${s.id}`}
                style={{ border: "1px solid #F2E1E7" }}
                className="group rounded-2xl overflow-hidden bg-white block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-44 relative overflow-hidden">
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div style={{ background: `linear-gradient(155deg, ${gradients[i % gradients.length]}, #FFF9FB)` }} className="w-full h-full flex items-center justify-center">
                      <Scissors size={30} color="#C2698A" strokeWidth={1.4} />
                    </div>
                  )}
                  <span style={{ background: "rgba(255,249,251,0.9)", color: "#8A6C1F", fontFamily: "'Poppins', sans-serif" }} className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full">
                    {s.duration}
                  </span>
                </div>
                <div className="p-5">
                  <p style={{ color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-[10px] uppercase tracking-widest font-semibold mb-1">{s.tag}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-2">{s.name}</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-4 leading-relaxed line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold">GHC {s.priceMin} plus</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", color: "#C2698A" }} className="text-xs font-semibold">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}