import { useState } from "react";
import { Calendar as CalendarIcon, Train, Crown, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-attendants.jpg";
import { siteConfig } from "@/lib/site-config";
import { useBooking, TrainType } from "./booking/BookingContext";

const STATIONS = [
  "Nairobi Terminus",
  "Athi River",
  "Emali",
  "Kibwezi",
  "Mtito Andei",
  "Voi",
  "Miasenyi",
  "Mariakani",
  "Mombasa Terminus",
];
const TRAIN_TYPES: TrainType[] = ["Inter-County", "Express", "Suswa train"];

export function Hero() {
  const { state, setSearch, goTo } = useBooking();
  const { search } = state;
  const [tab, setTab] = useState<"express" | "premium">("express");
  const [tripType, setTripType] = useState<"one-way" | "return">("one-way");
  const [returnDate, setReturnDate] = useState("");

  const update = (patch: Partial<typeof search>) => setSearch({ ...search, ...patch });

  const handleBook = () => {
    if (!search.trainType || !search.from || !search.to || !search.date) {
      alert("Please fill in all fields to search for a train.");
      return;
    }
    if (search.from === search.to) {
      alert("Origin and destination must be different.");
      return;
    }
    goTo("results");
  };

  return (
    <section id="book" className="relative overflow-hidden pb-32 md:pb-40">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg.src}
          alt="SGR train service staff"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/45" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 md:pt-48 pb-40 md:pb-48 text-center text-white">
        <h1 className="font-extrabold uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] animate-fade-up">
          Book SGR Train Tickets Online
        </h1>
        <p className="mt-8 text-xl md:text-3xl font-semibold text-white animate-fade-up drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" style={{ animationDelay: "0.15s" }}>
          {siteConfig.businessName} — {siteConfig.tagline}
        </p>
        <p className="mt-4 text-sm md:text-lg font-normal text-white/90 animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: "0.3s" }}>
          Reserve seats on Madaraka Express and other SGR routes. Private booking service.
        </p>
      </div>

      {/* Booking widget — overlapping the bottom of the hero */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 -mb-16 md:-mb-20 animate-scale-in" style={{ animationDelay: "0.4s" }}>
        {/* Tabs */}
        <div className="flex gap-0">
          <button
            onClick={() => setTab("express")}
            className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-t-xl font-bold text-sm md:text-base transition-smooth ${
              tab === "express"
                ? "bg-card text-foreground border-b-4 border-[oklch(0.65_0.22_30)]"
                : "bg-primary/80 text-white hover:bg-primary"
            }`}
          >
            <Train className={`w-4 h-4 ${tab === "express" ? "text-[oklch(0.65_0.22_30)]" : "text-accent"}`} /> SGR Express
          </button>
          <button
            onClick={() => setTab("premium")}
            className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-t-xl font-bold text-sm md:text-base transition-smooth ${
              tab === "premium"
                ? "bg-card text-foreground border-b-4 border-[oklch(0.65_0.22_30)]"
                : "bg-primary/80 text-white hover:bg-primary"
            }`}
          >
            <Crown className={`w-4 h-4 ${tab === "premium" ? "text-[oklch(0.65_0.22_30)]" : "text-accent"}`} /> Book Premium
          </button>
        </div>

        {/* Booking bar */}
        <div className="bg-card rounded-2xl rounded-tl-none p-6 md:p-8 shadow-elegant border border-border">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            Search &amp; Book SGR Trains
            {tab === "premium" ? (
              <Crown className="w-5 h-5 text-[oklch(0.65_0.22_30)]" />
            ) : (
              <Train className="w-5 h-5 text-[oklch(0.65_0.22_30)]" />
            )}
          </h3>

          {tab === "premium" && (
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setTripType("one-way")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 font-semibold text-sm transition-smooth ${
                  tripType === "one-way"
                    ? "border-[oklch(0.65_0.22_30)] text-[oklch(0.65_0.22_30)]"
                    : "border-border text-muted-foreground"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${tripType === "one-way" ? "bg-[oklch(0.65_0.22_30)]" : "bg-transparent border border-border"}`} />
                One way
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setTripType("return")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 font-semibold text-sm transition-smooth ${
                  tripType === "return"
                    ? "border-[oklch(0.65_0.22_30)] text-[oklch(0.65_0.22_30)]"
                    : "border-border text-muted-foreground"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${tripType === "return" ? "bg-[oklch(0.65_0.22_30)]" : "bg-transparent border border-border"}`} />
                Return trip
              </button>
            </div>
          )}

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${tripType === "return" && tab === "premium" ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-4 items-end`}>
            <Field label="Train Type">
              <select
                value={search.trainType}
                onChange={(e) => update({ trainType: e.target.value as TrainType })}
                className="w-full bg-transparent outline-none text-foreground font-medium"
              >
                <option value="">Select....</option>
                {TRAIN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="From">
              <select
                value={search.from}
                onChange={(e) => update({ from: e.target.value })}
                className="w-full bg-transparent outline-none text-foreground font-medium"
              >
                <option value="">Select...</option>
                {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="To">
              <select
                value={search.to}
                onChange={(e) => update({ to: e.target.value })}
                className="w-full bg-transparent outline-none text-foreground font-medium"
              >
                <option value="">Select...</option>
                {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Departure Date">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="date"
                  value={search.date}
                  onChange={(e) => update({ date: e.target.value })}
                  className="w-full bg-transparent outline-none text-foreground font-medium"
                />
                <span className="bg-[oklch(0.65_0.22_30)] text-white p-1.5 rounded-md">
                  <CalendarIcon className="w-4 h-4" />
                </span>
              </div>
            </Field>
            {tab === "premium" && tripType === "return" && (
              <Field label="Return Date">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-foreground font-medium"
                  />
                  <span className="bg-[oklch(0.65_0.22_30)] text-white p-1.5 rounded-md">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                </div>
              </Field>
            )}
            <button
              onClick={handleBook}
              className="group bg-[oklch(0.65_0.22_30)] hover:bg-[oklch(0.6_0.22_30)] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-elegant transition-smooth hover:scale-[1.02] h-[60px]"
            >
              Book a Train
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-border pb-2 hover:border-[oklch(0.65_0.22_30)] transition-smooth">
      <label className="block text-[11px] font-bold tracking-widest uppercase text-[oklch(0.42_0.17_25)] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
