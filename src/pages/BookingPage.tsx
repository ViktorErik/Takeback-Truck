import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import "./BookingPage.css";
import api from "../api.tsx"
import MapComponent from "../components/MapComponent";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Condition = "like-new" | "good" | "worn" | "damaged";
type AgeRange = "lt1" | "1-3" | "3-5" | "5-10" | "gt10";
type Completeness = "yes" | "no";
type Grade = "A" | "B" | "C" | "D";
type Angle = "front" | "back" | "left" | "right";
type ProductKind = "bookcase" | "cubes" | "armchair" | "bed";

type Customer = {
  name: string;
  email: string;
  pickupAddress: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  articleNumber: string;
  kind: ProductKind; // decides which illustration is drawn (when there is no imageUrl)
  grid?: [number, number]; // [columns, rows] for "cubes"
  color?: string; // fill colour of the illustration
  imageUrl?: string; // set this to use a real product image instead of the illustration
  discontinued?: boolean; // true = no longer sold
};

type ItemSpec = {
  id: string;
  product: Product | null;
  photos: Record<Angle, File | null>;
  photoComments: Record<Angle, string>;
  overallComment: string;
  condition: Condition | "";
  age: AgeRange | "";
  complete: Completeness | "";
};

type TimeSlot = {
  id: string;
  label: string;
  price?: number;
};

type GradeRequest = {
  articleNumber: string;
  condition: Condition;
  age: AgeRange;
  complete: Completeness;
};

type GradeResult = {
  grade: Grade;
  credit: number;
};

type PickupMethod = "station" | "truck";

type Station = {
  id: string;
  name: string;
  address: string;
  hours: string;
  distanceMeters: number; // distance from the customer's address
};

type PickupChoice =
  | { method: "station"; stationId: string }
  | { method: "truck"; date: string; timeSlotId: string };

type BookingPayload = {
  customer: Customer;
  pickup: PickupChoice;
  items: ItemSpec[];
};

const MOCK_ACCOUNT: Customer = {
  name: "Axel Löf",
  email: "axel.lof@example.com",
  pickupAddress: "Exempelgatan 1, 123 45 Göteborg",
};


const DEMO_PRODUCTS: Product[] = [
  { id: "billy", name: "BILLY", description: "Bookcase, white, 80x28x202 cm", articleNumber: "002.638.50", kind: "bookcase" },
  { id: "kallax", name: "KALLAX", description: "Shelving unit, white, 77x147 cm", articleNumber: "802.758.87", kind: "cubes", grid: [2, 4] },
  { id: "poang", name: "POÄNG", description: "Armchair, birch veneer/Knisa light grey", articleNumber: "598.700.71", kind: "armchair" },
  { id: "malm", name: "MALM", description: "Bed frame, high, white, 160x200 cm", articleNumber: "804.020.32", kind: "bed" },
  { id: "expedit", name: "EXPEDIT", description: "Shelving unit, black-brown, 149x149 cm", articleNumber: "702.758.31", kind: "cubes", grid: [4, 4], color: "#5b4638", discontinued: true },
];

// Price (SEK) for a pickup by truck at a time when the truck isn't already nearby.
const TRUCK_PRICE = 499;

// CO2 estimate for the note under the calendar. Assumes a ~30 km round trip
// to IKEA Kållered, an average car at 170 g CO2/km, and the electric pickup
// truck at 50 g CO2/km. Free slots add virtually no extra driving since the
// truck is already passing by on its mass-pickup route; paid slots mean a
// dedicated trip to and from your address, which still beats driving
// yourself because the truck runs on electricity.
const CO2_ROUND_TRIP_KM = 30;
const CO2_CAR_G_PER_KM = 170;
const CO2_TRUCK_G_PER_KM = 50;
const co2IfYouDroveKg = (CO2_ROUND_TRIP_KM * CO2_CAR_G_PER_KM) / 1000;
const co2DedicatedTripKg = (CO2_ROUND_TRIP_KM * CO2_TRUCK_G_PER_KM) / 1000;
const co2SavedFreeSlotKg = co2IfYouDroveKg;
const co2SavedPaidSlotKg = co2IfYouDroveKg - co2DedicatedTripKg;

