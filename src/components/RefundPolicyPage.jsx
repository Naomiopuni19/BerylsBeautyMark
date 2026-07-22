import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const sections = [
  {
    title: "Appointment cancellations",
    body: "Cancellations made at least 24 hours before your appointment are eligible for a full refund or credit toward a future booking. Cancellations made within 24 hours may be subject to a partial charge, since that seat could not be offered to another client in time.",
  },
  {
    title: "No shows",
    body: "If you do not arrive for a booked appointment without cancelling, the booking is treated as completed and is not eligible for a refund.",
  },
  {
    title: "Product returns",
    body: "Unopened products in original condition can be returned within seven days of delivery for a full refund. Due to hygiene, opened or used hair and beauty products cannot be returned unless faulty.",
  },
  {
    title: "Faulty or incorrect items",
    body: "If a product arrives damaged or you receive the wrong item, contact us within 48 hours of delivery with a photo, and we will arrange a replacement or full refund at no extra cost.",
  },
  {
    title: "How refunds are processed",
    body: "Approved refunds are returned to the original payment method, mobile money or card, and typically reflect within three to five business days.",
  },
];

export default function RefundPolicyPage() {
  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Legal
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-3">Refund and cancellation policy</h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-10">Last updated July 2026</p>

        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <div key={s.title}>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-2">{s.title}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6 mt-10">
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs leading-relaxed">
            To request a refund or cancellation, contact us at{" "}
            <a href="mailto:hello@berylsbeautymark.com" style={{ color: "#C2698A" }}>hello@berylsbeautymark.com</a>{" "}
            or through the <Link to="/contact" style={{ color: "#C2698A" }}>contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}