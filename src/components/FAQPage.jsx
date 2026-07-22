import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "For Tiny Knotless Braids and other high demand services we recommend booking at least a week ahead, since we only take a limited number of seats a day to keep sessions unrushed. Quicker services like Silk Press or Hair Treatment usually have same week availability.",
  },
  {
    q: "Why do some services only have a few slots a day?",
    a: "Services like Tiny Knotless Braids take five to eight hours per client. Capping the daily seats means your stylist is never rushing between three overlapping appointments, and your finish stays consistent.",
  },
  {
    q: "How do I pay?",
    a: "We accept mobile money and card payments, both for bookings and for shop orders. Payment is confirmed before your appointment slot is locked in, this protects the seat for you.",
  },
  {
    q: "Can I reschedule or cancel an appointment?",
    a: "Yes, from your account under My Appointments. We ask for as much notice as possible so another client can take the freed up seat.",
  },
  {
    q: "Do you deliver products outside Kumasi?",
    a: "Right now delivery covers Kumasi within two business days. Reach out through the contact page if you are outside this area, we are expanding coverage.",
  },
  {
    q: "What if a product I want is out of stock?",
    a: "Use the notify me option on the product page. We will let you know the moment it is restocked.",
  },
  {
    q: "Do you do makeup, lashes, and nails as well as hair?",
    a: "Yes, alongside our hair services we offer makeup application, lash extensions, and gel manicures. You can browse all of it under Services.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Questions, answered
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-10">Frequently asked questions</h1>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold">{item.q}</span>
                  <ChevronDown size={16} color="#8A757C" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} className="shrink-0" />
                </button>
                {open && (
                  <div style={{ borderColor: "#F2E1E7" }} className="border-t px-5 py-4">
                    <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6B5A61" }} className="text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-7 mt-10 text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-2">Still have a question</p>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-5">We are happy to help directly.</p>
          <Link to="/contact" style={{ background: "#C2698A", color: "#FFF9FB" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}