// DEMO STATIONS. Placeholder data until the real list of pickup stations exists.
// The distances stand in for what the backend would calculate from the
// customer's address. The list is deliberately unsorted: the page sorts it.
const DEMO_STATIONS: Station[] = [
  { id: "frolunda", name: "Frölunda Torg", address: "Exempelgatan 8, Göteborg", hours: "Mon–Sat 10:00–19:00", distanceMeters: 7200 },
  { id: "molndal", name: "Mölndal Centrum", address: "Exempelvägen 12, Mölndal", hours: "Mon–Sun 10:00–20:00", distanceMeters: 650 },
  { id: "angered", name: "Angered Centrum", address: "Exempelvägen 5, Angered", hours: "Mon–Fri 10:00–18:00", distanceMeters: 15600 },
  { id: "kallered", name: "Kållered", address: "Exempelvägen 3, Kållered", hours: "Mon–Sun 10:00–20:00", distanceMeters: 3400 },
  { id: "backaplan", name: "Backaplan", address: "Exempelgatan 21, Göteborg", hours: "Mon–Sun 09:00–21:00", distanceMeters: 11800 },
];

// TODO backend: GET /api/stations?near=<address>  -> stations with distanceMeters
async function fetchStations(_address: string): Promise<Station[]> {
  return DEMO_STATIONS;
}

// TODO backend: GET /api/pickup-slots?date=YYYY-MM-DD
// Slots with price 0 are times the pickup truck is already on its way to
// nearby pickup-stations, so a home pickup can be added to the route for free.
async function fetchTimeSlots(_dateISO: string): Promise<TimeSlot[]> {
  return [
    { id: "0800-1200", label: "08:00 - 12:00", price: 0 },
    { id: "1200-1600", label: "12:00 - 16:00", price: TRUCK_PRICE },
    { id: "1400-1800", label: "14:00 - 18:00", price: TRUCK_PRICE },
    { id: "1600-2000", label: "16:00 - 20:00", price: 0 },
    { id: "1800-2200", label: "18:00 - 22:00", price: TRUCK_PRICE },
  ];
}

// TODO backend: POST /api/grade  -> { grade, credit }
// MOCK ONLY: this local calculation exists so the UI can be designed and
// tested. The real grade and the preliminary IKEA credit come from the backend.
async function fetchGrade(req: GradeRequest): Promise<GradeResult> {
  const conditionPoints: Record<Condition, number> = {
    "like-new": 3,
    good: 2,
    worn: 1,
    damaged: 0,
  };
  const agePoints: Record<AgeRange, number> = {
    lt1: 2,
    "1-3": 1.5,
    "3-5": 1,
    "5-10": 0.5,
    gt10: 0,
  };
  const score =
    conditionPoints[req.condition] +
    agePoints[req.age] +
    (req.complete === "yes" ? 1 : 0);

  const grade: Grade = score >= 5 ? "A" : score >= 3.5 ? "B" : score >= 2 ? "C" : "D";
  const factor: Record<Grade, number> = { A: 0.7, B: 0.5, C: 0.3, D: 0.1 };
  const MOCK_BASE_VALUE = 1000;

  return { grade, credit: Math.round(MOCK_BASE_VALUE * factor[grade]) };
}

async function submitBooking(payload: BookingPayload): Promise<void> {
  console.log("Booking payload", payload);

  try {
    await api.post("/api/bookings", payload)
  }
  catch (error) {
    console.log("Error submitting product", error)
  }
}

/* ------------------------------------------------------------------ */
/* Constants and helpers                                               */
/* ------------------------------------------------------------------ */

const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good, light signs of use" },
  { value: "worn", label: "Worn, clear signs of use" },
  { value: "damaged", label: "Damaged" },
];

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "lt1", label: "Less than 1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "gt10", label: "More than 10 years" },
];

const ANGLES: { id: Angle; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "left", label: "Left side" },
  { id: "right", label: "Right side" },
];

const ORDINALS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const WEEKDAYS = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

const MIN_LEAD_DAYS = 1; // earliest bookable date = today + 1 day
const MAX_MONTHS_AHEAD = 6; // how far ahead the calendar can go

const formatPrice = (amount: number) => `${amount.toLocaleString("sv-SE")}:-`;

