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
import { ServiceMarquee } from "./marquee";
import { EASE, SPRING, useTravel } from "./motion";
import {
  ButtonLink,
  Eyebrow,
  accentClass,
  bodyClass,
  headlineClass,
} from "./ui";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const travel = useTravel();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING);

  // Every travel distance is scaled by `travel` (1, or 0 for reduced motion).
  const scaled = (fn: (progress: number, t: number) => number | string) =>
    [
      [p, travel] as MotionValue<number>[],
      ([progress, t]: number[]) => fn(progress, t),
    ] as const;

  // Photo: drifts down slower than the page and slowly zooms.
  const bgY = useTransform(...scaled((v, t) => `${v * 12 * t}%`));
  const bgScale = useTransform(...scaled((v, t) => 1 + v * 0.12 * t));
  // Content: rises faster than the page and fades out.
  const contentY = useTransform(...scaled((v, t) => v * -150 * t));
  const contentOpacity = useTransform(
    ...scaled((v, t) => 1 - Math.min(v / 0.62, 1) * t),
  );
  // Headline words split apart.
  const exploreX = useTransform(...scaled((v, t) => v * -110 * t));
  const discoverX = useTransform(...scaled((v, t) => v * 110 * t));
  const dreamY = useTransform(...scaled((v, t) => v * -50 * t));
  // Navy veil builds so the hero melts into the About section.
  const veil = useTransform(p, [0.25, 1], [0, 1]);

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-navy-950 text-cream"
    >
      {/* Background photo (oversized so parallax never exposes an edge) */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-x-0 -top-[14%] -z-20 h-[116%] will-change-transform"
      >
        <Image
          src="/images/hero-mountain-lake.jpg"
          alt="A snow-capped mountain glowing at sunset above pine forest, mirrored in a still lake"
          fill
          preload
          sizes="100vw"
          quality={85}
          className="object-cover object-[50%_50%]"
        />
      </motion.div>

      {/* Readability overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,oklch(0.2_0.055_258/0.65)_0%,oklch(0.2_0.055_258/0.1)_26%,oklch(0.2_0.055_258/0.28)_52%,oklch(0.2_0.055_258/0.82)_88%,oklch(0.2_0.055_258)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_42%_at_50%_44%,oklch(0.2_0.055_258/0.55),transparent_80%)]"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: veil }}
        className="absolute inset-0 -z-10 bg-navy-950"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-36 text-center md:px-10 md:pb-24 md:pt-40"
      >
        <motion.div
          variants={group}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={item}>
            <Eyebrow>Journey Beyond Destinations</Eyebrow>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={item}
            className={`mt-7 text-[clamp(3rem,13vw,3.75rem)] md:text-[clamp(3.75rem,7.4vw,7rem)] ${headlineClass}`}
          >
            <motion.span
              style={{ x: exploreX }}
              className="block md:inline-block"
            >
              Explore,
            </motion.span>{" "}
            <motion.span
              style={{ y: dreamY }}
              className={`block md:inline-block ${accentClass}`}
            >
              Dream,
            </motion.span>{" "}
            <motion.span style={{ x: discoverX }} className="block">
              Discover
            </motion.span>
          </motion.h1>

          <motion.p
            variants={item}
            className={`mt-7 max-w-[52ch] text-[0.95rem] font-normal leading-relaxed md:mt-8 md:text-[1.05rem] ${bodyClass}`}
          >
            From Calicut to the rest of the world. Holiday packages, resort
            stays and every flight, train and bus ticket, planned by people who
            treat your journey as their own.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center"
          >
            <ButtonLink href="#inquiry" arrow>
              Plan My Trip
            </ButtonLink>
            <ButtonLink href="#packages" variant="ghost">
              Explore Destinations
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Service ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.9 }}
      >
        <ServiceMarquee />
      </motion.div>
    </section>
  );
}
