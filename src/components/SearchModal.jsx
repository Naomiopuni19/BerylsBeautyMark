import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Scissors, Package } from "lucide-react";
import { services, products } from "../lib/data";

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { services: [], products: [] };
    return {
      services: services.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 5),
      products: products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5),
    };
  }, [query]);

  const hasResults = results.services.length > 0 || results.products.length > 0;

  const go = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div style={{ background: "rgba(59,46,54,0.55)" }} className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      <div onClick={onClose} className="absolute inset-0" />
      <div style={{ background: "#FFFFFF" }} className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div style={{ borderColor: "#F2E1E7" }} className="flex items-center gap-3 px-5 py-4 border-b">
          <Search size={18} color="#8A757C" className="shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services or products"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button onClick={onClose} aria-label="Close search" className="shrink-0">
            <X size={18} color="#8A757C" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!query.trim() ? (
            <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm text-center py-10">
              Start typing to search, try "braids" or "oil"
            </p>
          ) : !hasResults ? (
            <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm text-center py-10">
              Nothing matched "{query}"
            </p>
          ) : (
            <div className="py-2">
              {results.services.length > 0 && (
                <div className="mb-2">
                  <p style={{ color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-[10px] uppercase tracking-widest font-semibold px-5 py-2">Services</p>
                  {results.services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => go(`/services/${s.id}`)}
                      className="w-full text-left flex items-center gap-3 px-5 py-2.5 hover:bg-[#FFF9FB]"
                    >
                      <div style={{ background: "#F7DDE6" }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <Scissors size={13} color="#8A4560" />
                      </div>
                      <div className="min-w-0">
                        <p style={{ color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }} className="text-sm truncate">{s.name}</p>
                        <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs">GHC {s.priceMin} plus</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <div>
                  <p style={{ color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-[10px] uppercase tracking-widest font-semibold px-5 py-2">Products</p>
                  {results.products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/product/${p.id}`)}
                      className="w-full text-left flex items-center gap-3 px-5 py-2.5 hover:bg-[#FFF9FB]"
                    >
                      <div style={{ background: "#F2D9C9" }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <Package size={13} color="#8A4560" />
                      </div>
                      <div className="min-w-0">
                        <p style={{ color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }} className="text-sm truncate">{p.name}</p>
                        <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs">GHC {p.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}