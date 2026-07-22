import React from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Scissors, Clock, Sparkles, ShieldCheck } from "lucide-react";
import { useServices } from "../hooks/useServices";
import { useGallery } from "../hooks/useGallery";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { services, loading } = useServices();
  const { galleryItems } = useGallery();

  if (loading) {
    return (
      <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Loading...</p>
      </div>
    );
  }

  const service = services.find((s) => s.id === id) || services[0];
  if (!service) {
    return (
      <div style={{ background: "#FFF9FB", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Service not found.</p>
      </div>
    );
  }
  const related = services.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 3);
  const moreShots = galleryItems.filter((g) => g.category === service.category).slice(0, 4);

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/services" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to services
        </Link>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-3xl aspect-[4/3] overflow-hidden">
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <div style={{ background: "linear-gradient(155deg,#F2C9D8,#FFFFFF)" }} className="w-full h-full flex items-center justify-center">
                <Scissors size={48} color="#8A4560" strokeWidth={1.1} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(moreShots.length ? moreShots : [1, 2, 3]).slice(0, 4).map((g, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                {g.image ? (
                  <img src={g.image} alt={g.caption || service.name} className="w-full h-full object-cover" />
                ) : (
                  <div style={{ background: "linear-gradient(155deg,#F7DDE6,#FFFFFF)" }} className="w-full h-full flex items-center justify-center min-h-[80px]">
                    <Scissors size={24} color="#8A4560" strokeWidth={1.2} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-10 mb-16">
          <div>
            <p style={{ color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-[11px] uppercase tracking-widest font-semibold mb-2">{service.tag}</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-3xl mb-4">{service.name}</h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed mb-8">{service.description}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} color="#8A4560" />
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold">Preparation tips</p>
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs leading-relaxed">{service.prepTips}</p>
              </div>
              <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} color="#8A4560" />
                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold">Aftercare</p>
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs leading-relaxed">{service.aftercare}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-6 h-fit sticky top-8">
            <div className="flex items-center gap-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }}>
              <Clock size={14} /> <span className="text-xs">{service.duration}</span>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-1">GHC {service.priceMin} to {service.priceMax}</p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#B98F3F" }} className="text-xs mb-6">Only {service.dailyCapacity} seats a day</p>
            <Link
              to="/book"
              style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }}
              className="block text-center text-sm font-semibold py-3 rounded-full"
            >
              Book this service
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-6">Related services</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((s, i) => (
                <Link key={s.id} to={`/services/${s.id}`} style={{ border: "1px solid #F2E1E7" }} className="rounded-2xl overflow-hidden bg-white block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="h-28">
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div style={{ background: "linear-gradient(155deg,#F2C9D8,#FFFFFF)" }} className="w-full h-full flex items-center justify-center">
                        <Scissors size={22} color="#8A4560" strokeWidth={1.3} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-sm mb-1">{s.name}</p>
                    <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs">GHC {s.priceMin} plus</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}