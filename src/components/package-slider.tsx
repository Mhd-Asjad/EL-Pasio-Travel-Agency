"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { SPRING, usePrefersReducedMotion } from "./motion";
import { ButtonLink, focusRing } from "./ui";

export type TravelPackage = {
  id: string;
  /** Short label for the progress nav. */
  label: string;
  region: string;
  lead: string;
  accent: string;
  blurb: string;
  highlights: string[];
  src: string;
  alt: string;
  href: string;
  /** Panel colour; also the colour of its strip while it waits on the right. */
  bg: string;
  /** "light" = dark text on a light panel, "dark" = cream text. */
  tone: "light" | "dark";
};

/** How many upcoming panels peek in as strips on the right. */
const STRIPS = 2;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Ease-in-out cubic. */
const inOut = (g: number) =>
  g < 0.5 ? 4 * g * g * g : 1 - Math.pow(-2 * g + 2, 3) / 2;

const TONE = {
  light: {
    text: "text-navy-950",
    accent: "text-[oklch(0.42_0.09_70)]",
    body: "text-navy-950/80",
  },
  dark: {
    text: "text-cream",
    accent: "text-gold-300",
    body: "text-cream/85",
  },
} as const;

/**
 * Pinned horizontal "expanding strips" slider.
 *
 * The section is `n` viewports tall and its stage is `sticky`, so vertical
 * scroll drives `t` (0..n-1). Panels not yet reached wait on the right as
 * narrow coloured strips, each with a small photo. As `t` reaches a panel,
 * its strip slides left to fill the stage and its photo grows to full size
 * while the title and details come into view.
 */
export function PackageSlider({ packages }: { packages: TravelPackage[] }) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <StackedPackages packages={packages} />;
  return <StickySlider packages={packages} />;
}

function StickySlider({ packages }: { packages: TravelPackage[] }) {
  const n = packages.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 0..n-1 with a rest at every whole number, then spring-smoothed.
  const stepped = useTransform(scrollYProgress, (p) => {
    const v = clamp(p) * (n - 1);
    const i = Math.min(Math.floor(v), n - 2);
    const g = clamp((v - i - 0.14) / 0.72);
    return i + inOut(g);
  });
  const t = useSpring(stepped, SPRING);

  useMotionValueEvent(t, "change", (v) => setActive(Math.round(v)));

  function goTo(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (i / (n - 1)) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <div
      ref={sectionRef}
      style={{ height: `${n * 100}svh` }}
      className="relative"
    >
      {/* `cqw` units below are relative to this stage. --W is the card width. */}
      <div
        style={{ "--W": "calc(100cqw - 2 * var(--pad))" } as React.CSSProperties}
        className="sticky top-0 h-svh overflow-hidden bg-navy-950 [--pad:0px] [--gap:0.75rem] [--sw:13cqw] [container-type:inline-size] md:[--gap:1.5rem] md:[--sw:11cqw]"
      >
        {packages.map((pkg, i) => (
          <Panel
            key={pkg.id}
            pkg={pkg}
            index={i}
            count={n}
            t={t}
            inactive={active !== i}
          />
        ))}

        <ProgressNav
          packages={packages}
          t={t}
          active={active}
          onSelect={goTo}
        />
      </div>
    </div>
  );
}

