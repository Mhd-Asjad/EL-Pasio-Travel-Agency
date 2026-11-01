"use client";

import { motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrefersReducedMotion } from "./motion";
import { focusRing } from "./ui";

export type Testimonial = {
  id: string;
  name: string;
  from: string;
  avatar: string;
  title: string;
  body: string;
  trip: string;
  date: string;
};

const AUTOPLAY_MS = 7000;
const SPRING = { type: "spring", stiffness: 140, damping: 24, mass: 1 } as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function Stars() {
  return (
    <span className="flex gap-0.5" role="img" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="size-4 text-gold-500"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.8l2.4 5.2 5.7.6-4.2 3.9 1.2 5.6L10 14.2 4.9 17.1l1.2-5.6L1.900 7.600l5.700-.6L10 1.800Z" />
        </svg>
      ))}
    </span>
  );
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const n = items.length;
  const reduce = usePrefersReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);
  const [width, setWidth] = useState(1200);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + n) % n),
    [n],
  );

  // Gentle autoplay: stops on hover/focus/touch and for reduced motion.
  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, reduce, go]);

  const cardWidth = Math.min(560, width * 0.86);
  const spacing = cardWidth * (width < 640 ? 0.98 : 0.9);

  function onDragEnd(_: unknown, info: PanInfo) {
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power < -80) go(1);
    else if (power > 80) go(-1);
    window.setTimeout(() => (didDrag.current = false), 50);
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Traveller testimonials"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="w-full"
    >
      {/* Stage: all cards share one grid cell, so height = tallest card. */}
      <motion.div
        ref={stageRef}
        drag="x"
        dragSnapToOrigin
        dragElastic={0.16}
        dragMomentum={false}
        onDragStart={() => (didDrag.current = true)}
        onDragEnd={onDragEnd}
        aria-live={paused || reduce ? "polite" : "off"}
        className="grid cursor-grab touch-pan-y select-none place-items-center py-10 active:cursor-grabbing"
        style={{ perspective: 1400 }}
      >
        {items.map((t, i) => {
          let d = (((i - index) % n) + n) % n;
          if (d > n / 2) d -= n;
          const abs = Math.abs(d);
          const isActive = d === 0;

          return (
            <motion.article
              key={t.id}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              onClick={() => {
                if (!isActive && abs === 1 && !didDrag.current) setIndex(i);
              }}
              initial={false}
              animate={{
                x: d * spacing,
                scale: isActive ? 1 : 0.9,
                rotateY: d * -9,
                opacity: isActive ? 1 : abs === 1 ? 0.55 : 0,
                filter: isActive ? "blur(0px)" : "blur(2.5px)",
              }}
              transition={
                reduce || abs >= 3 ? { duration: 0 } : { ...SPRING, opacity: { duration: 0.35 } }
              }
              className={`col-start-1 row-start-1 flex flex-col rounded-[1.6rem] bg-cream p-7 text-navy-950 md:p-9 ${
                isActive ? "" : "cursor-pointer"
              } shadow-[0_2px_4px_oklch(0.2_0.055_258/0.06),0_18px_32px_-14px_oklch(0.05_0.04_258/0.55),0_50px_90px_-36px_oklch(0.05_0.04_258/0.85)]`}
              style={{
                width: cardWidth,
                zIndex: isActive ? 10 : 5 - abs,
                pointerEvents: abs > 1 ? "none" : "auto",
              }}
            >
              <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="size-12 ring-2 ring-gold-400/70 ring-offset-2 ring-offset-cream">
                    <AvatarImage
                      src={t.avatar}
                      alt=""
                      width={96}
                      height={96}
                      draggable={false}
                    />
                    <AvatarFallback>{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="text-[1.05rem] font-medium tracking-[-0.01em]">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-[0.8rem] text-navy-700">
                      from {t.from}
                    </p>
                  </div>
                </div>
                <Stars />
              </header>

              <h3 className="mt-8 text-[clamp(1.4rem,3.4vw,1.85rem)] font-light leading-[1.15] tracking-[-0.025em]">
                &ldquo;{t.title}&rdquo;
              </h3>
              <p className="mt-4 max-w-[60ch] text-[0.98rem] leading-[1.75] text-navy-900/80 md:text-[1.02rem]">
                {t.body}
              </p>

              <footer className="mt-8 flex items-center gap-3 border-t border-navy-950/10 pt-5 text-[0.82rem] font-medium tracking-[0.02em]">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rotate-45 bg-gold-500"
                />
                {t.trip} <span className="text-navy-700">&middot;</span>{" "}
                <span className="text-navy-700">{t.date}</span>
              </footer>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Controls */}
      <div className="mt-4 flex flex-col items-center gap-4 md:mt-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className={`relative grid size-9 place-items-center rounded-full border border-cream/35 before:absolute before:-inset-1.5 before:content-[''] bg-cream/5 text-cream backdrop-blur-sm transition-[transform,background-color,border-color] duration-500 ease-spring hover:border-cream hover:bg-cream/15 active:scale-90 ${focusRing}`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>

          <p
            className="w-14 text-center text-[0.68rem] font-medium tracking-[0.28em] text-cream/75 tabular-nums"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1.5 text-gold-400">/</span>
            {String(n).padStart(2, "0")}
          </p>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className={`relative grid size-9 place-items-center rounded-full border border-cream/35 before:absolute before:-inset-1.5 before:content-[''] bg-cream/5 text-cream backdrop-blur-sm transition-[transform,background-color,border-color] duration-500 ease-spring hover:border-cream hover:bg-cream/15 active:scale-90 ${focusRing}`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === index}
              className={`relative grid h-5 place-items-center ${focusRing}`}
            >
              <span
                className={`block h-1 rounded-full transition-[width,background-color] duration-500 ease-spring ${
                  i === index ? "w-6 bg-gold-400" : "w-1 bg-cream/30 hover:bg-cream/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
