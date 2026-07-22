import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const sections = [
  {
    title: "What we collect",
    body: "When you book an appointment, place an order, or create an account, we collect your name, phone number, email, and delivery address if applicable. Payment details are handled directly by our payment provider, we never store your card or mobile money PIN.",
  },
  {
    title: "How we use it",
    body: "Your information is used to confirm appointments, process orders, send booking reminders, and improve the services we offer. We do not sell your information to third parties.",
  },
  {
    title: "Photo reviews",
    body: "If you submit a photo review, it is held for our team's approval before appearing publicly. You can request removal of an approved photo at any time by contacting us.",
  },
  {
    title: "Cookies and site data",
    body: "We use minimal, functional cookies to keep your cart and login session working smoothly across the site. We do not use tracking cookies for advertising.",
  },
  {
    title: "Your rights",
    body: "You can request a copy of the information we hold about you, ask us to correct it, or request deletion of your account and associated data, by contacting us directly.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Legal
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-3">Privacy policy</h1>
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
            Questions about how your information is handled can be sent to{" "}
            <a href="mailto:hello@berylsbeautymark.com" style={{ color: "#C2698A" }}>hello@berylsbeautymark.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}