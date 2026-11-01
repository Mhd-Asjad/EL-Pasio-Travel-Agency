"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

/** One easing curve for the whole site (expo-out feel, no bounce). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Smooths scroll progress so motion feels weighted, not twitchy. */
export const SPRING = { stiffness: 110, damping: 28, mass: 0.35 } as const;

/**
 * Multiplier for scroll-linked travel distances: 1 normally, 0 when the user
 * prefers reduced motion.
 *
 * It deliberately starts at 1 on BOTH server and client and is only updated
 * after mount. Reading `useReducedMotion()` while computing rendered styles
 * makes the first client render differ from the server HTML (a hydration
 * mismatch) for anyone with reduced motion enabled.
 */
export function useTravel(): MotionValue<number> {
  const travel = useMotionValue(1);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_QUERY);
    const update = () => travel.set(query.matches ? 0 : 1);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [travel]);

  return travel;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe reduced-motion flag (false on the server and during
 * hydration). Only use it for things that are not rendered into the HTML,
 * such as `transition`.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(REDUCED_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** Fade + rise when the element enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  margin = "-12%",
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Bottom viewport margin for the trigger. Use "0%" for content at the very end of the page. */
  margin?: string;
  className?: string;
}) {
  // Only used in `transition`, which is never serialised into the HTML,
  // so it cannot cause a hydration mismatch.
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: `0px 0px ${margin} 0px` }}
      transition={
        reduce ? { duration: 0 } : { duration: 1, ease: EASE, delay }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Slides sideways into place while the element scrolls into view.
 * Scroll-linked, so it reverses when scrolling back up.
 * `from` is in vw (negative = from the left).
 */
export function ScrollSlide({
  children,
  from,
  className,
}: {
  children: ReactNode;
  from: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const travel = useTravel();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 62%"],
  });
  const p = useSpring(scrollYProgress, SPRING);
  const x = useTransform(
    [p, travel] as MotionValue<number>[],
    ([progress, t]: number[]) => `${from * (1 - progress) * t}vw`,
  );
  const opacity = useTransform(p, [0, 0.75], [0, 1]);

  return (
    <motion.span ref={ref} style={{ x, opacity }} className={className}>
      {children}
    </motion.span>
  );
}

/**
 * Vertical parallax for decorative layers. Pass the positioning classes
 * (e.g. `absolute inset-0`) via className; the moving layer is inside.
 */
export function Parallax({
  children,
  distance = 90,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const travel = useTravel();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING);
  const y = useTransform(
    [p, travel] as MotionValue<number>[],
    ([progress, t]: number[]) => (progress * 2 - 1) * distance * t,
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="size-full">
        {children}
      </motion.div>
    </div>
  );
}

/** A line that draws itself in from `origin` when it enters the viewport. */
export function GrowLine({
  axis,
  origin,
  delay = 0,
  className,
}: {
  axis: "x" | "y";
  origin: string;
  delay?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const initial = axis === "x" ? { scaleX: 0 } : { scaleY: 0 };
  const visible = axis === "x" ? { scaleX: 1 } : { scaleY: 1 };
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={{ transformOrigin: origin }}
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={
        reduce ? { duration: 0 } : { duration: 1.2, ease: EASE, delay }
      }
    />
  );
}