const formatDistance = (meters: number) =>
  meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(1)} km`;

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatLongDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const byAngle = <T,>(value: T): Record<Angle, T> => ({
  front: value,
  back: value,
  left: value,
  right: value,
});

const createItem = (): ItemSpec => ({
  id: crypto.randomUUID(),
  product: null,
  photos: byAngle<File | null>(null),
  photoComments: byAngle(""),
  overallComment: "",
  condition: "",
  age: "",
  complete: "",
});

const digitsOnly = (s: string) => s.replace(/\D/g, "");

function matchesQuery(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (`${product.name} ${product.description}`.toLowerCase().includes(q)) return true;
  const qDigits = digitsOnly(q);
  return qDigits.length >= 3 && digitsOnly(product.articleNumber).includes(qDigits);
}

/* ------------------------------------------------------------------ */
/* Icons and product illustrations                                     */
/* ------------------------------------------------------------------ */

function AddImageIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M34 14H12a4 4 0 0 0-4 4v34a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V32" />
      <path d="M8 46l14-14 12 12 8-8 14 14" />
      <path d="M44 6v16M36 14h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <circle cx="21" cy="21" r="12" />
      <path d="M30 30l11 11" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

function Illustration({ product }: { product: Product }) {
  const ink = "#222222";
  const fill = product.color ?? "#ffffff";
  const sw = 2.5;

  switch (product.kind) {
    case "bookcase":
      return (
        <>
          <rect x="36" y="12" width="48" height="98" fill={fill} stroke={ink} strokeWidth={sw} />
          {[34, 56, 78].map((y) => (
            <line key={y} x1="36" x2="84" y1={y} y2={y} stroke={ink} strokeWidth={sw} />
          ))}
          <rect x="40" y="22" width="6" height="12" fill="#0058a3" />
          <rect x="48" y="24" width="5" height="10" fill="#ffdb00" />
          <rect x="56" y="20" width="7" height="14" fill="#cfcfcf" />
          <rect x="66" y="46" width="8" height="10" fill="#0058a3" />
          <rect x="41" y="68" width="14" height="10" fill="#ffdb00" />
        </>
      );

    case "cubes": {
      const [cols, rows] = product.grid ?? [2, 4];
      const cell = 20;
      const w = cols * cell;
      const h = rows * cell;
      const x = 60 - w / 2;
      const y = 60 - h / 2;
      return (
        <>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={ink} strokeWidth={sw} />
          {Array.from({ length: cols - 1 }, (_, i) => (
            <line key={`v${i}`} x1={x + (i + 1) * cell} x2={x + (i + 1) * cell} y1={y} y2={y + h} stroke={ink} strokeWidth={sw} />
          ))}
          {Array.from({ length: rows - 1 }, (_, i) => (
            <line key={`h${i}`} x1={x} x2={x + w} y1={y + (i + 1) * cell} y2={y + (i + 1) * cell} stroke={ink} strokeWidth={sw} />
          ))}
          <rect x={x + 4} y={y + cell + 5} width={cell - 8} height={cell - 10} fill="#0058a3" />
        </>
      );
    }

    case "armchair":
      return (
        <>
          <path d="M30 28 C26 50 26 70 33 90" fill="none" stroke="#d9b27c" strokeWidth="6" strokeLinecap="round" />
          <path d="M90 28 C94 50 94 70 87 90" fill="none" stroke="#d9b27c" strokeWidth="6" strokeLinecap="round" />
          <path d="M34 90 L30 108 M86 90 L90 108" stroke="#d9b27c" strokeWidth="5" strokeLinecap="round" />
          <rect x="40" y="18" width="40" height="46" rx="10" fill="#d6d6d6" stroke={ink} strokeWidth={sw} />
          <rect x="36" y="62" width="48" height="20" rx="6" fill="#d6d6d6" stroke={ink} strokeWidth={sw} />
        </>
      );

    case "bed":
      return (
        <>
          <rect x="16" y="26" width="88" height="40" rx="2" fill={fill} stroke={ink} strokeWidth={sw} />
          <rect x="26" y="52" width="30" height="14" rx="5" fill="#ffffff" stroke={ink} strokeWidth={sw} />
          <rect x="64" y="52" width="30" height="14" rx="5" fill="#ffffff" stroke={ink} strokeWidth={sw} />
          <rect x="16" y="64" width="88" height="14" rx="2" fill="#dde6ef" stroke={ink} strokeWidth={sw} />
          <rect x="16" y="78" width="88" height="16" fill={fill} stroke={ink} strokeWidth={sw} />
          <rect x="20" y="94" width="6" height="10" fill={ink} />
          <rect x="94" y="94" width="6" height="10" fill={ink} />
        </>
      );
  }
}

function ProductImage({ product }: { product: Product }) {
  if (product.imageUrl) {
    return <img src={product.imageUrl} alt="" />;
  }
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <Illustration product={product} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

function Calendar({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const minDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + MIN_LEAD_DAYS);
    return d;
  }, [today]);

  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const trailing = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;

  const viewIndex = year * 12 + month;
  const todayIndex = today.getFullYear() * 12 + today.getMonth();
  const canGoPrev = viewIndex > todayIndex;
  const canGoNext = viewIndex < todayIndex + MAX_MONTHS_AHEAD;

  const shiftMonth = (delta: number) => setView(new Date(year, month + delta, 1));

  return (
    <div className="bk-cal" role="group" aria-label="Choose a date">
      <div className="bk-cal-header">
        <button type="button" className="bk-cal-nav" onClick={() => shiftMonth(-1)} disabled={!canGoPrev} aria-label="Previous month">
          <Chevron direction="left" />
        </button>
        <p className="bk-cal-title" aria-live="polite">
          {view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>
        <button type="button" className="bk-cal-nav" onClick={() => shiftMonth(1)} disabled={!canGoNext} aria-label="Next month">
          <Chevron direction="right" />
        </button>
      </div>

      <div className="bk-cal-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="bk-cal-weekday">
            {w}
          </span>
        ))}

        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`prev-${i}`} className="bk-day-outside">
            {daysInPrevMonth - firstWeekday + 1 + i}
          </span>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const iso = toISODate(date);
          const isSelected = iso === selected;
          const isToday = date.getTime() === today.getTime();
          const className = ["bk-day", isToday && "bk-day--today", isSelected && "bk-day--selected"]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={iso}
              type="button"
              className={className}
              disabled={date < minDate}
              aria-pressed={isSelected}
              aria-label={date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              onClick={() => onSelect(iso)}
            >
              {day}
            </button>
          );
        })}

        {Array.from({ length: trailing }, (_, i) => (
          <span key={`next-${i}`} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product picker (modal)                                              */
/* ------------------------------------------------------------------ */

type PickerFilter = "all" | "current" | "older";

const FILTERS: { id: PickerFilter; label: string }[] = [
  { id: "all", label: "All products" },
  { id: "current", label: "Currently sold" },
  { id: "older", label: "Older, no longer sold" },
];

function ProductPicker({
  onSelect,
  onClose,
}: {
  onSelect: (product: Product) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PickerFilter>("all");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    searchRef.current?.focus();
  }, []);

  const results = useMemo(
    () =>
      DEMO_PRODUCTS.filter((p) => {
        const passesFilter =
          filter === "all" || (filter === "older" ? !!p.discontinued : !p.discontinued);
        return passesFilter && matchesQuery(p, query);
      }),
    [query, filter],
  );

  return (
    <dialog
      ref={dialogRef}
      className="bk-picker"
      aria-labelledby="bk-picker-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // click on the backdrop
      }}
    >
      <div className="bk-picker-inner">
        <header className="bk-picker-head">
          <h2 id="bk-picker-title" className="bk-h2">
            Choose product
          </h2>
          <button type="button" className="bk-icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <div className="bk-picker-search">
          <input
            ref={searchRef}
            type="search"
            className="bk-input"
            placeholder="Search by name or article number"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="bk-chips" role="group" aria-label="Filter products">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className="bk-chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="bk-muted bk-picker-count" aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>

        {results.length > 0 ? (
          <ul className="bk-picker-grid">
            {results.map((p) => (
              <li key={p.id}>
                <button type="button" className="bk-product-card" onClick={() => onSelect(p)}>
                  <span className="bk-product-img">
                    <ProductImage product={p} />
                  </span>
                  <span className="bk-pc-name">
                    {p.name}
                    {p.discontinued && <span className="bk-tag">No longer sold</span>}
                  </span>
                  <span className="bk-pc-desc">{p.description}</span>
                  <span className="bk-pc-art">{p.articleNumber}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="bk-picker-empty bk-muted">
            No products match your search. Try the product name or the article number, for example 002.638.50.
          </p>
        )}
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Photo slot                                                          */
/* ------------------------------------------------------------------ */

function PhotoSlot({
  label,
  file,
  comment,
  onFile,
  onComment,
}: {
  label: string;
  file: File | null;
  comment: string;
  onFile: (file: File | null) => void;
  onComment: (text: string) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const commentId = useId();

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="bk-angle">
      <p className="bk-angle-label">{label}</p>

      <div className="bk-photo-wrap">
        <label className="bk-photo">
          <input
            type="file"
            accept="image/*"
            className="bk-visually-hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onFile(e.target.files?.[0] ?? null);
              e.target.value = ""; // lets the same file be picked again later
            }}
          />
          {url ? (
            <img src={url} alt={`${label} view of the item`} />
          ) : (
            <>
              <AddImageIcon />
              <span className="bk-photo-hint">Add photo</span>
            </>
          )}
          <span className="bk-visually-hidden">{file ? `Replace ${label.toLowerCase()} photo` : `Add ${label.toLowerCase()} photo`}</span>
        </label>
        {file && (
          <button type="button" className="bk-photo-remove" onClick={() => onFile(null)} aria-label={`Remove ${label.toLowerCase()} photo`}>
            <CloseIcon />
          </button>
        )}
      </div>

      <label className="bk-visually-hidden" htmlFor={commentId}>
        Comment on the {label.toLowerCase()} photo
      </label>
      <textarea
        id={commentId}
        className="bk-textarea bk-textarea--small"
        rows={2}
        value={comment}
        onChange={(e) => onComment(e.target.value)}
        placeholder="Damage or marks (optional)"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Item card                                                           */
/* ------------------------------------------------------------------ */

function ItemCard({
  item,
  index,
  canRemove,
  onChange,
  onRemove,
  onChooseProduct,
  onGradeChange,
}: {
  item: ItemSpec;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<ItemSpec>) => void;
  onRemove: () => void;
  onChooseProduct: () => void;
  onGradeChange: (grade: GradeResult | null) => void;
}) {
  const [grade, setGrade] = useState<GradeResult | null>(null);

  const { product, condition, age, complete } = item;
  const articleNumber = product?.articleNumber;

  // Ask the backend for a grade once the product and all grading questions are answered
  useEffect(() => {
    if (!articleNumber || !condition || !age || !complete) {
      setGrade(null);
      return;
    }
    let cancelled = false;
    fetchGrade({ articleNumber, condition, age, complete })
      .then((result) => {
        if (!cancelled) setGrade(result);
      })
      .catch(() => {
        if (!cancelled) setGrade(null);
      });
    return () => {
      cancelled = true;
    };
  }, [articleNumber, condition, age, complete]);

  // Let the page know the current grade (used for the total credit)
  useEffect(() => {
    onGradeChange(grade);
  }, [grade, onGradeChange]);

  const idp = `bk-item-${item.id}`;

  return (
    <article className="bk-card bk-item">
      <div className="bk-item-top">
        <div className="bk-product-img">{product ? <ProductImage product={product} /> : <SearchIcon />}</div>

        <div className="bk-product-info">
          <p className="bk-item-kicker">Item {ORDINALS[index] ?? index + 1}</p>
          {product ? (
            <>
              <h3 className="bk-item-title">
                {product.name}
                {product.discontinued && <span className="bk-tag">No longer sold</span>}
              </h3>
              <p className="bk-product-desc">{product.description}</p>
              <p className="bk-product-art">Article number {product.articleNumber}</p>
            </>
          ) : (
            <>
              <h3 className="bk-item-title">Choose the product you want to send back</h3>
              <p className="bk-product-desc">Search by name or article number. Older products that are no longer sold are included.</p>
            </>
          )}
        </div>

        <div className="bk-item-tools">
          <button type="button" className={product ? "bk-btn-secondary" : "bk-btn-primary"} onClick={onChooseProduct}>
            {product ? "Change product" : "Choose product"}
          </button>
          <button type="button" className="bk-icon-btn" onClick={onRemove} disabled={!canRemove} aria-label="Remove item" title={canRemove ? "Remove item" : "At least one item is required"}>
            <TrashIcon />
          </button>
        </div>
      </div>

      {product && (
        <div className="bk-item-main">
          <div className="bk-item-form">
            <fieldset className="bk-fieldset">
              <legend className="bk-subtitle">Photos from four angles</legend>
              <p className="bk-muted bk-small">Add one photo per angle. Describe any damage or marks next to the photo where it shows.</p>
              <div className="bk-photos">
                {ANGLES.map(({ id, label }) => (
                  <PhotoSlot
                    key={id}
                    label={label}
                    file={item.photos[id]}
                    comment={item.photoComments[id]}
                    onFile={(file) => onChange({ photos: { ...item.photos, [id]: file } })}
                    onComment={(text) => onChange({ photoComments: { ...item.photoComments, [id]: text } })}
                  />
                ))}
              </div>
            </fieldset>

            <div>
              <label className="bk-subtitle" htmlFor={`${idp}-overall`}>
                Overall comments
              </label>
              <textarea
                id={`${idp}-overall`}
                className="bk-textarea"
                rows={3}
                value={item.overallComment}
                onChange={(e) => onChange({ overallComment: e.target.value })}
                placeholder="Anything else we should know about the item as a whole? For example stains, smells, repairs or missing parts."
              />
            </div>

            <div className="bk-item-fields">
              <div>
                <label className="bk-item-label" htmlFor={`${idp}-condition`}>
                  Condition
                </label>
                <select id={`${idp}-condition`} className="bk-select" value={item.condition} onChange={(e) => onChange({ condition: e.target.value as Condition })}>
                  <option value="" disabled>
                    Select condition
                  </option>
                  {CONDITION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="bk-item-label" htmlFor={`${idp}-age`}>
                  Age of the item
                </label>
                <select id={`${idp}-age`} className="bk-select" value={item.age} onChange={(e) => onChange({ age: e.target.value as AgeRange })}>
                  <option value="" disabled>
                    Select age
                  </option>
                  {AGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="bk-fieldset">
                <legend className="bk-item-label">All parts included?</legend>
                <div className="bk-radio-row">
                  {(["yes", "no"] as const).map((v) => (
                    <label key={v}>
                      <input type="radio" name={`${idp}-complete`} value={v} checked={item.complete === v} onChange={() => onChange({ complete: v })} />
                      {v === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <aside className="bk-grade" aria-live="polite">
            <p className="bk-grade-title">Grade</p>
            {grade ? (
              <>
                <p className="bk-grade-letter">{grade.grade}</p>
                <p className="bk-grade-credit">
                  Estimated IKEA credit
                  <strong>≈ {formatPrice(grade.credit)}</strong>
                </p>
              </>
            ) : (
              <p className="bk-grade-text">Grade this item to see an estimate of how many credits you will receive</p>
            )}
          </aside>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Pickup method tabs                                                  */
/* ------------------------------------------------------------------ */

const METHODS: { id: PickupMethod; label: string; hint: string }[] = [
  { id: "station", label: "Pick up station", hint: "Drop off your items at a station near you" },
  { id: "truck", label: "Pick up by truck", hint: "We collect your items at your address" },
];

function MethodTabs({
  value,
  onChange,
}: {
  value: PickupMethod;
  onChange: (method: PickupMethod) => void;
}) {
  // Left/right arrow keys switch tab, like a standard tab list
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next: PickupMethod = value === "station" ? "truck" : "station";
    onChange(next);
    document.getElementById(`bk-tab-${next}`)?.focus();
  };

  return (
    <div className="bk-tabs" role="tablist" aria-label="Pickup method" onKeyDown={handleKeyDown}>
      {METHODS.map((m) => {
        const selected = value === m.id;
        return (
          <button
            key={m.id}
            id={`bk-tab-${m.id}`}
            type="button"
            role="tab"
            className="bk-tab"
            aria-selected={selected}
            aria-controls={`bk-panel-${m.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(m.id)}
          >
            <span className="bk-tab-icon">{m.id === "station" ? <PinIcon /> : <TruckIcon />}</span>
            <span className="bk-tab-text">
              <span className="bk-tab-label">{m.label}</span>
              <span className="bk-tab-hint">{m.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Station list                                                        */
/* ------------------------------------------------------------------ */

function StationList({
  stations,
  loading,
  selected,
  onSelect,
}: {
  stations: Station[];
  loading: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  // Always show the nearest station first, whatever order the backend returns
  const sorted = useMemo(
    () => [...stations].sort((a, b) => a.distanceMeters - b.distanceMeters),
    [stations],
  );

  return (
    <div className="bk-card bk-stations">
      <p className="bk-muted bk-small bk-stations-note">Sorted by distance from your address, nearest first.</p>

      {loading && <p className="bk-muted">Loading stations…</p>}
      {!loading && sorted.length === 0 && <p className="bk-muted">No stations found.</p>}

      {!loading && sorted.length > 0 && (
        <fieldset className="bk-fieldset">
          <legend className="bk-visually-hidden">Choose station</legend>
          <div className="bk-station-list">
            {sorted.map((s, i) => (
              <label key={s.id} className="bk-station">
                <input type="radio" name="pickup-station" value={s.id} checked={selected === s.id} onChange={() => onSelect(s.id)} />
                <span className="bk-station-info">
                  <span className="bk-station-name">
                    {s.name}
                    {i === 0 && <span className="bk-tag">Closest</span>}
                  </span>
                  <span className="bk-station-addr">{s.address}</span>
                </span>
                <span className="bk-station-hours">{s.hours}</span>
                <span className="bk-station-distance">{formatDistance(s.distanceMeters)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BookingPage() {
  const [customer, setCustomer] = useState<Customer>(MOCK_ACCOUNT);
  const [method, setMethod] = useState<PickupMethod>("station");
  const [stations, setStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [items, setItems] = useState<ItemSpec[]>(() => [createItem()]);
  const [pickerFor, setPickerFor] = useState<string | null>(null); // id of the item the picker is open for
  const [submitting, setSubmitting] = useState(false);
  const [grades, setGrades] = useState<Record<string, GradeResult | null>>({}); // item id -> latest grade

  // Always start at the top, also after a refresh. The browser would otherwise
  // jump back to where you were, so its scroll restoration is switched off while
  // this page is open and restored again when you leave it.
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  // Load stations (with distances from the customer's address) while the station tab is open.
  // Waits a moment after the address changes so the backend isn't called on every keystroke.
  useEffect(() => {
    if (method !== "station") return;
    let cancelled = false;
    setStationsLoading(true);
    const timer = setTimeout(() => {
      fetchStations(customer.pickupAddress)
        .then((result) => {
          if (!cancelled) setStations(result);
        })
        .catch(() => {
          if (!cancelled) setStations([]);
        })
        .finally(() => {
          if (!cancelled) setStationsLoading(false);
        });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [method, customer.pickupAddress]);

  // Load time slots whenever the date changes
  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setSlotsLoading(true);
    fetchTimeSlots(selectedDate)
      .then((result) => {
        if (!cancelled) setSlots(result);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectDate = (iso: string) => {
    setSelectedDate(iso);
    setSelectedSlot(null);
    setSlots([]);
  };

  const updateItem = (id: string, patch: Partial<ItemSpec>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const autofilled = (field: "name" | "email") =>
    MOCK_ACCOUNT[field] !== "" && customer[field] === MOCK_ACCOUNT[field];

  const handleGrade = (id: string, grade: GradeResult | null) =>
    setGrades((prev) => ((prev[id] ?? null) === grade ? prev : { ...prev, [id]: grade }));

  // Only items that are still on the page count (removed items are ignored)
  const gradedCount = items.filter((it) => grades[it.id]).length;
  const totalCredit = items.reduce((sum, it) => sum + (grades[it.id]?.credit ?? 0), 0);

  const missing: string[] = [];
  if (!customer.name.trim()) missing.push("name");
  if (!customer.email.includes("@")) missing.push("e-mail");
  if (!customer.pickupAddress.trim()) missing.push("pick-up address");
  if (method === "station") {
    if (!selectedStation) missing.push("station");
  } else {
    if (!selectedDate) missing.push("date");
    else if (!selectedSlot) missing.push("time");
  }
  if (items.some((it) => it.product === null)) missing.push("product");
  if (items.some((it) => it.product !== null && ANGLES.some((a) => it.photos[a.id] === null))) {
    missing.push("four photos per item");
  }
  if (items.some((it) => it.product !== null && (!it.condition || !it.age || !it.complete))) {
    missing.push("condition, age and parts");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (missing.length > 0) return;

    // Only the chosen method's details are sent
    let pickup: PickupChoice;
    if (method === "station") {
      if (!selectedStation) return;
      pickup = { method: "station", stationId: selectedStation };
    } else {
      if (!selectedDate || !selectedSlot) return;
      pickup = { method: "truck", date: selectedDate, timeSlotId: selectedSlot };
    }

    setSubmitting(true);
    try {
      await submitBooking({ customer, pickup, items });
      // TODO: navigate to the next step in the process
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bk-page">
      <form onSubmit={handleSubmit} noValidate>
        <h1 className="bk-h1">Pickup and booking details</h1>

        {/* Customer details + map */}
        <section className="bk-top">
          <div className="bk-card bk-customer">
            <h2 className="bk-h3">Kunduppgifter</h2>

            <div className="bk-field">
              <label className="bk-label" htmlFor="bk-name">
                Name
                {autofilled("name") && <span className="bk-badge">Autofilled from account</span>}
              </label>
              <input id="bk-name" name="name" className="bk-input" value={customer.name} onChange={handleCustomerChange} autoComplete="name" />
            </div>

            <div className="bk-field">
              <label className="bk-label" htmlFor="bk-email">
                E-mail
                {autofilled("email") && <span className="bk-badge">Autofilled from account</span>}
              </label>
              <input id="bk-email" name="email" type="email" className="bk-input" value={customer.email} onChange={handleCustomerChange} autoComplete="email" />
            </div>

            <div className="bk-field">
              <label className="bk-label" htmlFor="bk-address">
                Pick-up adress
              </label>
              <input id="bk-address" name="pickupAddress" className="bk-input" value={customer.pickupAddress} onChange={handleCustomerChange} autoComplete="street-address" />
            </div>
          </div>

          {/* TODO: replace this placeholder with map */}
           <div className="bk-map">
            <MapComponent />
          </div>
        </section>

        {/* Pickup method */}
        <section className="bk-section">
          <h2 className="bk-h2">Choose pickup method</h2>
          <MethodTabs value={method} onChange={setMethod} />
        </section>

        {method === "station" ? (
          /* Pick up station: choose a station */
          <section className="bk-panel" id="bk-panel-station" role="tabpanel" aria-labelledby="bk-tab-station">
            <h2 className="bk-h2">Choose station</h2>
            <StationList stations={stations} loading={stationsLoading} selected={selectedStation} onSelect={setSelectedStation} />
          </section>
        ) : (
          /* Pick up by truck: date and time */
          <section className="bk-panel" id="bk-panel-truck" role="tabpanel" aria-labelledby="bk-tab-truck">
            <h2 className="bk-h2">Select date and time</h2>
            <div className="bk-card bk-datetime">
              <div className="bk-datetime-cal">
                <Calendar selected={selectedDate} onSelect={handleSelectDate} />
                <p className="bk-muted bk-small bk-cal-note">
                  Pick a time when our truck is already passing through on its pickup-station route, and we'll swing by your address for free. Any other time is {TRUCK_PRICE} SEK.
                </p>
                <p className="bk-muted bk-small bk-cal-note">
                  Either way, it beats driving it there yourself in an average car: a free slot saves around {co2SavedFreeSlotKg.toFixed(1)} kg of CO₂, and since our truck runs on electricity, even a dedicated {TRUCK_PRICE} SEK trip to your door still saves about {co2SavedPaidSlotKg.toFixed(1)} kg.
                </p>
              </div>

              <div className="bk-datetime-times">
                <fieldset className="bk-times">
                  <legend className="bk-times-title">Available delivery times</legend>
                  {selectedDate && <p className="bk-times-date">{formatLongDate(selectedDate)}</p>}

                  {!selectedDate && <p className="bk-muted">Select a date to see available times.</p>}
                  {selectedDate && slotsLoading && <p className="bk-muted">Loading times…</p>}
                  {selectedDate && !slotsLoading && slots.length === 0 && (
                    <p className="bk-muted">No times available on this date. Try another day.</p>
                  )}

                  {!slotsLoading &&
                    slots.map((slot) => (
                      <label key={slot.id} className="bk-slot">
                        <input type="radio" name="pickup-slot" value={slot.id} checked={selectedSlot === slot.id} onChange={() => setSelectedSlot(slot.id)} />
                        <span>{slot.label}</span>
                        {slot.price !== undefined && (
                          <span className="bk-slot-price">{slot.price === 0 ? "Free" : formatPrice(slot.price)}</span>
                        )}
                      </label>
                    ))}
                </fieldset>
              </div>
            </div>
          </section>
        )}

        {/* Items (same for both methods) */}
        <section className="bk-section">
          <h2 className="bk-h2">Item specifications</h2>

          <div className="bk-items">
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                canRemove={items.length > 1}
                onChange={(patch) => updateItem(item.id, patch)}
                onRemove={() => removeItem(item.id)}
                onChooseProduct={() => setPickerFor(item.id)}
                onGradeChange={(grade) => handleGrade(item.id, grade)}
              />
            ))}
          </div>

          <button type="button" className="bk-add-item" onClick={() => setItems((prev) => [...prev, createItem()])} aria-label="Add another item" title="Add another item">
            <span aria-hidden="true">+</span>
          </button>
        </section>

        {/* Estimated IKEA credit */}
        <section className="bk-section">
          <h2 className="bk-h2">Estimated IKEA credit</h2>

          <div className="bk-card bk-summary">
            <div>
              <ul className="bk-summary-list">
                {items.map((it, index) => {
                  const g = grades[it.id];
                  return (
                    <li key={it.id} className="bk-summary-row">
                      <span className="bk-summary-name">
                        {it.product?.name ?? `Item ${ORDINALS[index] ?? index + 1}`}
                        {g && <span className="bk-tag">Grade {g.grade}</span>}
                      </span>
                      <span className={g ? "bk-summary-credit" : "bk-summary-credit bk-summary-credit--pending"}>
                        {g ? `≈ ${formatPrice(g.credit)}` : "Not graded yet"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="bk-muted bk-small bk-summary-note">Preliminary estimate based on your answers.</p>
            </div>

            <aside className="bk-grade bk-summary-total" aria-live="polite">
              <p className="bk-grade-title">Total estimated credit</p>
              <p className="bk-summary-amount">{gradedCount > 0 ? `≈ ${formatPrice(totalCredit)}` : "–"}</p>
              {gradedCount < items.length && (
                <p className="bk-grade-text">
                  {gradedCount === 0
                    ? "Choose a product and answer the questions to see your estimate"
                    : `${gradedCount} of ${items.length} items graded`}
                </p>
              )}
            </aside>
          </div>
        </section>

        {/* Continue */}
        <footer className="bk-footer">
          {missing.length > 0 && <p className="bk-hint">Still needed: {missing.join(", ")}</p>}
          <button type="submit" className="bk-continue" disabled={missing.length > 0 || submitting}>
            Continue
          </button>
        </footer>
      </form>

      {/* Rendered outside the <form> so pressing Enter in the search field can't submit the booking */}
      {pickerFor && (
        <ProductPicker
          onClose={() => setPickerFor(null)}
          onSelect={(product) => {
            updateItem(pickerFor, { product });
            setPickerFor(null);
          }}
        />
      )}
    </main>
  );
}
