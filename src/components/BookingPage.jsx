import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Check, Scissors, Calendar as CalendarIcon,
  Clock, ShieldCheck, Smartphone, CreditCard as CardIcon, Banknote, AlertCircle
} from "lucide-react";
import { timeSlots } from "../lib/data";
import { useServices } from "../hooks/useServices";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const steps = ["Service", "Date and time", "Your details", "Payment", "Confirmation"];

function pad(n) {
  return n.toString().padStart(2, "0");
}

function toISODate(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function toPostgresTime(label) {
  // "10:30 AM" -> "10:30:00"
  const [time, period] = label.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${pad(h)}:${pad(m)}:00`;
}

function StepDot({ index, label, current }) {
  const done = index < current;
  const active = index === current;
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          background: done || active ? "#C2698A" : "#F2E1E7",
          color: done || active ? "#FFF9FB" : "#8A757C",
        }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
      >
        {done ? <Check size={13} /> : index + 1}
      </div>
      <span
        style={{ color: active ? "#3B2E36" : "#8A757C", fontFamily: "'Poppins', sans-serif" }}
        className={`text-xs font-medium hidden sm:inline ${active ? "font-semibold" : ""}`}
      >
        {label}
      </span>
    </div>
  );
}

function SummaryCard({ service, date, time }) {
  if (!service) return null;
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-6 sticky top-24">
      <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-lg mb-4">Appointment summary</p>
      <div className="h-24 rounded-2xl overflow-hidden mb-4">
        {service.image ? (
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <div style={{ background: "linear-gradient(155deg,#F2C9D8,#F7DDE6)" }} className="w-full h-full flex items-center justify-center">
            <Scissors size={22} color="#8A4560" />
          </div>
        )}
      </div>
      <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold mb-1">{service.name}</p>
      <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs mb-4">{service.duration}</p>
      <div style={{ borderColor: "#F2E1E7" }} className="border-t pt-4 flex flex-col gap-2">
        <div className="flex justify-between text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span style={{ color: "#8A757C" }}>Date</span>
          <span style={{ color: "#3B2E36" }}>{date || "Not selected"}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span style={{ color: "#8A757C" }}>Time</span>
          <span style={{ color: "#3B2E36" }}>{time || "Not selected"}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span style={{ color: "#8A757C" }}>Estimated price</span>
          <span style={{ color: "#3B2E36" }} className="font-semibold">GHC {service.priceMin} to {service.priceMax}</span>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { user } = useAuth();
  const { services, loading: servicesLoading } = useServices();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [time, setTime] = useState(null);
  const [bookedCounts, setBookedCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [form, setForm] = useState({ name: user?.fullName || "", phone: user?.phone || "", email: user?.email || "", notes: "" });
  const [payment, setPayment] = useState("momo");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchCounts = useCallback(async () => {
    if (!service) return;
    setLoadingCounts(true);
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const start = toISODate(year, month, 1);
    const end = toISODate(year, month, new Date(year, month + 1, 0).getDate());

    const { data } = await supabase
      .from("appointments")
      .select("appointment_date")
      .eq("service_id", service.id)
      .in("status", ["pending", "accepted", "confirmed"])
      .gte("appointment_date", start)
      .lte("appointment_date", end);

    const counts = {};
    (data || []).forEach((row) => {
      counts[row.appointment_date] = (counts[row.appointment_date] || 0) + 1;
    });
    setBookedCounts(counts);
    setLoadingCounts(false);
  }, [service, monthCursor]);

  useEffect(() => {
    if (service) fetchCounts();
  }, [service, monthCursor, fetchCounts]);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();
  const monthLabel = monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const isPast = (day) => new Date(year, month, day) < today;
  const bookedFor = (day) => (service && bookedCounts[toISODate(year, month, day)]) || 0;
  const isFull = (day) => service && bookedFor(day) >= service.dailyCapacity;

  const changeMonth = (delta) => {
    setSelectedDay(null);
    setTime(null);
    setMonthCursor(new Date(year, month + delta, 1));
  };

  const submitBooking = async () => {
    setSubmitting(true);
    setSubmitError("");

    const { error } = await supabase.from("appointments").insert({
      customer_id: user.id,
      service_id: service.id,
      appointment_date: toISODate(year, month, selectedDay),
      time_slot: toPostgresTime(time),
      payment_method: payment,
      estimated_price: service.priceMin,
      notes: form.notes || null,
    });

    setSubmitting(false);

    if (error) {
      if (error.message.includes("fully booked")) {
        setSubmitError("That date just filled up for this service, please pick another date.");
        fetchCounts();
      } else {
        setSubmitError("Something went wrong sending your request, please try again.");
      }
      return;
    }

    next();
  };

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to site
        </Link>

        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
          <div className="flex items-center gap-4">
            {steps.map((label, i) => (
              <React.Fragment key={label}>
                <StepDot index={i} label={label} current={step} />
                {i < steps.length - 1 && <div style={{ background: "#F2E1E7" }} className="w-6 sm:w-10 h-px" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div>
            {step === 0 && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-6">Choose your service</h1>
                {servicesLoading ? (
                  <p style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Loading services...</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setService(s); setSelectedDay(null); setTime(null); next(); }}
                        style={{ border: service?.id === s.id ? "1.5px solid #C2698A" : "1px solid #F2E1E7", background: "#FFFFFF" }}
                        className="text-left rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span style={{ background: "#F7DDE6", color: "#8A4560", fontFamily: "'Poppins', sans-serif" }} className="text-[10px] font-semibold px-2 py-1 rounded-full">{s.tag}</span>
                          <span style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-[11px]">{s.duration}</span>
                        </div>
                        <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-base mb-1">{s.name}</p>
                        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-xs mb-3">GHC {s.priceMin} to {s.priceMax}</p>
                        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#B98F3F" }} className="text-[11px]">Only {s.dailyCapacity} seats a day</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 1 && service && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-1">Pick a date and time</h1>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-6">{service.name} allows {service.dailyCapacity} seats a day</p>

                <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => changeMonth(-1)} style={{ color: "#8A757C" }}><ChevronLeft size={16} /></button>
                    <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold">{monthLabel}{loadingCounts ? "..." : ""}</span>
                    <button onClick={() => changeMonth(1)} style={{ color: "#8A757C" }}><ChevronRight size={16} /></button>
                  </div>
                  <div style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="grid grid-cols-7 text-center text-[11px] mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: startWeekday }).map((_, i) => <div key={`pad-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const past = isPast(day);
                      const full = isFull(day);
                      const disabled = past || full;
                      const selected = selectedDay === day;
                      return (
                        <button
                          key={day}
                          disabled={disabled}
                          onClick={() => setSelectedDay(day)}
                          style={{
                            background: selected ? "#C2698A" : disabled ? "#F3ECEE" : "#FFF9FB",
                            color: selected ? "#FFF9FB" : disabled ? "#C3AEB4" : "#3B2E36",
                          }}
                          className="aspect-square rounded-lg text-xs flex items-center justify-center transition-colors duration-150"
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDay && (
                  <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5">
                    <p style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-semibold mb-3">Available times</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((t) => {
                        const selected = time === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            style={{
                              background: selected ? "#C2698A" : "#FFF9FB",
                              color: selected ? "#FFF9FB" : "#3B2E36",
                              border: "1px solid " + (selected ? "#C2698A" : "#F2E1E7"),
                            }}
                            className="text-xs py-2.5 rounded-xl"
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button onClick={back} style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Back</button>
                  <button
                    onClick={next}
                    disabled={!selectedDay || !time}
                    style={{ background: selectedDay && time ? "#C2698A" : "#F0EBEC", color: selectedDay && time ? "#FFF9FB" : "#A6949A", fontFamily: "'Poppins', sans-serif" }}
                    className="text-sm font-semibold px-6 py-2.5 rounded-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-6">Your details</h1>
                <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full name", placeholder: "Ama Serwaa" },
                    { key: "phone", label: "Phone number", placeholder: "024 000 0000" },
                    { key: "email", label: "Email", placeholder: "you@email.com" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">{f.label}</label>
                      <input
                        value={form[f.key]}
                        onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                        className="w-full text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#C2698A]"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-xs block mb-1.5">Notes for your stylist, optional</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((v) => ({ ...v, notes: e.target.value }))}
                      placeholder="Reference photo, length, or anything else worth knowing"
                      style={{ border: "1px solid #F2E1E7", fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }}
                      className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none h-20 focus:border-[#C2698A]"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={back} style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm">Back</button>
                  <button
                    onClick={next}
                    disabled={!form.name || !form.phone}
                    style={{ background: form.name && form.phone ? "#C2698A" : "#F0EBEC", color: form.name && form.phone ? "#FFF9FB" : "#A6949A", fontFamily: "'Poppins', sans-serif" }}
                    className="text-sm font-semibold px-6 py-2.5 rounded-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-2">How would you like to pay</h1>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-6">
                  This just tells us your preference, nothing is charged yet. Beryl's team reviews every request first, you'll only be asked to pay once your appointment is accepted.
                </p>
                <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-6">
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    {[
                      { key: "cash", label: "Cash", sub: "Pay in studio", icon: Banknote },
                      { key: "momo", label: "Mobile money", sub: "Pay once accepted", icon: Smartphone },
                      { key: "card", label: "Card", sub: "Pay once accepted", icon: CardIcon },
                    ].map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setPayment(p.key)}
                        style={{ border: payment === p.key ? "1.5px solid #C2698A" : "1px solid #F2E1E7", background: payment === p.key ? "#FFF9FB" : "#FFFFFF" }}
                        className="rounded-xl p-4 flex flex-col items-start gap-1 text-left"
                      >
                        <p.icon size={17} color="#8A4560" />
                        <span style={{ fontFamily: "'Poppins', sans-serif", color: "#3B2E36" }} className="text-sm font-medium mt-1">{p.label}</span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-[11px]">{p.sub}</span>
                      </button>
                    ))}
                  </div>

                  <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-[11px] mb-6 flex items-center gap-1.5">
                    <ShieldCheck size={12} /> Your seat is only guaranteed once your request is accepted and, if not paying cash, payment is completed.
                  </p>

                  {submitError && (
                    <div style={{ background: "#FBEAEA", border: "1px solid #F0C9C9" }} className="rounded-xl p-3 flex items-start gap-2 mb-5">
                      <AlertCircle size={15} color="#C2537A" className="mt-0.5 shrink-0" />
                      <p style={{ color: "#8A3A50", fontFamily: "'Poppins', sans-serif" }} className="text-xs leading-relaxed">{submitError}</p>
                    </div>
                  )}

                  <button
                    onClick={submitBooking}
                    disabled={submitting}
                    style={{ background: "linear-gradient(135deg,#D98BA3,#C2698A)", color: "#FFF9FB", fontFamily: "'Poppins', sans-serif" }}
                    className="w-full text-sm font-semibold py-3 rounded-full disabled:opacity-60"
                  >
                    {submitting ? "Sending request..." : "Submit booking request"}
                  </button>
                </div>
                <button onClick={back} style={{ color: "#8A757C", fontFamily: "'Poppins', sans-serif" }} className="text-sm mt-4">Back</button>
              </div>
            )}

            {step === 4 && (
              <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-3xl p-10 text-center">
                <div style={{ background: "#F2E7CF" }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Clock size={26} color="#8A6C1F" />
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-2xl mb-2">Request sent, {form.name.split(" ")[0] || "there"}</h1>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: "#8A757C" }} className="text-sm mb-6 max-w-sm mx-auto">
                  Beryl's team is reviewing your request. You'll get a notification the moment it's accepted, along with how to complete payment if you didn't choose cash.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link to="/account/appointments" style={{ background: "#C2698A", color: "#FFF9FB" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
                    View my appointments
                  </Link>
                  <Link to="/" style={{ border: "1px solid #F2E1E7", color: "#3B2E36" }} className="inline-block text-sm font-semibold px-6 py-3 rounded-full">
                    Back to home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {step > 0 && step < 4 && <SummaryCard service={service} date={selectedDay ? `${selectedDay} ${monthLabel}` : null} time={time} />}
        </div>
      </div>
    </div>
  );
}