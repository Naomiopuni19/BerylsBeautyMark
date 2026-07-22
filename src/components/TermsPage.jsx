import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const sections = [
  {
    title: "Appointments",
    body: "Booking a service reserves a seat within that day's capacity for the chosen service. Arriving more than 20 minutes late may require rescheduling, since sessions are timed to keep the day running for every client.",
  },
  {
    title: "Payments",
    body: "Full payment or an agreed deposit is required to confirm a booking or order. Prices shown are estimates for services with a range, your stylist will confirm final pricing based on hair length, density, or style complexity before starting.",
  },
  {
    title: "Product purchases",
    body: "Product orders are processed once payment is confirmed. Delivery timelines are estimates and may vary based on location within Kumasi.",
  },
  {
    title: "Photo reviews and content",
    body: "By submitting a photo review, you grant Beryl's Beauty Mark permission to display it publicly on the site once approved. You retain ownership of your image and may request its removal at any time.",
  },
  {
    title: "Changes to these terms",
    body: "These terms may be updated as our services grow. Continued use of the site after changes are posted means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Legal
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-3">Terms and conditions</h1>
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
            Questions about these terms can be sent to{" "}
            <a href="mailto:hello@berylsbeautymark.com" style={{ color: "#C2698A" }}>hello@berylsbeautymark.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}