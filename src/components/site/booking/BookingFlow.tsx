import { useBooking, CoachClass } from "./BookingContext";
import { Clock, MapPin, ChevronRight, ArrowLeft, Plus, Minus, CheckCircle2, Plus as PlusIcon, AlertCircle, Smartphone } from "lucide-react";
import { useState } from "react";
import { MpesaService, isValidPhoneNumber } from "@/lib/mpesa";
import { siteConfig } from "@/lib/site-config";
import { toast } from "sonner";

export function BookingFlow() {
  const { state } = useBooking();
  if (state.step === "hero") return null;

  return (
    <section id="booking-flow" className="py-12 md:py-16 px-4 md:px-6 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        {state.step === "results" && <ResultsStep />}
        {state.step === "details" && <DetailsStep />}
        {state.step === "payment" && <PaymentStep />}
        {state.step === "success" && <SuccessStep />}
      </div>
    </section>
  );
}

function SearchBar() {
  const { goTo } = useBooking();
  return (
    <div className="bg-secondary/40 rounded-xl border border-border overflow-hidden mb-6 px-5 py-3 flex items-center justify-between">
      <button
        onClick={() => goTo("hero")}
        className="text-primary font-bold text-base hover:underline"
      >
        Modify Search
      </button>
      <button
        onClick={() => goTo("hero")}
        aria-label="Modify"
        className="w-8 h-8 rounded-full bg-[oklch(0.65_0.22_30)] text-white flex items-center justify-center hover:bg-[oklch(0.6_0.22_30)] transition-smooth"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-[oklch(0.65_0.22_30)]" />
      <span className="font-bold uppercase tracking-wider text-foreground/70 text-xs">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

/* ----------------- RESULTS STEP ----------------- */
function ResultsStep() {
  const { state, fares, seats, setCoachClass, setPassengers, goTo } = useBooking();
  const [local, setLocal] = useState(state.passengers);
  const [coach, setCoach] = useState<CoachClass>(state.coachClass);

  const totalPax = local.adults + local.children1217 + local.children311 + local.infants;
  const f = fares[coach];
  const total = local.adults * f.adult + local.children1217 * f.adult + local.children311 * f.child;

  const proceed = () => {
    if (local.adults < 1) {
      alert("At least one adult is required.");
      return;
    }
    setCoachClass(coach);
    setPassengers(local);
    goTo("details");
  };

  return (
    <>
      <SearchBar />

      <h2 className="text-2xl md:text-3xl font-bold text-[oklch(0.65_0.22_30)] text-center my-8">
        Train {state.trainCode} - {state.search.from} to {state.search.to}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class options panel */}
        <div className="lg:col-span-2 bg-secondary/30 rounded-xl border border-border overflow-hidden">
          <div className="bg-card grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {(Object.keys(fares) as CoachClass[]).map((cls) => (
              <button
                key={cls}
                onClick={() => setCoach(cls)}
                className={`text-left p-6 md:p-8 transition-smooth ${
                  coach === cls ? "bg-[oklch(0.65_0.22_30)]/5" : "hover:bg-secondary/40"
                }`}
              >
                <h3 className="text-[oklch(0.65_0.22_30)] font-bold uppercase tracking-wide text-lg">
                  {cls} - {seats[cls]} Seats Open
                </h3>
                <div className="h-px bg-border my-4" />
                <div className="space-y-4">
                  <Row icon={<Clock className="w-4 h-4" />} title="ADULTS" value={`KSH ${fares[cls].adult}`} />
                  <Row icon={<MapPin className="w-4 h-4" />} title="CHILDREN (BTW 3 - 11YRS)" value={`KSH ${fares[cls].child}`} />
                  <Row icon={<MapPin className="w-4 h-4" />} title="CHILDREN (BELOW 3YRS)" value="KSH 0 - FREE" />
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border bg-secondary/30">
            <div className="px-6 py-4 text-center">
              <span className="font-bold text-primary tracking-wide">DEPARTURE: </span>
              <span className="font-bold text-foreground">08:00 AM</span>
            </div>
            <div className="px-6 py-4 text-center">
              <span className="font-bold text-primary tracking-wide">ARRIVAL: </span>
              <span className="font-bold text-foreground">02:10 PM</span>
            </div>
          </div>
        </div>

        {/* Selection panel */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-7">
          <h3 className="text-2xl font-bold text-primary leading-tight">{state.search.from} to {state.search.to}</h3>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Train : {state.trainCode}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <NumSelect label="ADULTS" value={local.adults} onChange={(v) => setLocal({ ...local, adults: v })} max={9} />
            <NumSelect label="CHILDREN (12-17YRS)" value={local.children1217} onChange={(v) => setLocal({ ...local, children1217: v })} max={9} />
            <NumSelect label="CHILDREN (3-11YRS)" value={local.children311} onChange={(v) => setLocal({ ...local, children311: v })} max={9} />
          </div>

          <div className="mt-5">
            <label className="block text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2">COACH TYPE</label>
            <div className="relative">
              <select
                value={coach}
                onChange={(e) => setCoach(e.target.value as CoachClass)}
                className="w-full appearance-none bg-secondary/40 border border-border rounded px-3 py-3 pr-12 font-medium outline-none focus:border-[oklch(0.65_0.22_30)]"
              >
                {(Object.keys(fares) as CoachClass[]).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="absolute right-0 top-0 bottom-0 w-10 bg-[oklch(0.65_0.22_30)] flex items-center justify-center text-white pointer-events-none rounded-r">▼</span>
            </div>
          </div>

          <div className="text-center mt-6 pt-5 border-t border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">TOTAL FARE:</p>
            <p className="text-4xl font-bold text-[oklch(0.65_0.55_140)] mt-1" style={{ color: "oklch(0.7 0.18 130)" }}>KSH {total.toLocaleString()}</p>
          </div>

          <button
            onClick={proceed}
            className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded transition-smooth hover:shadow-elegant"
          >
            Book a Train
          </button>
        </div>
      </div>
    </>
  );
}

function NumSelect({ label, value, onChange, max }: { label: string; value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-secondary/40 border border-border rounded px-3 py-2.5 pr-9 font-medium outline-none focus:border-[oklch(0.65_0.22_30)]"
        >
          {Array.from({ length: max + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <span className="absolute right-0 top-0 bottom-0 w-7 bg-[oklch(0.65_0.22_30)] flex items-center justify-center text-white text-xs pointer-events-none rounded-r">▼</span>
      </div>
    </div>
  );
}

function Row({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[oklch(0.65_0.22_30)] mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{title}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1.5">{label}</label>
      <div className="flex items-center bg-secondary/40 border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="px-3 py-2.5 hover:bg-[oklch(0.65_0.22_30)] hover:text-white transition-smooth"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="flex-1 text-center font-bold text-foreground">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="px-3 py-2.5 bg-[oklch(0.65_0.22_30)] text-white hover:bg-[oklch(0.6_0.22_30)] transition-smooth"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ----------------- DETAILS STEP ----------------- */
interface PassengerForm { name: string; idNo: string; gender: string; nationality: string; }
interface ChildForm { name: string; age: string; gender: string; nationality: string; }

function DetailsStep() {
  const { state, totalFare, goTo } = useBooking();
  const adultsCount = state.passengers.adults + state.passengers.children1217;
  const childrenCount = state.passengers.children311 + state.passengers.infants;

  const [adults, setAdults] = useState<PassengerForm[]>(
    Array.from({ length: adultsCount }, () => ({ name: "", idNo: "", gender: "", nationality: "" }))
  );
  const [children, setChildren] = useState<ChildForm[]>(
    Array.from({ length: childrenCount }, () => ({ name: "", age: "", gender: "", nationality: "" }))
  );
  const [mpesa, setMpesa] = useState("");
  const { setMpesaPhone } = useBooking();

  const submit = () => {
    if (adults.some((a) => !a.name || !a.idNo || !a.gender || !a.nationality)) {
      alert("Please complete all adult passenger details.");
      return;
    }
    if (children.some((c) => !c.name || !c.age || !c.gender || !c.nationality)) {
      alert("Please complete all child passenger details.");
      return;
    }
    if (!isValidPhoneNumber(mpesa)) {
      alert("Please enter a valid M-Pesa mobile number.");
      return;
    }
    setMpesaPhone(mpesa);
    goTo("payment");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="bg-primary text-primary-foreground px-6 md:px-8 py-5 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Your Booking details</h2>
          <button
            onClick={() => goTo("results")}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
          >
            Modify
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-primary">Booking Information</h3>
            <div className="h-px bg-border my-4" />
            <p className="text-sm text-muted-foreground">
              Please enter your passenger details and ensure that the name on your booking matches the name on your passport or ID.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Each adult of 18 years and above must provide a valid ID or passport number. No two adult passengers of 18 years and above can share the same ID/Passport number on the same train.
            </p>
          </div>

          {adultsCount > 0 && (
            <div>
              <h4 className="text-xl font-bold text-[oklch(0.65_0.22_30)] mb-4">Adult Details - {adultsCount}</h4>
              <div className="space-y-6">
                {adults.map((a, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-border last:border-b-0">
                    <Input label={`Full Name - Passenger ${i + 1}`} value={a.name} onChange={(v) => updateAt(setAdults, i, { ...a, name: v })} placeholder="Fullname" />
                    <Input label="ID-Card No/Passport No" value={a.idNo} onChange={(v) => updateAt(setAdults, i, { ...a, idNo: v })} placeholder="ID-Card No" />
                    <Select label="Gender" value={a.gender} onChange={(v) => updateAt(setAdults, i, { ...a, gender: v })} options={["Male", "Female"]} placeholder="--Select Gender--" />
                    <Select label="Nationality" value={a.nationality} onChange={(v) => updateAt(setAdults, i, { ...a, nationality: v })} options={NATIONALITIES} placeholder="--Select Country--" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {childrenCount > 0 && (
            <div>
              <h4 className="text-xl font-bold text-[oklch(0.65_0.22_30)] mb-4">Children Details - {childrenCount}</h4>
              <div className="space-y-6">
                {children.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-border last:border-b-0">
                    <Input label={`Full Name - Child ${i + 1}`} value={c.name} onChange={(v) => updateAt(setChildren, i, { ...c, name: v })} placeholder="Fullname" />
                    <Select label="Age" value={c.age} onChange={(v) => updateAt(setChildren, i, { ...c, age: v })} options={Array.from({ length: 17 }, (_, k) => String(k + 1))} placeholder="--Select Age--" />
                    <Select label="Gender" value={c.gender} onChange={(v) => updateAt(setChildren, i, { ...c, gender: v })} options={["Male", "Female"]} placeholder="--Select Gender--" />
                    <Select label="Nationality" value={c.nationality} onChange={(v) => updateAt(setChildren, i, { ...c, nationality: v })} options={NATIONALITIES} placeholder="--Select Country--" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xl font-bold text-[oklch(0.65_0.22_30)] mb-4">Payment Details</h4>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">M-Pesa Mobile No: <span className="text-destructive">*</span></label>
            <input
              value={mpesa}
              onChange={(e) => setMpesa(e.target.value)}
              type="tel"
              placeholder="07XX XXX XXX"
              className="w-full md:w-1/2 bg-secondary/40 border border-border rounded-lg px-4 py-3 outline-none focus:border-[oklch(0.65_0.22_30)] font-medium"
            />
          </div>

          <button
            onClick={submit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl text-lg transition-smooth hover:shadow-elegant"
          >
            Proceed to payment
          </button>
        </div>
      </div>

      <BookingSummary />
    </div>
  );
}

function updateAt<T>(setter: React.Dispatch<React.SetStateAction<T[]>>, idx: number, value: T) {
  setter((arr) => arr.map((item, i) => (i === idx ? value : item)));
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase text-foreground mb-1.5">{label} <span className="text-destructive">*</span></label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-[oklch(0.65_0.22_30)] font-medium text-sm"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase text-foreground mb-1.5">{label} <span className="text-destructive">*</span></label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-[oklch(0.65_0.22_30)] font-medium text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function BookingSummary() {
  const { state, fares, totalFare } = useBooking();
  const f = fares[state.coachClass];
  const totalPax = state.passengers.adults + state.passengers.children1217 + state.passengers.children311 + state.passengers.infants;
  const adultsLabel = state.passengers.adults + state.passengers.children1217;
  const childrenLabel = state.passengers.children311 + state.passengers.infants;

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border h-fit lg:sticky lg:top-6 overflow-hidden">
      <div className="bg-secondary/60 p-6 flex items-center justify-center">
        <div className="text-3xl font-bold tracking-tight">
          <span className="text-[oklch(0.55_0.18_140)]">M</span>
          <span className="text-destructive">•</span>
          <span className="text-[oklch(0.55_0.18_140)]">PESA</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary">{state.search.from} to {state.search.to}</h3>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Train: {state.trainCode}</p>

        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Date" value={formatDate(state.search.date)} />
          <SummaryRow label="Train" value={state.trainCode} />
          <SummaryRow label="Coach Class" value={state.coachClass.toUpperCase()} />
          <SummaryRow label="Fare (Adult, Child)" value={`${f.adult}.00, ${f.child}.00`} />
          <SummaryRow label="Passengers" value={`${adultsLabel} ADULT, ${childrenLabel} CHILDREN`} />
          <div className="h-px bg-border my-3" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Total Fare</span>
            <span className="text-2xl font-bold text-[oklch(0.55_0.18_140)]">KSH {totalFare().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}

/* ----------------- PAYMENT STEP ----------------- */
function PaymentStep() {
  const { totalFare, goTo, state, setCheckoutId } = useBooking();
  const [paymentState, setPaymentState] = useState<"initiating" | "processing" | "error">("initiating");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const [showManualConfirm, setShowManualConfirm] = useState(false);

  const handleManualConfirm = async () => {
    const id = state.checkoutId;
    if (!id) {
      toast.error("No checkout ID found. Please try again.");
      return;
    }
    toast.message("Verifying payment status with M-Pesa...");
    try {
      const status = await MpesaService.getPaymentStatus(id);
      if (status === "completed") {
        setIsPolling(false);
        setShowManualConfirm(false);
        toast.success("Payment confirmed!");
        goTo("success");
      } else if (status === "failed") {
        setIsPolling(false);
        setShowManualConfirm(false);
        setPaymentState("error");
        setErrorMessage("Payment was not completed. Please try again.");
        toast.error("Payment failed");
      } else {
        toast.message("Payment is still pending. If you just entered your PIN, wait a few seconds and click again.");
      }
    } catch {
      toast.error("Could not confirm payment yet. Please wait a moment and try again.");
    }
  };

  const handleInitiatePayment = async () => {
    setPaymentState("initiating");
    setErrorMessage("");
    setShowManualConfirm(false);

    try {
      const amount = totalFare();
      const phone = state.mpesaPhone;
      const referencePrefix = `SGR${state.trainCode.replace(/\W/g, "")}`;

      const result = await MpesaService.initiateSTKPush(
        phone,
        amount,
        referencePrefix
      );

      if (!result.success || !result.checkoutRequestId) {
        throw new Error(result.error || "Failed to initiate STK Push");
      }

      setCheckoutId(result.checkoutRequestId);
      setPaymentState("processing");
      setIsPolling(true);

      // Poll payment status:
      // - start after 5s
      // - then every 5s
      // - max 24 attempts (~2 minutes)
      const pollPaymentStatus = (checkoutId: string) => {
        let attempts = 0;
        const maxAttempts = 24;

        const checkStatus = async () => {
          if (attempts >= maxAttempts) {
            setIsPolling(false);
            setPaymentState("error");
            setShowManualConfirm(false);
            setErrorMessage("Payment confirmation timed out. Please try again.");
            toast.error("Payment confirmation timed out. Please try again.");
            return;
          }

          attempts += 1;

          try {
            const status = await MpesaService.getPaymentStatus(checkoutId);

            if (status === "completed") {
              setIsPolling(false);
              setShowManualConfirm(false);
              toast.success("Payment successful!");
              goTo("success");
              return;
            }

            if (status === "failed") {
              setIsPolling(false);
              setShowManualConfirm(false);
              setPaymentState("error");
              setErrorMessage("Payment failed or was cancelled.");
              toast.error("Payment failed or was cancelled.");
              return;
            }

            setTimeout(checkStatus, 5000);
          } catch {
            // Continue polling on error
            setTimeout(checkStatus, 5000);
          }
        };

        setTimeout(checkStatus, 5000);
      };

      pollPaymentStatus(result.checkoutRequestId);
    } catch (error) {
      setIsPolling(false);
      setErrorMessage(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setPaymentState("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-elegant border border-border p-8 md:p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[oklch(0.55_0.18_140)]/10 mb-6">
        <Smartphone className="w-10 h-10 text-[oklch(0.55_0.18_140)]" />
      </div>

      {paymentState === "initiating" && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Pay via M-Pesa</h2>
          <p className="mt-3 text-muted-foreground">
            Amount: <span className="font-bold text-[oklch(0.55_0.18_140)]">KSH {totalFare().toLocaleString()}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            An STK push will be sent to <span className="font-bold">{state.mpesaPhone}</span>
          </p>
          <button
            onClick={handleInitiatePayment}
            className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 rounded-xl transition-smooth hover:shadow-elegant"
          >
            Send M-Pesa Request
          </button>
          <button
            onClick={() => goTo("details")}
            className="mt-3 block mx-auto text-sm text-muted-foreground hover:text-foreground underline"
          >
            Go back & edit details
          </button>
          <p className="mt-6 text-xs text-muted-foreground max-w-md mx-auto">
            {siteConfig.shortDisclaimer}
          </p>
        </>
      )}

      {paymentState === "processing" && (
        <>
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-[oklch(0.55_0.18_140)]/20 border-t-[oklch(0.55_0.18_140)] rounded-full mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Processing Payment...</h2>
          <p className="mt-3 text-muted-foreground">
            A payment request of <span className="font-bold text-[oklch(0.55_0.18_140)]">KSH {totalFare().toLocaleString()}</span> has been sent to your phone.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Check your phone and enter your M-Pesa PIN to complete the booking.</p>
          <p className="mt-4 text-xs text-muted-foreground/60">Do not close this page. Waiting for M-Pesa confirmation...</p>
        </>
      )}

      {paymentState === "error" && (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Payment Status</h2>
          <p className="mt-3 text-sm text-destructive px-4">{errorMessage}</p>
          <div className="mt-6 flex flex-col gap-3 px-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleInitiatePayment}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-smooth"
              >
                Try Again
              </button>
              <button
                onClick={() => goTo("details")}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3.5 rounded-xl transition-smooth"
              >
                Go Back
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SuccessStep() {
  const { state, totalFare, fares, reset } = useBooking();
  const [booking] = useState(() => ({
    bookingNo: Math.floor(1000000 + Math.random() * 9000000).toString(),
    ticketNo: Math.floor(10000000 + Math.random() * 90000000).toString(),
    bookedOn: new Date(),
  }));

  const adultsTotal = state.passengers.adults + state.passengers.children1217;
  const childrenTotal = state.passengers.children311 + state.passengers.infants;
  const seats = adultsTotal + childrenTotal;
  const fmtDateLong = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase();
  const fmtTime = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const travelDate = state.search.date ? new Date(state.search.date) : new Date();

  const downloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    let y = 40;

    // Header
    doc.setFillColor(120, 30, 40);
    doc.rect(0, 0, W, 60, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Booking Confirmation", 40, 38);
    doc.setFontSize(9);
    doc.text(siteConfig.businessName, W - 40 - doc.getTextWidth(siteConfig.businessName), 38);
    y = 90;

    doc.setTextColor(230, 100, 40);
    doc.setFontSize(22);
    doc.text("Booking Confirmation", 40, y);
    doc.setFillColor(240, 150, 50);
    doc.rect(W - 160, y - 22, 120, 30, "F");
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.text("STATUS : PAID", W - 150, y - 2);
    y += 30;

    doc.setDrawColor(220);
    doc.line(40, y, W - 40, y);
    y += 30;

    doc.setTextColor(40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const intro = `Your booking confirmation No [ ${booking.bookingNo} ]. This will enable you pick your boarding ticket on your travel date from the terminal.`;
    doc.text(doc.splitTextToSize(intro, W - 80), 40, y);
    y += 60;

    const section = (title: string) => {
      doc.setTextColor(230, 100, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(title, 40, y);
      y += 8;
      doc.setDrawColor(230);
      doc.line(40, y, W - 40, y);
      y += 20;
    };

    const row = (k: string, v: string) => {
      doc.setTextColor(120, 30, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(k.toUpperCase() + ":", 50, y);
      doc.setTextColor(20);
      doc.setFont("helvetica", "normal");
      doc.text(String(v), 230, y);
      y += 22;
    };

    section("Trip Details");
    row("Route", `${state.search.from.toUpperCase()} TO ${state.search.to.toUpperCase()}`);
    row("Travel Date", fmtDateLong(travelDate));
    row("Departs - Arrives", "08:00 AM - 02:10 PM");
    row("Train", `TRAIN ${state.trainCode} - ${state.coachClass.toUpperCase()} - ${seats} SEAT(S)`);
    row("Terminal", state.search.from.toUpperCase());
    y += 10;

    section("Booking Details");
    row("Booking No", booking.bookingNo);
    row("Booked On", fmtDateLong(booking.bookedOn));
    row("Mobile", "254" + Math.floor(700000000 + Math.random() * 99999999).toString().slice(0, 9));
    row("Channel", `(${siteConfig.bookingChannel})`);
    row("Payment On", `${fmtDateLong(booking.bookedOn)} ${fmtTime(booking.bookedOn)}`);
    row("Payment Status", "(M-PESA) (PAID)");
    y += 10;

    section("Ticket Details");
    row("Ticket No", booking.ticketNo);
    row("Passengers", `${adultsTotal} ADULT, ${childrenTotal} CHILDREN`);
    row("Fare (Adult/Child)", `KSH ${fares[state.coachClass].adult} / KSH ${fares[state.coachClass].child}`);
    row("Total Paid", `KSH ${totalFare().toLocaleString()}`);
    y += 20;

    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const disclaimerLines = doc.splitTextToSize(siteConfig.shortDisclaimer, W - 80);
    doc.text(disclaimerLines, 40, y);

    doc.save(`${siteConfig.businessName.replace(/\s+/g, "-")}-Ticket-${booking.ticketNo}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-elegant border border-border overflow-hidden">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground px-6 md:px-10 py-5">
        <h2 className="text-xl md:text-2xl font-bold">Booking Confirmation</h2>
      </div>

      <div className="p-6 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h3 className="text-3xl md:text-4xl font-bold text-[oklch(0.65_0.22_30)]">Booking Confirmation</h3>
          <span className="bg-[oklch(0.75_0.18_60)] text-white font-bold px-5 py-2 rounded text-sm whitespace-nowrap">STATUS : PAID</span>
        </div>
        <div className="h-px bg-border mb-6" />

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-[oklch(0.75_0.18_60)] flex items-center justify-center shrink-0">
            <span className="text-2xl">👍</span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary mb-2">Booking Confirmation</h4>
            <p className="text-foreground leading-relaxed">
              Your <span className="font-bold">booking confirmation No</span> is [ <span className="text-destructive font-bold">{booking.bookingNo}</span> ]. This will enable you pick your boarding ticket on your travel date from the terminal.
            </p>
          </div>
        </div>

        <DetailSection title="Trip Details">
          <Detail k="Route" v={`${state.search.from.toUpperCase()} TO ${state.search.to.toUpperCase()}`} />
          <Detail k="Travel Date" v={fmtDateLong(travelDate)} />
          <Detail k="Departs - Arrives" v="08:00 AM - 02:10 PM" />
          <Detail k="Train" v={`TRAIN ${state.trainCode} - ${state.coachClass.toUpperCase()} - ${seats} SEAT(S)`} />
          <Detail k="Terminal" v={state.search.from.toUpperCase()} />
        </DetailSection>

        <DetailSection title="Booking Details">
          <Detail k="Booking No" v={booking.bookingNo} />
          <Detail k="Booked On" v={fmtDateLong(booking.bookedOn)} />
          <Detail k="Channel" v={`(${siteConfig.bookingChannel})`} />
          <Detail k="Payment On" v={`${fmtDateLong(booking.bookedOn)} ${fmtTime(booking.bookedOn)}`} />
          <Detail k="Payment Status" v="(M-PESA) (PAID)" />
        </DetailSection>

        <DetailSection title="Ticket Details">
          <Detail k="Ticket No" v={booking.ticketNo} />
          <Detail k="Passengers" v={`${adultsTotal} ADULT, ${childrenTotal} CHILDREN`} />
          <Detail k="Total Paid" v={`KSH ${totalFare().toLocaleString()}`} />
        </DetailSection>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadPdf}
            className="flex-1 bg-[oklch(0.65_0.22_30)] hover:bg-[oklch(0.6_0.22_30)] text-white font-bold py-3.5 rounded-xl transition-smooth hover:shadow-elegant"
          >
            ⬇  Download Ticket (PDF)
          </button>
          <button
            onClick={reset}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-smooth"
          >
            Book another trip
          </button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground border border-border rounded-lg p-3 leading-relaxed">
          {siteConfig.fullDisclaimer}
        </p>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h4 className="text-2xl font-bold text-[oklch(0.65_0.22_30)] mb-3">{title}</h4>
      <div className="h-px bg-border mb-4" />
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-2 border-b border-border/50 last:border-b-0">
      <span className="text-primary font-bold uppercase tracking-wider text-sm">{k}:</span>
      <span className="text-foreground font-medium">{v}</span>
    </div>
  );
}

const NATIONALITIES = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "Nigeria", "South Africa", "United Kingdom", "United States", "Germany", "France", "China", "India", "Other"];
