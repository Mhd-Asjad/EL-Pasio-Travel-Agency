"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { CONTACT, whatsappUrl } from "@/lib/contact";
import {
  BusIcon,
  CompassIcon,
  HotelIcon,
  MapPinIcon,
  PlaneIcon,
  SuitcaseIcon,
  TrainIcon,
} from "./icons";
import { Button, focusRingLight } from "./ui";

type Kind = "packages" | "stay" | "tickets" | "plan";
type Ticket = "flight" | "train" | "bus";

type Choice = {
  id: string;
  label: string;
  aria: string;
  interest: string;
  action: string;
  placeholder: string;
  Icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
};

const KINDS: (Choice & { id: Kind })[] = [
  {
    id: "packages",
    label: "Packages",
    aria: "Holiday packages",
    interest: "a holiday package",
    action: "Find a package",
    placeholder: "Kerala, Maldives…",
    Icon: SuitcaseIcon,
  },
  {
    id: "stay",
    label: "Stays",
    aria: "Resort and hotel bookings",
    interest: "a resort or hotel stay",
    action: "Find a stay",
    placeholder: "City or resort",
    Icon: HotelIcon,
  },
  {
    id: "tickets",
    label: "Tickets",
    aria: "Flight, train and bus tickets",
    interest: "tickets",
    action: "Find tickets",
    placeholder: "Calicut to Dubai",
    Icon: PlaneIcon,
  },
  {
    id: "plan",
    label: "Plan",
    aria: "Travel itinerary and tour planning",
    interest: "a planned itinerary",
    action: "Plan this trip",
    placeholder: "Where should we begin?",
    Icon: CompassIcon,
  },
];

const TICKETS: (Choice & { id: Ticket })[] = [
  {
    id: "flight",
    label: "Flight",
    aria: "Flight tickets",
    interest: "flight tickets",
    action: "Find flights",
    placeholder: "Calicut to Dubai",
    Icon: PlaneIcon,
  },
  {
    id: "train",
    label: "Train",
    aria: "Train tickets",
    interest: "train tickets",
    action: "Find trains",
    placeholder: "Calicut to Ernakulam",
    Icon: TrainIcon,
  },
  {
    id: "bus",
    label: "Bus",
    aria: "Bus tickets",
    interest: "bus tickets",
    action: "Find buses",
    placeholder: "Calicut to Bangalore",
    Icon: BusIcon,
  },
];