function Panel({
  pkg,
  index,
  count,
  t,
  inactive,
}: {
  pkg: TravelPackage;
  index: number;
  count: number;
  t: MotionValue<number>;
  inactive: boolean;
}) {
  const tone = TONE[pkg.tone];
  // Strips this panel leaves visible on its right when it is the current one.
  const stripsAfter = Math.min(count - 1 - index, STRIPS);

  // m: 0 once reached, 1 while waiting as a strip. c: strip slots counted
  // from the right edge. The panel's left edge sits at m * (W - c * sw) and
  // its right edge is pinned to the stage, so its width is W minus that.
  const geometry = (v: number) => {
    const m = clamp(index - v);
    const reach = Math.min(v + STRIPS, count - 1);
    const c = Math.max(0, reach - index + 1);
    return { m, c };
  };
  const x = useTransform(t, (v) => {
    const { m, c } = geometry(v);
    return `calc(${m} * var(--W) - ${m * c} * var(--sw))`;
  });
  const width = useTransform(t, (v) => {
    const { m, c } = geometry(v);
    return `calc(${1 - m} * var(--W) + ${m * c} * var(--sw))`;
  });
  // 0 = small strip photo, 1 = fully expanded.
  const p = useTransform(t, (v) => clamp(1 - (index - v)));
  const textOpacity = useTransform(p, (v) => clamp((v - 0.55) / 0.45));
  const textY = useTransform(p, (v) => `${(1 - clamp((v - 0.4) / 0.6)) * 28}px`);
  const photoScale = useTransform(p, (v) => 1.35 - 0.35 * v);

  const style = {
    x,
    zIndex: index + 1,
    backgroundColor: pkg.bg,
    "--p": p,
    width,
    "--box": `calc(var(--W) - ${stripsAfter} * var(--sw) - var(--gap))`,
  } as unknown as MotionStyle;

  return (
    <motion.article
      aria-label={`${pkg.lead} ${pkg.accent}`}
      // Off-screen panels must not be focusable.
      inert={inactive}
      style={style}
      className={`absolute bottom-[var(--pad)] left-[var(--pad)] top-[var(--pad)] overflow-hidden rounded-[0.5rem] will-change-transform [--fh0:26%] [--fh1:34%] [--fw:0.9] [--ib:5.25rem] md:[--fh0:34%] md:[--fh1:62%] md:[--fw:0.44] md:[--ib:5.75rem] ${tone.text}`}
    >
      {/* Content box: the part of the panel left uncovered by later strips. */}
      <div className="absolute inset-y-0 left-0" style={{ width: "var(--box)" }}>
        {/* Photo: a strip-wide thumbnail that grows to its full size. */}
        <div
          className="absolute overflow-hidden rounded-[0.375rem] bg-navy-900"
          style={{
            bottom: "var(--ib)",
            left: "calc((var(--box) - var(--box) * var(--fw)) * var(--p))",
            width:
              "calc(var(--sw) + (var(--box) * var(--fw) - var(--sw)) * var(--p))",
            height: "calc(var(--fh0) + (var(--fh1) - var(--fh0)) * var(--p))",
          }}
        >
          <motion.div
            style={{ scale: photoScale }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={pkg.src}
              alt={pkg.alt}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              draggable={false}
              className="select-none object-cover"
            />
          </motion.div>
        </div>

        {/* Copy */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-x-5 top-7 md:inset-x-auto md:left-10 md:top-12 md:w-[47%]"
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] opacity-70 md:text-[0.7rem]">
            {pkg.region}
          </p>
          <h3 className="mt-3 text-[clamp(2.5rem,12cqw,3.4rem)] font-light leading-[0.98] tracking-[-0.045em] md:mt-5 md:text-[clamp(3.25rem,6.4cqw,7rem)]">
            <span className="block">{pkg.lead}</span>
            <span
              className={`block font-display text-[1.1em] font-normal italic tracking-[-0.02em] ${tone.accent}`}
            >
              {pkg.accent}
            </span>
          </h3>

          <p
            className={`mt-4 max-w-[40ch] text-pretty text-[0.9rem] leading-[1.6] md:mt-7 md:text-[1.05rem] md:leading-[1.7] ${tone.body}`}
          >
            {pkg.blurb}
          </p>

          <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 md:flex">
            {pkg.highlights.map((h) => (
              <li
                key={h}
                className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
              >
                <span aria-hidden="true" className="mr-2 opacity-60">
                  /
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-5 md:mt-9">
            <ButtonLink
              href={pkg.href}
              external
              arrow
              variant={pkg.tone === "dark" ? "primary" : "ghost"}
              tone={pkg.tone === "dark" ? "dark" : "light"}
            >
              Plan this trip
            </ButtonLink>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function ProgressNav({
  packages,
  t,
  active,
  onSelect,
}: {
  packages: TravelPackage[];
  t: MotionValue<number>;
  active: number;
  onSelect: (i: number) => void;
}) {
  const tone = packages[active].tone;
  return (
    <nav
      aria-label="Travel packages"
      style={{ right: `calc(var(--pad) + ${STRIPS} * var(--sw))` }}
      className={`absolute bottom-[var(--pad)] left-[var(--pad)] z-[50] px-5 pb-5 transition-colors duration-500 md:px-10 md:pb-8 ${TONE[tone].text}`}
    >
      {/* Phones: only the current name fits. */}
      <p className="mb-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] md:hidden">
        {packages[active].label}
      </p>
      <ol className="flex items-stretch gap-2 md:gap-6">
        {packages.map((pkg, i) => (
          <li key={pkg.id} className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={pkg.label}
              aria-current={active === i ? "true" : undefined}
              className={`group block w-full py-1 text-left ${focusRing}`}
            >
              <span
                className={`hidden truncate text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-opacity duration-500 md:block ${
                  active === i ? "opacity-100" : "opacity-45 group-hover:opacity-80"
                }`}
              >
                {pkg.label}
              </span>
              <NavBar t={t} index={i} />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NavBar({ t, index }: { t: MotionValue<number>; index: number }) {
  // Segment i fills while the slider travels from panel i-1 to panel i.
  const scaleX = useTransform(t, (v) =>
    index === 0 ? 1 : clamp(v - (index - 1)),
  );
  return (
    <span className="relative mt-2 block h-px w-full bg-current/25 md:mt-3">
      <motion.span
        aria-hidden="true"
        style={{ scaleX }}
        className="absolute inset-0 origin-left bg-current"
      />
    </span>
  );
}

/** Reduced-motion layout: no pinning or sliding, just stacked cards. */
function StackedPackages({ packages }: { packages: TravelPackage[] }) {
  return (
    <div className="bg-navy-950">
      {packages.map((pkg) => {
        const tone = TONE[pkg.tone];
        return (
          <article
            key={pkg.id}
            aria-label={`${pkg.lead} ${pkg.accent}`}
            style={{ backgroundColor: pkg.bg }}
            className={`rounded-[0.5rem] px-5 py-14 md:px-10 md:py-20 ${tone.text}`}
          >
            <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-2 md:items-center md:gap-14">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-70">
                  {pkg.region}
                </p>
                <h3 className="mt-4 text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.98] tracking-[-0.045em]">
                  {pkg.lead}{" "}
                  <span
                    className={`font-display text-[1.1em] font-normal italic ${tone.accent}`}
                  >
                    {pkg.accent}
                  </span>
                </h3>
                <p className={`mt-5 max-w-[40ch] leading-[1.7] ${tone.body}`}>
                  {pkg.blurb}
                </p>
                <div className="mt-7">
                  <ButtonLink
                    href={pkg.href}
                    external
                    arrow
                    variant={pkg.tone === "dark" ? "primary" : "ghost"}
                    tone={pkg.tone === "dark" ? "dark" : "light"}
                  >
                    Plan this trip
                  </ButtonLink>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.375rem]">
                <Image
                  src={pkg.src}
                  alt={pkg.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
