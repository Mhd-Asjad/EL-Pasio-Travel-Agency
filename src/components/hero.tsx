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
import { Palmtree, Hotel, Plane } from "lucide-react";
import { ScrollIcon } from "./icons";
import { ServiceMarquee } from "./marquee";
import { EASE, SPRING, useTravel } from "./motion";
import { SiteHeader } from "./site-header";
import { ButtonLink, bodyClass, focusRing, headlineClass } from "./ui";
import { whatsappUrl } from "@/lib/contact";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

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
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-navy-950 text-center"
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
          loading="eager"
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.2_0.055_258/0.65)_0%,oklch(0.2_0.055_258/0.38)_40%,oklch(0.2_0.055_258/0.9)_100%)]"
      />

      <SiteHeader />

      <motion.div
        variants={group}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-32 md:px-10 md:pt-36"
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

        {/* Architectural Gold Underline */}
        <motion.div
          variants={item}
          aria-hidden="true"
          className="mx-auto mt-6 flex items-center justify-center gap-2"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400/60" />
          <div className="size-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(242,207,120,0.6)]" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400/60" />
        </motion.div>

        <motion.p
          variants={item}
          className={`mx-auto mt-6 max-w-[46ch] text-pretty text-[1rem] leading-relaxed md:mt-8 md:text-[1.2rem] ${bodyClass}`}
        >
          Handcrafted holiday packages, luxury resort stays, and hassle-free transit
          tickets. Planned with care from Mankavu, Calicut.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10"
        >
          <ButtonLink href="#destinations" arrow>
            Explore Destinations
          </ButtonLink>
          <ButtonLink
            href={whatsappUrl("Hello EL PASEO Tours & Travels, I would like to plan a trip.")}
            external
            variant="ghost"
          >
            Chat on WhatsApp
          </ButtonLink>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-xs text-cream/75 md:mt-12"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-navy-950/60 backdrop-blur-md px-3.5 py-1.5">
            <Palmtree className="size-3.5 text-gold-400" />
            <span>Curated Holiday Packages</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-navy-950/60 backdrop-blur-md px-3.5 py-1.5">
            <Hotel className="size-3.5 text-gold-400" />
            <span>Luxury Resort Stays</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-navy-950/60 backdrop-blur-md px-3.5 py-1.5">
            <Plane className="size-3.5 text-gold-400" />
            <span>Flight, Train & Bus Bookings</span>
          </span>
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        <a
          href="#destinations"
          aria-label="Scroll to destinations"
          className={`mx-auto mb-2 grid size-11 place-items-center text-cream ${focusRing}`}
        >
          <ScrollIcon className="size-5" />
        </a>
        <ServiceMarquee />
      </div>
    </section>
  );
}
