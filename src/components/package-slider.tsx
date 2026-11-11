import Image from "next/image";
import { ButtonLink } from "./ui";

export type TravelPackage = {
  id: string;
  label: string;
  region: string;
  lead: string;
  accent: string;
  blurb: string;
  highlights: string[];
  src: string;
  alt: string;
  href: string;
  bg: string;
  tone: "light" | "dark";
};

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
 * Normal stacked package bands. Even rows put the photo on the left;
 * odd rows flip to text left / photo right so the section is easy to scan.
 */
export function PackageSlider({ packages }: { packages: TravelPackage[] }) {
  return (
    <div>
      {packages.map((pkg, i) => {
        const tone = TONE[pkg.tone];
        const imageLeft = i % 2 === 0;

        return (
          <article
            key={pkg.id}
            aria-label={`${pkg.lead} ${pkg.accent}`.trim()}
            style={{ backgroundColor: pkg.bg }}
            className={`grid md:min-h-[72vh] md:grid-cols-2 ${tone.text}`}
          >
            <div
              className={`relative min-h-[56vw] sm:min-h-[22rem] md:min-h-full ${
                imageLeft ? "" : "md:order-2"
              }`}
            >
              <Image
                src={pkg.src}
                alt={pkg.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div
              className={`flex items-center px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-16 ${
                imageLeft ? "" : "md:order-1"
              }`}
            >
              <div className="w-full max-w-[34rem]">
                {pkg.region ? (
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] opacity-70 sm:text-[0.7rem] sm:tracking-[0.3em]">
                    {pkg.region}
                  </p>
                ) : null}

                <h3 className="mt-4 text-[clamp(2.35rem,6vw,4.5rem)] font-light leading-[0.98] tracking-[-0.045em]">
                  {pkg.lead}{" "}
                  {pkg.accent ? (
                    <span
                      className={`font-display text-[1.1em] font-normal italic ${tone.accent}`}
                    >
                      {pkg.accent}
                    </span>
                  ) : null}
                </h3>

                <p className={`mt-5 max-w-[40ch] text-[0.98rem] leading-[1.7] md:text-[1.05rem] ${tone.body}`}>
                  {pkg.blurb}
                </p>

                {pkg.highlights.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                    {pkg.highlights.map((item) => (
                      <li
                        key={item}
                        className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] opacity-80"
                      >
                        <span aria-hidden="true" className="mr-2 opacity-50">
                          /
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-8">
                  <ButtonLink
                    href={pkg.href}
                    arrow
                    variant={pkg.tone === "dark" ? "primary" : "ghost"}
                    tone={pkg.tone === "dark" ? "dark" : "light"}
                  >
                    Explore this package
                  </ButtonLink>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
