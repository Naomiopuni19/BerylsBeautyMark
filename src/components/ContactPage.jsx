import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Phone, MessageCircle, Mail, Clock, Check } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = () => {
    setSent(true);
  };

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to home
        </Link>

        <p style={{ letterSpacing: "0.28em", color: "#B98F3F", fontFamily: "'Poppins', sans-serif" }} className="text-xs font-semibold uppercase mb-3">
          Get in touch
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-4xl mb-10">Visit or reach us</h1>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
          <div>
            <div style={{ background: "linear-gradient(155deg,#F2C9D8,#F7DDE6)" }} className="rounded-3xl h-64 flex items-center justify-center mb-6">
              <MapPin size={32} color="#8A4560" strokeWidth={1.2} />
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin, label: "Location", value: "Ayeduase KNUST, Kumasi Ghana", href: null },
                { icon: Phone, label: "Phone", value: "+233 24 000 0000", href: "tel:+233240000000" },
                { icon: MessageCircle, label: "WhatsApp", value: "+233 24 000 0000", href: "https://wa.me/233240000000" },
                { icon: Mail, label: "Email", value: "hello@berylsbeautymark.com", href: "mailto:hello@berylsbeautymark.com" },
                { icon: Clock, label: "Opening hours", value: "Mon to Sat, 9:00 AM to 7:00 PM", href: null },
              ].map((item) => {
                const Wrapper = item.href ? "a" : "div";
                return (
                  <Wrapper
                    key={item.label}
                    {...(item.href ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: item.href.startsWith("http") ? "noopener noreferrer" : undefined } : {})}
                    style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }}
                    className="rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div style={{ background: "#F7DDE6" }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon size={16} color="#8A4560" />
                    </div>
                    <div>
                      <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs">{item.label}</p>
                      <p style={{ color: "#3B2E36", fontFamily: "'Poppins', sans-serif" }} className="text-sm font-medium">{item.value}</p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-7 h-fit">
            {!sent ? (
              <>
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-xl mb-1">Send a message</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs mb-6">We usually reply within a few hours during opening times.</p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Your name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                      style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                      className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
                    />
                  </div>
                  <div>
                    <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                      style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                      className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
                    />
                  </div>
                  <div>
                    <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                      style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                      className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none h-28 focus:border-[#C2698A]"
                    />
                  </div>
                  <button
                    onClick={submit}
                    disabled={!form.name || !form.email || !form.message}
                    style={{
                      background: form.name && form.email && form.message ? "linear-gradient(135deg,#D98BA3,#C2698A)" : "#F0EBEC",
                      color: form.name && form.email && form.message ? "#FFF9FB" : "#A6949A",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    className="text-sm font-semibold py-3 rounded-full"
                  >
                    Send message
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div style={{ background: "#DCEFE3" }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={22} color="#3E7D5A" />
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-2">Message sent</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm">We will get back to you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}