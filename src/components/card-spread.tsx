"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "./motion";

/**
 * Fanned deck of cards that spreads open on hover.
 *
 * Local stand-in written against the documented React Bits Pro "Card Spread"
 * props (cards, cardWidth, cardHeight, lift, push, pushReach...). Once the
 * licensed component is installed with
 *   npx shadcn@latest add @reactbits-starter/card-spread-tw
 * swap the import in destinations.tsx; the card data shape stays the same.
 */

export type SpreadCard = {
  id: string;
  src: string;
  alt: string;
  title: string;
  region: string;
  href: string;
  /** Open in a new tab (e.g. WhatsApp). */
  external?: boolean;
};

type Layout = {
  cardWidth: number;
  cardHeight: number;
  /** Horizontal distance between neighbouring card centres at rest. */
  spacing: number;
  /** Rotation added per step away from the centre, degrees. */
  tilt: number;
  /** Vertical sag per step squared, px (makes the arc). */
  drop: number;
  /** How far the hovered card rises, px. */
  lift: number;
  /** How far the nearest neighbour is pushed aside on hover, px. */
  push: number;
};

const DESKTOP: Layout = {
  cardWidth: 236,
  cardHeight: 322,
  spacing: 192,
  tilt: 5.5,
  drop: 7,
  lift: 30,
  push: 46,
};

const COMPACT: Layout = {
  cardWidth: 196,
  cardHeight: 272,
  spacing: 56,
  tilt: 5,
  drop: 8,
  lift: 22,
  push: 54,
};

/** How many neighbours on each side react, with fading strength. */
const PUSH_FALLOFF = [1, 0.5, 0.15];

const SPRING = { type: "spring", stiffness: 150, damping: 24, mass: 1 } as const;

export function CardSpread({
  cards,
  className = "",
}: {
  cards: SpreadCard[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = usePrefersReducedMotion();

  const [width, setWidth] = useState(1200);
  const [active, setActive] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);
  const lastPointer = useRef<string>("mouse");

  // Track container width to pick a layout and scale the fan to fit.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  // After the opening fan-out, hover motion should respond with no delay.
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setSettled(true), 1600);
    return () => window.clearTimeout(t);
  }, [inView]);

  const L = width < 640 ? COMPACT : DESKTOP;
  const n = cards.length;
  const mid = (n - 1) / 2;

  const sway = Math.sin((mid * L.tilt * Math.PI) / 180) * L.cardHeight * 0.5;
  const fanWidth = (n - 1) * L.spacing + L.cardWidth + 2 * (sway + L.push);
  const fanHeight = L.cardHeight + mid * mid * L.drop + L.lift + 28;
  const scale = Math.min(1, width / fanWidth);

  function targetFor(i: number) {
    const k = i - mid;
    let x = k * L.spacing;
    let y = k * k * L.drop;
    let rotate = k * L.tilt;
    let s = 1;

    if (active !== null) {
      const d = i - active;
      if (d === 0) {
        y -= L.lift;
        rotate *= 0.3;
        s = 1.05;
      } else {
        const reach = PUSH_FALLOFF[Math.abs(d) - 1] ?? 0;
        x += Math.sign(d) * L.push * reach;
      }
    }
    return { x, y, rotate, scale: s, opacity: 1 };
  }

  function onCardClick(e: React.MouseEvent, i: number) {
    // On touch, the first tap opens the card; the second follows the link.
    if (lastPointer.current === "touch" && active !== i) {
      e.preventDefault();
      setActive(i);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${className}`}
      style={{ height: fanHeight * scale }}
    >
      <ul
        aria-label="Featured destinations"
        onPointerLeave={(e: PointerEvent) => {
          if (e.pointerType === "mouse") setActive(null);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
        }}
        className="absolute left-1/2 top-0 origin-top"
        style={{
          width: fanWidth,
          height: fanHeight,
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        {cards.map((card, i) => {
          const k = i - mid;
          const isActive = active === i;
          // Captions only on the active card (or the centre card at rest),
          // otherwise overlapping neighbours would clip each other's text.
          const showLabel = isActive || (active === null && i === Math.round(mid));
          const z = isActive ? 50 : Math.round(20 - Math.abs(k) * 4);

          return (
            <motion.li
              key={card.id}
              initial={{
                x: 0,
                y: 48,
                rotate: 0,
                scale: 0.9,
                opacity: 0,
              }}
              animate={
                inView
                  ? targetFor(i)
                  : { x: 0, y: 48, rotate: 0, scale: 0.9, opacity: 0 }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      ...SPRING,
                      delay: settled ? 0 : 0.12 + Math.abs(k) * 0.09,
                    }
              }
              onPointerEnter={(e) => {
                lastPointer.current = e.pointerType;
                if (e.pointerType === "mouse") setActive(i);
              }}
              onPointerDown={(e) => {
                lastPointer.current = e.pointerType;
              }}
              data-active={isActive}
              data-label={showLabel}
              className="group absolute rounded-[1.3rem] bg-cream p-[3px] shadow-[0_32px_60px_-26px_oklch(0.1_0.05_258/0.9)] will-change-transform"
              style={{
                width: L.cardWidth,
                height: L.cardHeight,
                left: `calc(50% - ${L.cardWidth / 2}px)`,
                top: L.lift + 8,
                zIndex: z,
              }}
            >
              <a
                href={card.href}
                {...(card.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                aria-label={`Plan a trip to ${card.title}, ${card.region}`}
                onFocus={() => setActive(i)}
                onClick={(e) => onCardClick(e, i)}
                className="relative block size-full overflow-hidden rounded-[1.1rem] bg-navy-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="240px"
                  draggable={false}
                  className="select-none object-cover transition-transform duration-[900ms] ease-spring group-data-[active=true]:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-navy-950/90 via-navy-950/40 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left opacity-0 transition-opacity duration-500 ease-spring group-data-[label=true]:opacity-100">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-gold-300">
                    {card.region}
                  </p>
                  <p className="mt-1 text-[1.15rem] font-light leading-tight tracking-[-0.02em] text-cream">
                    {card.title}
                  </p>
                  <p className="mt-2 flex h-0 items-center gap-1.5 overflow-hidden text-[0.68rem] font-medium tracking-[0.06em] text-cream/85 opacity-0 transition-[height,opacity] duration-500 ease-spring group-data-[active=true]:h-4 group-data-[active=true]:opacity-100">
                    Plan this trip
                    <span aria-hidden="true">→</span>
                  </p>
                </div>
              </a>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
