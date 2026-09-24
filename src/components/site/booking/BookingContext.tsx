import { createContext, useContext, useState, ReactNode } from "react";

export type TrainType = "Inter-County" | "Express" | "Suswa train";
export type CoachClass = "First Class" | "Economy";

export interface BookingSearch {
  trainType: TrainType | "";
  from: string;
  to: string;
  date: string;
}

export interface PassengerCounts {
  adults: number;
  children1217: number; // 12-17 yrs
  children311: number;  // 3-11 yrs
  infants: number;      // below 3 yrs (free)
}

export interface BookingState {
  search: BookingSearch;
  coachClass: CoachClass;
  passengers: PassengerCounts;
  trainCode: string;
  step: "hero" | "results" | "details" | "payment" | "success";
  mpesaPhone: string;
  checkoutId: string;
}

// SGR fare matrices (KSH, one-way) — indicative pricing for booking estimates
// Stations along the Nairobi–Mombasa SGR line.
type StationKey =
  | "NAIROBI"
  | "ATHI-RIVER"
  | "EMALI"
  | "KIBWEZI"
  | "MTITO-ANDEI"
  | "VOI"
  | "MIASENYI"
  | "MARIAKANI"
  | "MOMBASA";

const STATION_LOOKUP: Record<string, StationKey> = {
  "Nairobi Terminus": "NAIROBI",
  "Athi River": "ATHI-RIVER",
  "Emali": "EMALI",
  "Kibwezi": "KIBWEZI",
  "Mtito Andei": "MTITO-ANDEI",
  "Voi": "VOI",
  "Miasenyi": "MIASENYI",
  "Mariakani": "MARIAKANI",
  "Mombasa Terminus": "MOMBASA",
};

const ORDER: StationKey[] = [
  "NAIROBI","ATHI-RIVER","EMALI","KIBWEZI","MTITO-ANDEI","VOI","MIASENYI","MARIAKANI","MOMBASA",
];

// First Class (Express) fares
const FIRST_CLASS: Partial<Record<StationKey, Partial<Record<StationKey, number>>>> = {
  "NAIROBI":     { "ATHI-RIVER":180, "EMALI":1190, "KIBWEZI":1820, "MTITO-ANDEI":2240, "VOI":3200, "MIASENYI":3680, "MARIAKANI":4310, "MOMBASA":4500 },
  "ATHI-RIVER":  { "EMALI":990, "KIBWEZI":1540, "MTITO-ANDEI":2060, "VOI":3020, "MIASENYI":3500, "MARIAKANI":4130, "MOMBASA":4340 },
  "EMALI":       { "KIBWEZI":650, "MTITO-ANDEI":1070, "VOI":2010, "MIASENYI":2510, "MARIAKANI":3140, "MOMBASA":3350 },
  "KIBWEZI":     { "MTITO-ANDEI":350, "VOI":1380, "MIASENYI":1860, "MARIAKANI":2510, "MOMBASA":2700 },
  "MTITO-ANDEI": { "VOI":960, "MIASENYI":1430, "MARIAKANI":2070, "MOMBASA":2280 },
  "VOI":         { "MIASENYI":480, "MARIAKANI":1110, "MOMBASA":1320 },
  "MIASENYI":    { "MARIAKANI":650, "MOMBASA":840 },
  "MARIAKANI":   { "MOMBASA":210 },
};

