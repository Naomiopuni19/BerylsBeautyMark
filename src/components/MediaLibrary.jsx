import React, { useState, useRef } from "react";
import {
  Scissors, Package, Image as ImageIcon, Upload, X, Check,
  LayoutTemplate, Grid3x3, UserRound, AlertCircle
} from "lucide-react";
import AdminShell from "./AdminShell";
import { supabase } from "../lib/supabaseClient";
import { useServices } from "../hooks/useServices";
import { useProducts } from "../hooks/useProducts";
import { useHeroSlides } from "../hooks/useHeroSlides";
import { useGallery } from "../hooks/useGallery";
import { serviceCategories } from "../lib/data";
import { sanitizeFileName } from "../lib/sanitizeFileName";

const destinations = [
  { key: "hero", label: "Hero banner", icon: LayoutTemplate },
  { key: "service", label: "Service photo", icon: Scissors },
  { key: "product", label: "Product photo", icon: Package },
  { key: "gallery", label: "Gallery, new photo", icon: Grid3x3 },
  { key: "founder", label: "Founder photo", icon: UserRound },
];

async function uploadToStorage(file, folder) {
  const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from("salon-media").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("salon-media").getPublicUrl(path);
  return data.publicUrl;
}

export default function MediaLibrary() {
  const { services, loading: servicesLoading } = useServices();
  const { products, loading: productsLoading } = useProducts();
  const { heroSlides, loading: heroLoading } = useHeroSlides();
  const { galleryItems, loading: galleryLoading, refetch: refetchGallery } = useGallery();

  const [destination, setDestination] = useState("hero");
  const [targetId, setTargetId] = useState("");
  const [galleryCategory, setGalleryCategory] = useState(serviceCategories[0]?.key || "braiding");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [galleryVersion, setGalleryVersion] = useState(0);
  const inputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleFiles = (files) => {
    const picked = files && files[0];
    if (!picked || !picked.type.startsWith("image/")) {
      showToast("Please choose an image file");
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTargetId("");
    setGalleryCaption("");
    setError("");
  };

  const publish = async () => {
    if (!file) return;
    if (destination !== "gallery" && destination !== "founder" && !targetId) {
      setError("Choose which one this photo replaces first.");
      return;
    }
    if (destination === "gallery" && !galleryCaption.trim()) {
      setError("Give this photo a short caption.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = await uploadToStorage(file, destination);

      if (destination === "hero") {
        await supabase.from("hero_slides").update({ image_url: url }).eq("id", targetId);
      } else if (destination === "service") {
        await supabase.from("services").update({ image_url: url }).eq("id", targetId);
      } else if (destination === "product") {
        await supabase.from("products").update({ image_url: url }).eq("id", targetId);
      } else if (destination === "gallery") {
        await supabase.from("gallery").insert({ category: galleryCategory, caption: galleryCaption, image_url: url });
        refetchGallery();
      } else if (destination === "founder") {
        await supabase.from("site_images").upsert({ key: "founder_photo", image_url: url, updated_at: new Date().toISOString() });
      }

      showToast("Photo published to the live site");
      resetForm();
      setGalleryVersion((v) => v + 1);
    } catch {
      setError("Something went wrong uploading that photo, please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteGalleryPhoto = async (id) => {
    await supabase.from("gallery").delete().eq("id", id);
    refetchGallery();
    showToast("Photo removed");
  };

  const currentOptions =
    destination === "hero" ? heroSlides.map((h) => ({ id: h.id, label: `${h.headline} ${h.accent || ""}`.trim() })) :
    destination === "service" ? services.map((s) => ({ id: s.id, label: s.name })) :
    destination === "product" ? products.map((p) => ({ id: p.id, label: p.name })) :
    [];

  const loadingOptions = destination === "hero" ? heroLoading : destination === "service" ? servicesLoading : destination === "product" ? productsLoading : false;

  return (
    <AdminShell>
      <div className="mb-8">
        <p style={{ color: "#B29EA6" }} className="text-xs mb-1">Media library</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F7EFF1" }} className="text-xl sm:text-2xl">Photos that power the site</h1>
        <p style={{ color: "#8A757C" }} className="text-sm mt-1 max-w-xl">
          Every photo here goes live immediately, hero banner, service and product photos, the gallery, and the founder photo on the About page.
        </p>
      </div>

      <div style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl p-5 sm:p-6 mb-8">
        <label style={{ color: "#B29EA6" }} className="text-xs block mb-2">What is this photo for</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {destinations.map((d) => (
            <button
              key={d.key}
              onClick={() => { setDestination(d.key); resetForm(); }}
              style={
                destination === d.key
                  ? { background: "linear-gradient(90deg,#C2698A,#8A4560)", color: "#FFF9FB" }
                  : { background: "#241A20", color: "#B29EA6", border: "1px solid rgba(255,255,255,0.08)" }
              }
              className="text-xs font-medium px-3 py-2 rounded-full flex items-center gap-1.5"
            >
              <d.icon size={13} /> {d.label}
            </button>
          ))}
        </div>

        {(destination === "hero" || destination === "service" || destination === "product") && (
          <div className="mb-5">
            <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Which one</label>
            {loadingOptions ? (
              <p style={{ color: "#8A757C" }} className="text-xs">Loading options...</p>
            ) : (
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]"
              >
                <option value="">Choose one</option>
                {currentOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {destination === "gallery" && (
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Category</label>
              <select
                value={galleryCategory}
                onChange={(e) => setGalleryCategory(e.target.value)}
                style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]"
              >
                {serviceCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: "#B29EA6" }} className="text-xs block mb-1.5">Caption</label>
              <input
                value={galleryCaption}
                onChange={(e) => setGalleryCaption(e.target.value)}
                placeholder="Example, tiny knotless, six weeks fresh"
                style={{ background: "#241A20", border: "1px solid rgba(255,255,255,0.1)", color: "#F7EFF1" }}
                className="w-full text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#D6B56E]"
              />
            </div>
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? "#D6B56E" : "rgba(255,255,255,0.15)"}`,
            background: dragging ? "rgba(214,181,110,0.06)" : "#241A20",
          }}
          className="rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 mb-4"
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          {preview ? (
            <img src={preview} alt="Selected upload" className="max-h-40 rounded-xl object-cover" />
          ) : (
            <>
              <div style={{ background: "rgba(214,181,110,0.12)" }} className="w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                <Upload size={20} color="#D6B56E" />
              </div>
              <p style={{ color: "#F7EFF1" }} className="text-sm font-medium mb-1">Drag a photo here, or tap to browse</p>
              <p style={{ color: "#8A757C" }} className="text-xs">JPG or PNG, up to 5 MB</p>
            </>
          )}
        </div>

        {error && (
          <div style={{ background: "rgba(227,139,154,0.12)", border: "1px solid rgba(227,139,154,0.3)" }} className="rounded-xl p-3 flex items-start gap-2 mb-4">
            <AlertCircle size={14} color="#E38B9A" className="mt-0.5 shrink-0" />
            <p style={{ color: "#E8B4BE" }} className="text-xs leading-relaxed">{error}</p>
          </div>
        )}

        <button
          onClick={publish}
          disabled={!file || saving}
          style={{ background: "#D6B56E", color: "#1B1216" }}
          className="text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-50"
        >
          <Check size={15} /> {saving ? "Publishing..." : "Publish to site"}
        </button>
      </div>

      <div>
        <p style={{ color: "#B29EA6" }} className="text-xs uppercase tracking-widest font-semibold mb-4">Gallery, current photos</p>
        {galleryLoading ? (
          <p style={{ color: "#8A757C" }} className="text-sm">Loading...</p>
        ) : galleryItems.length === 0 ? (
          <p style={{ color: "#8A757C" }} className="text-sm">No gallery photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {galleryItems.map((g) => (
              <div key={g.id} style={{ background: "#2E2126", border: "1px solid rgba(255,255,255,0.06)" }} className="rounded-2xl overflow-hidden group">
                <div className="relative h-28 sm:h-32">
                  <img src={g.image} alt={g.caption} className="w-full h-full object-cover" />
                  <button
                    onClick={() => deleteGalleryPhoto(g.id)}
                    style={{ background: "rgba(27,18,22,0.85)" }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X size={13} color="#F7EFF1" />
                  </button>
                </div>
                <div className="p-3 sm:p-3.5">
                  <p style={{ color: "#F7EFF1" }} className="text-xs font-medium truncate mb-1">{g.caption}</p>
                  <span style={{ background: "rgba(214,181,110,0.12)", color: "#D6B56E" }} className="text-[10px] font-semibold px-2 py-1 rounded-full">
                    {g.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div style={{ background: "#F7EFF1", color: "#1B1216" }} className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto px-5 py-3 rounded-full text-sm font-medium shadow-xl flex items-center justify-center gap-2 z-40">
          <Check size={15} color="#3E7D5A" /> {toast}
        </div>
      )}
    </AdminShell>
  );
}