const PLACES = ["Kerala Backwaters", "Munnar", "Maldives", "Dubai", "Bali", "Wayanad", "Goa"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const glassField =
  "border border-cream/80 bg-[oklch(0.99_0.01_88/0.82)] shadow-[inset_0_1px_0_oklch(0.99_0.012_88/0.95)] backdrop-blur-md";
const pill =
  `min-h-12 w-full rounded-full px-4 text-[0.95rem] text-navy-950 outline-none transition-[border-color,background-color] duration-300 ease-spring placeholder:text-navy-900/45 focus:border-gold-600 focus:bg-cream/88 ${glassField}`;

function digits(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Compact booking card: four services up front, flight / train / bus under
 * Tickets, then a short enquiry (destination, date, travellers) that opens
 * into name, WhatsApp and email before sending.
 */
export function BookingDesk() {
  const formId = useId();
  const listId = `${formId}-places`;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [kind, setKind] = useState<Kind>("stay");
  const [ticket, setTicket] = useState<Ticket>("flight");
  const [step, setStep] = useState<1 | 2>(1);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "ready" | "blocked">("idle");
  const [whatsappHref, setWhatsappHref] = useState("");

  const current = KINDS.find((k) => k.id === kind) ?? KINDS[0];
  const ticketChoice = TICKETS.find((t) => t.id === ticket) ?? TICKETS[0];
  const active = kind === "tickets" ? ticketChoice : current;

  function selectKind(id: Kind, index: number) {
    setKind(id);
    setErrors({});
    setStatus("idle");
    tabRefs.current[index]?.focus();
  }

  function onTabKey(e: KeyboardEvent, index: number) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const last = KINDS.length - 1;
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? last
          : e.key === "ArrowRight"
            ? (index + 1) % KINDS.length
            : (index - 1 + KINDS.length) % KINDS.length;
    selectKind(KINDS[next].id, next);
  }

  function goNext() {
    if (destination.trim().length < 2) {
      setErrors({ destination: "Tell us where you want to go." });
      document.getElementById("booking-destination")?.focus();
      return;
    }
    setErrors({});
    setStep(2);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) {
      goNext();
      return;
    }
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (digits(phone).length < 10) next.phone = "Enter a 10-digit mobile number.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`${formId}-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    const href = whatsappUrl(
      [
        `Hello ${CONTACT.name}, I would like to enquire about ${active.interest}.`,
        "",
        `Name: ${name.trim()}`,
        `Phone: ${phone.trim()}`,
        `Email: ${email.trim()}`,
        `Destination: ${destination.trim()}`,
        date ? `Travel date: ${date}` : "Travel date: flexible",
        `Travellers: ${travellers}`,
        note.trim() ? `Note: ${note.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    setWhatsappHref(href);
    const popup = window.open(href, "_blank", "noopener,noreferrer");
    setStatus(popup ? "ready" : "blocked");
  }

  return (
    <div
      id="services"
      className="rounded-[1.6rem] border border-cream/55 bg-[linear-gradient(180deg,oklch(0.99_0.012_90/0.78),oklch(0.97_0.016_88/0.62))] p-3.5 text-navy-950 shadow-[0_28px_70px_-28px_oklch(0.2_0.055_258/0.55),inset_0_1px_0_oklch(0.99_0.012_88/0.85)] backdrop-blur-2xl backdrop-saturate-150 md:p-4"
    >
      <div
        role="tablist"
        aria-label="What would you like to book"
        className="grid grid-cols-2 gap-1 rounded-[1.1rem] border border-cream/45 bg-cream/35 p-1 shadow-[inset_0_1px_0_oklch(0.99_0.012_88/0.45)] backdrop-blur-md sm:grid-cols-4"
      >
        {KINDS.map((item, i) => {
          const selected = item.id === kind;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${formId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${formId}-panel`}
              aria-label={item.aria}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectKind(item.id, i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-[0.85rem] px-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ease-spring sm:text-[0.72rem] ${
                selected
                  ? "bg-cream/80 text-navy-950 shadow-[0_8px_20px_-12px_oklch(0.2_0.055_258/0.45),inset_0_1px_0_oklch(0.99_0.012_88/0.9)] backdrop-blur-md"
                  : "text-navy-900/65 hover:text-navy-950"
              } ${focusRingLight}`}
            >
              <item.Icon className="size-3.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {kind === "tickets" ? (
        <div
          role="radiogroup"
          aria-label="Ticket type"
          className="mt-2 flex gap-1.5"
        >
          {TICKETS.map((item) => {
            const selected = item.id === ticket;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setTicket(item.id);
                  setErrors({});
                }}
                className={`inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-[0.72rem] font-semibold tracking-[0.04em] ${
                  selected
                    ? "bg-navy-950 text-cream"
                    : "text-navy-900/70 hover:bg-navy-950/5"
                } ${focusRingLight}`}
              >
                <item.Icon className="size-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <form id="inquiry" noValidate onSubmit={onSubmit} className="mt-3">
        <div
          role="tabpanel"
          id={`${formId}-panel`}
          aria-labelledby={`${formId}-tab-${kind}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div
                key="trip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-2.5"
              >
                <label className="block">
                  <span className={`flex items-center gap-3 rounded-full px-4 py-2 focus-within:border-gold-600 focus-within:bg-cream/88 ${glassField}`}>
                    <MapPinIcon className="size-4 shrink-0 text-gold-600" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
                        {kind === "tickets" ? "Route" : "Where to?"}
                      </span>
                      <input
                        id="booking-destination"
                        name="destination"
                        list={listId}
                        autoComplete="off"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder={active.placeholder}
                        aria-invalid={Boolean(errors.destination)}
                        aria-describedby={
                          errors.destination ? `${formId}-destination-error` : undefined
                        }
                        className="w-full bg-transparent pb-1 text-[0.95rem] text-navy-950 outline-none placeholder:text-navy-900/40"
                      />
                    </span>
                  </span>
                  <datalist id={listId}>
                    {PLACES.map((place) => (
                      <option key={place} value={place} />
                    ))}
                  </datalist>
                </label>
                {errors.destination ? (
                  <p id={`${formId}-destination-error`} role="alert" className="px-4 text-[0.75rem] text-[oklch(0.5_0.14_25)]">
                    {errors.destination}
                  </p>
                ) : null}

                <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2">
                  <label className={`block rounded-full px-4 py-2 focus-within:border-gold-600 focus-within:bg-cream/88 ${glassField}`}>
                    <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
                      {kind === "stay" ? "Check-in" : "Date"}
                    </span>
                    <input
                      id={`${formId}-date`}
                      name="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent pb-1 text-[0.9rem] text-navy-950 outline-none scheme-light"
                    />
                  </label>
                  <div className={`flex items-center justify-between rounded-full py-1 pl-4 pr-1.5 ${glassField}`}>
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-600">
                      {travellers} {travellers === 1 ? "guest" : "guests"}
                    </span>
                    <span className="flex">
                      <button
                        type="button"
                        aria-label="Fewer travellers"
                        disabled={travellers <= 1}
                        onClick={() => setTravellers((n) => Math.max(1, n - 1))}
                        className={`grid size-9 place-items-center rounded-full text-lg text-navy-950 disabled:opacity-30 ${focusRingLight}`}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label="More travellers"
                        disabled={travellers >= 12}
                        onClick={() => setTravellers((n) => Math.min(12, n + 1))}
                        className={`grid size-9 place-items-center rounded-full text-lg text-navy-950 disabled:opacity-30 ${focusRingLight}`}
                      >
                        +
                      </button>
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {active.action}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-2.5"
              >
                <p className="px-1 text-[0.78rem] text-navy-900/70">
                  {active.label} · {destination.trim()}
                  {date ? ` · ${date}` : ""} · {travellers}{" "}
                  {travellers === 1 ? "traveller" : "travellers"}
                </p>
                <Field id={`${formId}-name`} label="Your name" error={errors.name}>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                    className={pill}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <Field id={`${formId}-phone`} label="WhatsApp" error={errors.phone}>
                    <input
                      id={`${formId}-phone`}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
                      className={pill}
                    />
                  </Field>
                  <Field id={`${formId}-email`} label="Email" error={errors.email}>
                    <input
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                      className={pill}
                    />
                  </Field>
                </div>
                <Field id={`${formId}-note`} label="Note, optional">
                  <input
                    id={`${formId}-note`}
                    name="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Dates, rooms, anything we should know"
                    className={pill}
                  />
                </Field>
                <Button type="submit" arrow className="w-full">
                  Send enquiry
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setStatus("idle");
                  }}
                  className={`mx-auto block min-h-11 px-4 text-[0.8rem] font-medium text-navy-900/70 ${focusRingLight}`}
                >
                  Back to search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-2 px-2 text-center text-[0.75rem] leading-relaxed text-navy-950/75" aria-live="polite">
          {status === "ready"
            ? "WhatsApp is open with your enquiry. Send it and we will reply from Mankavu."
            : status === "blocked" && whatsappHref
              ? null
              : "Packages, stays, tickets and itineraries. We reply on WhatsApp."}
          {status === "blocked" && whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium text-navy-950 underline decoration-gold-600/70 underline-offset-4 ${focusRingLight}`}
            >
              Continue in WhatsApp
            </a>
          ) : null}
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 px-4 text-[0.75rem] text-[oklch(0.5_0.14_25)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