// Economy (Express) fares
const ECONOMY: Partial<Record<StationKey, Partial<Record<StationKey, number>>>> = {
  "NAIROBI":     { "ATHI-RIVER":90, "EMALI":390, "KIBWEZI":600, "MTITO-ANDEI":740, "VOI":1050, "MIASENYI":1350, "MARIAKANI":1410, "MOMBASA":1500 },
  "ATHI-RIVER":  { "EMALI":330, "KIBWEZI":540, "MTITO-ANDEI":680, "VOI":990, "MIASENYI":1160, "MARIAKANI":1350, "MOMBASA":1430 },
  "EMALI":       { "KIBWEZI":210, "MTITO-ANDEI":360, "VOI":680, "MIASENYI":830, "MARIAKANI":1040, "MOMBASA":1100 },
  "KIBWEZI":     { "MTITO-ANDEI":150, "VOI":470, "MIASENYI":620, "MARIAKANI":830, "MOMBASA":890 },
  "MTITO-ANDEI": { "VOI":320, "MIASENYI":480, "MARIAKANI":690, "MOMBASA":750 },
  "VOI":         { "MIASENYI":170, "MARIAKANI":380, "MOMBASA":440 },
  "MIASENYI":    { "MARIAKANI":210, "MOMBASA":290 },
  "MARIAKANI":   { "MOMBASA":110 },
};

// Default seat capacities per coach class on an SGR train
const SEATS: Record<CoachClass, number> = {
  "First Class": 72,
  Economy: 1088,
};

function lookupOneWay(
  table: Partial<Record<StationKey, Partial<Record<StationKey, number>>>>,
  from: StationKey,
  to: StationKey,
): number {
  const a = ORDER.indexOf(from);
  const b = ORDER.indexOf(to);
  if (a === -1 || b === -1 || a === b) return 0;
  const [lo, hi] = a < b ? [from, to] : [to, from];
  return table[lo]?.[hi] ?? 0;
}

function getFareForRoute(from: string, to: string): { "First Class": { adult: number; child: number }; Economy: { adult: number; child: number } } {
  const f = STATION_LOOKUP[from];
  const t = STATION_LOOKUP[to];
  if (!f || !t) {
    // Fallback to Nairobi–Mombasa headline fares so UI never shows 0
    return {
      "First Class": { adult: 4500, child: 2250 },
      Economy: { adult: 1500, child: 750 },
    };
  }
  const fc = lookupOneWay(FIRST_CLASS, f, t);
  const ec = lookupOneWay(ECONOMY, f, t);
  return {
    "First Class": { adult: fc, child: Math.round(fc / 2) },
    Economy: { adult: ec, child: Math.round(ec / 2) },
  };
}

interface BookingCtx {
  state: BookingState;
  setSearch: (s: BookingSearch) => void;
  setCoachClass: (c: CoachClass) => void;
  setPassengers: (p: PassengerCounts) => void;
  setMpesaPhone: (p: string) => void;
  setCheckoutId: (id: string) => void;
  goTo: (step: BookingState["step"]) => void;
  fares: ReturnType<typeof getFareForRoute>;
  seats: typeof SEATS;
  totalFare: () => number;
  reset: () => void;
}

const Ctx = createContext<BookingCtx | null>(null);

const initial: BookingState = {
  search: { trainType: "", from: "", to: "", date: "" },
  coachClass: "Economy",
  passengers: { adults: 0, children1217: 0, children311: 0, infants: 0 },
  trainCode: "N1",
  step: "hero",
  mpesaPhone: "",
  checkoutId: "",
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initial);

  const fares = getFareForRoute(state.search.from, state.search.to);

  const totalFare = () => {
    const f = fares[state.coachClass];
    const { adults, children1217, children311 } = state.passengers;
    // 12-17 charged as adult, 3-11 as child, below 3 free
    return adults * f.adult + children1217 * f.adult + children311 * f.child;
  };

  const value: BookingCtx = {
    state,
    setSearch: (search) => setState((s) => ({ ...s, search })),
    setCoachClass: (coachClass) => setState((s) => ({ ...s, coachClass })),
    setPassengers: (passengers) => setState((s) => ({ ...s, passengers })),
    setMpesaPhone: (mpesaPhone) => setState((s) => ({ ...s, mpesaPhone })),
    setCheckoutId: (checkoutId) => setState((s) => ({ ...s, checkoutId })),
    goTo: (step) => {
      setState((s) => ({ ...s, step }));
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const el = document.getElementById("booking-flow");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    },
    fares,
    seats: SEATS,
    totalFare,
    reset: () => setState(initial),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
