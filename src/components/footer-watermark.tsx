"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SPRING, useTravel } from "./motion";

/**
 * Giant faded brand word at the very end of the page. As the visitor
 * scrolls to the bottom, "EL" slides in from the left and "PASEO" from the
 * right (x axis) until the word settles in its final position.
 * Scroll-linked, so it also reverses when scrolling back up.
 */
export function FooterWatermark() {
  const ref = useRef<HTMLDivElement>(null);
  const travel = useTravel();

  // 0 when the word first peeks into view, 1 when the page bottom is reached.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const p = useSpring(scrollYProgress, SPRING);

  const xLeft = useTransform(
    [p, travel] as MotionValue<number>[],
    ([progress, t]: number[]) => `${-60 * (1 - progress) * t}vw`,
  );
  const xRight = useTransform(
    [p, travel] as MotionValue<number>[],
    ([progress, t]: number[]) => `${60 * (1 - progress) * t}vw`,
  );
  const opacity = useTransform(p, [0, 0.7], [0, 1]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none mt-10 h-[0.74em] select-none overflow-hidden whitespace-nowrap pl-[0.03em] text-center text-[18vw] font-semibold uppercase leading-[0.9] tracking-[0.03em] text-navy-950/25 [mask-image:linear-gradient(to_bottom,black_15%,transparent_95%)] md:mt-16"
    >
      <motion.span style={{ x: xLeft, opacity }} className="inline-block">
        EL
      </motion.span>
      {"\u00A0"}
      <motion.span style={{ x: xRight, opacity }} className="inline-block">
        PASEO
      </motion.span>
    </div>
  );
}
