"use client";

import Link from "next/link";
import {
  Palmtree,
  Hotel,
  Ticket,
  Map,
  Heart,
  Plane,
  type LucideIcon,
} from "lucide-react";

type ServiceItem = {
  id: string;
  label: string;
  href: string;
  Icon: LucideIcon;
};

const SERVICES: ServiceItem[] = [
  {
    id: "holiday-packages",
    label: "Holiday Packages",
    href: "/services#holiday-packages",
    Icon: Palmtree,
  },
  {
    id: "resort-bookings",
    label: "Resort & Hotel Stays",
    href: "/services#resort-bookings",
    Icon: Hotel,
  },
  {
    id: "ticketing-services",
    label: "Flight, Train & Bus Tickets",
    href: "/services#ticketing-services",
    Icon: Ticket,
  },
  {
    id: "tour-planning",
    label: "Itinerary Planning",
    href: "/services#tour-planning",
    Icon: Map,
  },
  {
    id: "honeymoon",
    label: "Honeymoon Escapes",
    href: "/services#specialized",
    Icon: Heart,
  },
  {
    id: "national-international",
    label: "National & International Tours",
    href: "/services#holiday-packages",
    Icon: Plane,
  },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {SERVICES.map((service) => {
        const Icon = service.Icon;
        return (
          <li
            key={`${hidden ? "dup-" : ""}${service.id}`}
            className="flex shrink-0 items-center gap-4 pr-10 md:gap-5 md:pr-16"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rotate-45 bg-gold-400/70"
            />
            <Link
              href={service.href}
              tabIndex={hidden ? -1 : 0}
              className="group/item inline-flex items-center gap-2 text-left text-cream/70 transition-colors duration-300 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
            >
              <Icon
                className="size-3.5 shrink-0 text-gold-400/70 transition-colors duration-300 group-hover/item:text-gold-300"
                aria-hidden="true"
              />
              <span className="text-[0.66rem] font-medium uppercase tracking-[0.2em] md:text-[0.72rem] md:tracking-[0.26em]">
                {service.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Auto-scrolling transparent service ticker.
 * Two identical rows slide left for a seamless loop; pauses on hover.
 */
export function ServiceMarquee({ paused = false }: { paused?: boolean }) {
  return (
    <div
      role="region"
      aria-label="Our services"
      className="group relative overflow-hidden border-y border-cream/10 bg-transparent py-3.5 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] md:py-4"
    >
      <div
        className={`flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused] motion-reduce:[animation-duration:90s] ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
      >
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
