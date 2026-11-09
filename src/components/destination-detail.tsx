import Image from "next/image";
import Link from "next/link";
import { whatsappUrl } from "@/lib/contact";
import type { AdminDestination, AdminPackage } from "@/lib/db";
import { Reveal } from "./motion";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ButtonLink, bodyClass, headlineClass } from "./ui";
import { SectionHeader } from "./section-header";

export function DestinationDetail({
  destination,
  packages,
  moreDestinations,
}: {
  destination: AdminDestination;
  packages: AdminPackage[];
  moreDestinations: AdminDestination[];
}) {
  const planHref = whatsappUrl(
    `Hello EL PASEO Tours & Travels, I would like to plan a trip to ${destination.title}.`,
  );
  const countLabel =
    packages.length === 1 ? "1 package" : `${packages.length} packages`;

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] flex-col overflow-hidden bg-navy-950 text-cream">
        <Image
          src={destination.src}
          alt={destination.alt || destination.title}
          fill
          preload
          loading="eager"
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.2_0.055_258/0.55)_0%,oklch(0.2_0.055_258/0.2)_38%,oklch(0.2_0.055_258/0.88)_100%)]"
        />
        <SiteHeader />

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-14 pt-32 md:px-10 md:pb-20">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5">
              {destination.categoryName && (
                <span className="rounded-full bg-gold-400/20 border border-gold-400/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                  {destination.categoryName}
                </span>
              )}
              {destination.region && (
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-gold-300/90 md:text-xs md:tracking-[0.4em]">
                  {destination.region}
                </p>
              )}
            </div>
            <h1
              className={`mt-5 max-w-[16ch] text-[clamp(2.6rem,10vw,6.5rem)] ${headlineClass}`}
            >
              {destination.title}
            </h1>
            <p className={`mt-5 max-w-[42ch] text-[1.05rem] leading-[1.8] ${bodyClass}`}>
              Handpicked stays and journeys in {destination.title}. Choose a
              package, or tell us your dates and we will tailor one.
            </p>
            <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-300/90">
              {packages.length > 0 ? countLabel : "Packages on request"}
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={planHref} external arrow>
                Plan this trip
              </ButtonLink>
              <ButtonLink href="/#destinations" variant="ghost">
                All destinations
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="destination-packages-title"
        className="relative isolate overflow-hidden border-t border-cream/10 bg-navy-950 text-cream"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[12%] h-[36rem] w-[64rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.5),transparent)]"
        />

        <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <SectionHeader
              eyebrow="Packages"
              title={`Journeys in ${destination.title}`}
              id="destination-packages-title"
              description={`Handpicked packages shaped around ${destination.title}. Every itinerary can be adjusted to your dates, budget and pace.`}
            />
          </Reveal>

          {packages.length === 0 ? (
            <Reveal className="mx-auto mt-16 max-w-xl rounded-2xl border border-cream/10 bg-navy-900/70 px-8 py-16 text-center">
              <p className={`text-[1.05rem] leading-[1.8] ${bodyClass}`}>
                Packages for {destination.title} are being tailored. Message us
                and we will build one around your dates.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href={planHref} external arrow>
                  Plan this trip
                </ButtonLink>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
              {packages.map((pkg, i) => (
                <li key={pkg.id}>
                  <PackageCard pkg={pkg} destinationTitle={destination.title} index={i} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {moreDestinations.length > 0 ? (
        <section
          aria-labelledby="more-destinations-title"
          className="border-t border-cream/10 bg-navy-950 text-cream"
        >
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-24">
            <Reveal>
              <SectionHeader
                eyebrow="Discover More"
                title="More Destinations"
                id="more-destinations-title"
                description="Explore other handpicked destinations and bespoke travel experiences."
              />
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreDestinations.map((dest, i) => (
                <Reveal key={dest.id} delay={i * 0.08}>
                  <Link
                    href={`/destinations/${dest.id}`}
                    aria-label={`Explore packages for ${dest.title}`}
                    className="group relative block aspect-[16/11] overflow-hidden rounded-2xl border border-cream/10 bg-navy-900 transition-all duration-500 hover:border-gold-400/50"
                  >
                    <Image
                      src={dest.src}
                      alt={dest.alt || dest.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold-300">
                        {dest.region}
                      </p>
                      <h3 className="mt-1 font-display text-2xl italic text-cream">
                        {dest.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  );
}

function PackageCard({
  pkg,
  destinationTitle,
  index,
}: {
  pkg: AdminPackage;
  destinationTitle: string;
  index: number;
}) {
  const title = pkg.label || pkg.lead || "Package";
  const cover = pkg.src || pkg.images?.[0] || "/images/hero-mountain-lake.jpg";
  const gallery = (pkg.images ?? []).filter((src) => src !== cover).slice(0, 3);
  const href = whatsappUrl(
    `Hello EL PASEO Tours & Travels, I would like to know more about the ${title} package in ${destinationTitle}.`,
  );
  const gold = index % 2 === 1;

  return (
    <Reveal delay={(index % 2) * 0.08}>
      <article
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 ${
          gold ? "bg-[var(--gold-400)] text-navy-950" : "bg-navy-900 text-cream"
        }`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={cover}
            alt={pkg.alt || `${title} package`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-3 gap-px bg-navy-950/20">
            {gallery.map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-6 md:p-8">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${
              gold ? "text-navy-950/60" : "text-gold-300"
            }`}
          >
            {pkg.region || destinationTitle}
          </p>
          <h3 className="mt-2 text-[clamp(1.6rem,3vw,2.15rem)] font-light leading-[1.05] tracking-[-0.03em]">
            {pkg.lead || title}
            {pkg.accent ? ` ${pkg.accent}` : ""}
          </h3>
          {pkg.blurb ? (
            <p
              className={`mt-4 text-[0.98rem] leading-[1.75] ${
                gold ? "text-navy-950/80" : "text-cream/80"
              }`}
            >
              {pkg.blurb}
            </p>
          ) : null}

          {pkg.highlights?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {pkg.highlights.map((item) => (
                <li
                  key={item}
                  className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                    gold
                      ? "bg-navy-950/10 text-navy-950"
                      : "bg-cream/8 text-cream/80"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8">
            <ButtonLink
              href={href}
              external
              arrow
              variant={gold ? "ghost" : "primary"}
              tone={gold ? "light" : "dark"}
            >
              Explore this package
            </ButtonLink>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
