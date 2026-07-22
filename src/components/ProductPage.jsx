import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Star, Heart, Package, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Loading...</p>
      </div>
    );
  }

  const product = products.find((p) => p.id === id) || products[0];
  if (!product) {
    return (
      <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Product not found.</p>
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="rounded-3xl aspect-square relative overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div style={{ background: "linear-gradient(155deg,#F7DDE6,#FFFFFF)" }} className="w-full h-full flex items-center justify-center">
                  <Package size={64} color="#8A4560" strokeWidth={1.1} />
                </div>
              )}
              {outOfStock && (
                <div style={{ background: "rgba(59,46,54,0.55)" }} className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-white text-xs font-semibold tracking-widest uppercase">Out of stock</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(product.rating) ? "#D6B56E" : "none"} color="#D6B56E" />)}
              <span style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs ml-1">{product.rating} rating</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-3xl mb-3">{product.name}</h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-2xl font-semibold mb-5">GHC {product.price}</p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div style={{ border: "1px solid #F2E1E7" }} className="flex items-center rounded-full overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center" style={{ color: "#3B2E36" }}>
                  <Minus size={13} />
                </button>
                <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="w-8 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 flex items-center justify-center" style={{ color: "#3B2E36" }}>
                  <Plus size={13} />
                </button>
              </div>
              <button
                onClick={() => setWishlisted((w) => !w)}
                style={{ border: "1px solid #F2E1E7" }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
              >
                <Heart size={16} color="#C2698A" fill={wishlisted ? "#C2698A" : "none"} />
              </button>
            </div>

            <button
              disabled={outOfStock}
              onClick={() => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
              style={{
                background: outOfStock ? "#F0EBEC" : "linear-gradient(135deg,#D98BA3,#C2698A)",
                color: outOfStock ? "#A6949A" : "#FFF9FB",
                fontFamily: "'Poppins', sans-serif",
              }}
              className="w-full sm:w-auto px-10 py-3.5 rounded-full text-sm font-semibold mb-2"
            >
              {outOfStock ? "Notify me when back in stock" : "Add to cart"}
            </button>
            {added && (
              <p style={{ color: "#3E7D5A", fontFamily: "'Poppins', sans-serif" }} className="text-xs mb-4">Added to your cart</p>
            )}

            <div style={{ borderColor: "#F2E1E7" }} className="border-t pt-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }}>
                <Truck size={14} /> <span className="text-xs">Delivered across Kumasi within two business days</span>
              </div>
              <div className="flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }}>
                <ShieldCheck size={14} /> <span className="text-xs">Paid securely through mobile money or card</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex gap-6 border-b mb-6" style={{ borderColor: "#F2E1E7" }}>
            {[
              { key: "description", label: "Description" },
              { key: "howToUse", label: "How to use" },
              { key: "reviews", label: "Reviews" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{ color: tab === t.key ? "#3B2E36" : "#8A757C", borderColor: tab === t.key ? "#C2698A" : "transparent", fontFamily: "'Poppins', sans-serif" }}
                className="text-sm font-medium pb-3 border-b-2 -mb-px"
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed max-w-2xl">
            {tab === "description" && <p>{product.description}</p>}
            {tab === "howToUse" && <p>{product.howToUse}</p>}
            {tab === "reviews" && (
              <div className="flex flex-col gap-4">
                <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-xl p-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#D6B56E" color="#D6B56E" />)}
                  </div>
                  <p className="text-sm mb-1">Genuinely changed my wash day routine, absorbs fast and smells lovely.</p>
                  <p style={{ color: "#8A757C" }} className="text-xs">Naomi O.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-6">You may also like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ border: "1px solid #F2E1E7" }} className="rounded-2xl overflow-hidden bg-white block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="h-28">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div style={{ background: "linear-gradient(155deg,#F7DDE6,#FFFFFF)" }} className="w-full h-full flex items-center justify-center">
                      <Package size={22} color="#8A4560" strokeWidth={1.3} />
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-sm mb-1">{p.name}</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-xs font-semibold">GHC {p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}