import { Parallax, Reveal } from "./motion";
import { ButtonLink, Eyebrow, bodyClass } from "./ui";

// Approved copy from doc/prd.md section 7.1. Use exactly as written.
// Split only so the motto can be styled; joined, it is the original text.
const COPY_BEFORE =
  'At EL PASEO Tours & Travels, based in Mankavu, Calicut, we believe that travel is more than just reaching a location—it\'s about the journey. Guided by our motto, "';
const COPY_MOTTO = "Journey Beyond Destinations,";
const COPY_AFTER =
  '" we are your complete travel partner dedicated to crafting unforgettable travel experiences. Whether you are seeking luxury resort stays, customized holiday packages, or hassle-free transit bookings, EL PASEO handles every detail so you can explore, dream, and discover with peace of mind.';

const SLOGANS = [
  "Your Complete Travel Partner",
  "Explore, Dream, Discover",
  "Your Journey, Our Priority",
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-navy-950 text-cream"
    >
      {/* Drifting glows: same navy + gold family as the hero overlays */}
      <Parallax
        distance={120}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[8%] h-[38rem] w-[64rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.6),transparent)]" />
        <div className="absolute left-1/2 top-[30%] h-[22rem] w-[30rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.1),transparent)]" />
      </Parallax>

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-5 py-24 text-center md:px-10 md:py-36">
        <Reveal>
          <Eyebrow className="!text-xl !font-semibold !tracking-[0.4em] md:!text-3xl md:!tracking-[0.45em]">About Us</Eyebrow>
        </Reveal>

        <h2 id="about-title" className="sr-only">Journey Beyond Destinations</h2>

        <Reveal className="mt-10 md:mt-12">
          <p
            className={`max-w-[56ch] text-pretty text-[1.05rem] font-normal leading-[1.85] md:text-[1.25rem] md:leading-[1.9] ${bodyClass}`}
          >
            {COPY_BEFORE}
            <span className="font-display text-[1.14em] font-normal italic leading-[0] text-gold-300">
              {COPY_MOTTO}
            </span>
            {COPY_AFTER}
          </p>
        </Reveal>

        <ul
          aria-label="Our promise"
          className="mt-14 grid w-full max-w-5xl grid-cols-1 gap-y-5 md:mt-16 lg:grid-cols-3 lg:divide-x lg:divide-cream/15"
        >
          {SLOGANS.map((s, i) => (
            <li key={s}>
              <Reveal delay={i * 0.12} y={24}>
                <span className="block px-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-cream/75 md:text-[0.7rem] lg:whitespace-nowrap lg:tracking-[0.2em]">
                  {s}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-14 md:mt-16">
          <ButtonLink href="#inquiry" arrow>
            Plan Your Trip
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
