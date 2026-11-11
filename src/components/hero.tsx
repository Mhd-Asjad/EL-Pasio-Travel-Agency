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
import { useState, useRef } from "react";
import { ScrollIcon } from "./icons";
import { HeroSearch, type HeroSearchItem } from "./hero-search";
import { ServiceMarquee } from "./marquee";
import { EASE, SPRING, useTravel } from "./motion";
import { SiteHeader } from "./site-header";
import { bodyClass, focusRing, headlineClass } from "./ui";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function Hero({ searchItems }: { searchItems: HeroSearchItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const travel = useTravel();
  const [searchActive, setSearchActive] = useState(false);

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
    <div className={searchActive ? "relative z-50" : "relative z-0"}>
      <section
        ref={ref}
        id="home"
        aria-labelledby="hero-title"
        className="relative flex min-h-[100dvh] flex-col bg-navy-950 text-center"
      >
        {/* Clip parallax bleed here only — never on the section, or search results get cut off. */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <motion.div
            style={{ y: bgY, scale: bgScale }}
            className="absolute inset-x-0 -top-[10%] h-[115%] will-change-transform"
          >
            <Image
              src="/images/hero-mountain-lake.jpg"
              alt="A snow-capped mountain glowing at sunset above pine forest, mirrored in a still lake"
              fill
              preload
              loading="eager"
              sizes="100vw"
              quality={85}
              className="object-cover object-center"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.2_0.055_258/0.65)_0%,oklch(0.2_0.055_258/0.38)_40%,oklch(0.2_0.055_258/0.9)_100%)]" />
        </div>

        <SiteHeader />

        <motion.div
          variants={group}
          initial="hidden"
          animate="show"
          className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-32 md:px-10 md:pt-36"
        >
          <motion.p
            variants={item}
            className="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-gold-300 md:text-xs md:tracking-[0.45em]"
          >
            Journey Beyond Destinations
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={item}
            className={`mt-6 max-w-[18ch] text-[clamp(2.2rem,6.5vw,5.5rem)] md:mt-8 ${headlineClass}`}
          >
            Explore, Dream, Discover
          </motion.h1>

          <motion.p
            variants={item}
            className={`mx-auto mt-6 max-w-[46ch] text-pretty text-[1rem] leading-relaxed md:mt-8 md:text-[1.2rem] ${bodyClass}`}
          >
            Handcrafted holiday packages, luxury resort stays, and hassle-free
            transit tickets. Planned with care from Mankavu, Calicut.
          </motion.p>

          <motion.div
            variants={item}
            className="relative z-40 mt-8 w-full max-w-[34rem] px-0 md:mt-10"
          >
            <HeroSearch items={searchItems} onActiveChange={setSearchActive} />
          </motion.div>
        </motion.div>

        <div
          aria-hidden={searchActive || undefined}
          className={`relative z-10 pb-5 transition-opacity duration-300 md:pb-6 ${
            searchActive ? "pointer-events-none opacity-25" : "opacity-100"
          }`}
        >
          <a
            href="#destinations"
            aria-label="Scroll to destinations"
            className={`mx-auto grid size-11 place-items-center text-cream ${focusRing}`}
          >
            <ScrollIcon className="size-5" />
          </a>
        </div>
      </section>

      <div
        aria-hidden={searchActive || undefined}
        className={`bg-navy-950 transition-opacity duration-300 ${
          searchActive ? "pointer-events-none opacity-40" : "opacity-100"
        }`}
      >
        <ServiceMarquee paused={searchActive} />
      </div>
    </div>
  );
}
