"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { BookingDesk } from "./booking-desk";
import { ScrollIcon } from "./icons";
import { ServiceMarquee } from "./marquee";
import { EASE, SPRING, useTravel } from "./motion";
import { SiteHeader } from "./site-header";
import { Button, accentClass, bodyClass, focusRing, headlineClass } from "./ui";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

function focusSearch() {
  const field = document.getElementById("booking-destination");
  field?.scrollIntoView({ behavior: "smooth", block: "center" });
  field?.focus();
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const travel = useTravel();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING);

  const scaled = (fn: (progress: number, t: number) => number | string) =>
    [
      [p, travel] as MotionValue<number>[],
      ([progress, t]: number[]) => fn(progress, t),
    ] as const;

  const bgY = useTransform(...scaled((v, t) => `${v * 8 * t}%`));
  const bgScale = useTransform(...scaled((v, t) => 1 + v * 0.06 * t));

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-navy-950"
    >
          <motion.div
            style={{ y: bgY, scale: bgScale }}
            className="absolute inset-x-0 -top-[10%] -z-20 h-[115%] will-change-transform"
          >
            <Image
              src="/images/hero-mountain-lake.jpg"
              alt="A snow-capped mountain glowing at sunset above pine forest, mirrored in a still lake"
              fill
              preload
              sizes="100vw"
              quality={85}
              className="object-cover object-[62%_45%]"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.2_0.055_258/0.5)_0%,transparent_30%),linear-gradient(90deg,oklch(0.2_0.055_258/0.72)_0%,oklch(0.2_0.055_258/0.28)_42%,oklch(0.2_0.055_258/0.2)_100%)]"
          />

          <SiteHeader />

          <motion.div
            variants={group}
            initial="hidden"
            animate="show"
            className="mx-auto grid w-full max-w-[1400px] flex-1 content-center items-center gap-14 px-5 pb-10 pt-28 md:gap-16 md:px-10 md:pt-32 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0"
          >
            <div className="max-w-xl lg:col-span-6 lg:py-6">
              <motion.p
                variants={item}
                className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-gold-300 md:text-xs md:tracking-[0.4em]"
              >
                Journey Beyond Destinations
              </motion.p>
              <motion.h1
                id="hero-title"
                variants={item}
                className={`mt-6 whitespace-nowrap text-[clamp(1.45rem,0.72rem+3.1vw,3.35rem)] md:mt-8 lg:mt-10 ${headlineClass}`}
              >
                Explore, <span className={accentClass}>Dream,</span> Discover
              </motion.h1>
              <motion.p
                variants={item}
                className={`mt-6 max-w-[36ch] text-[0.98rem] leading-relaxed md:mt-8 md:text-[1.05rem] lg:mt-9 ${bodyClass}`}
              >
                Holiday packages, resort stays, and flight, train and bus
                tickets, planned from Mankavu, Calicut.
              </motion.p>
              <motion.div variants={item} className="mt-7 md:mt-8 lg:mt-10">
                <Button type="button" arrow onClick={focusSearch}>
                  Plan my trip
                </Button>
              </motion.div>
            </div>

            <motion.div variants={item} className="lg:col-span-5 lg:col-start-8">
              <BookingDesk />
            </motion.div>
          </motion.div>

      <div className="relative z-10">
        <a
          href="#about"
          aria-label="Scroll to about"
          className={`mx-auto mb-1 grid size-11 place-items-center text-cream ${focusRing}`}
        >
          <ScrollIcon className="size-5" />
        </a>
        <ServiceMarquee />
      </div>
    </section>
  );
}
