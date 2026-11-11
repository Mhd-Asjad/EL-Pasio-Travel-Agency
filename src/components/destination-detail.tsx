"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { whatsappUrl } from "@/lib/contact";
import type { AdminDestination, AdminPackage } from "@/lib/db";
import { Reveal } from "./motion";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { DestinationPackages } from "./package-gallery";
import { ButtonLink, bodyClass, headlineClass } from "./ui";
import { SectionHeader } from "./section-header";

function packageTitle(pkg: AdminPackage) {
  return pkg.label || pkg.lead || "Package";
}

function packageCover(pkg: AdminPackage) {
  return pkg.src || pkg.images?.[0] || "/images/hero-mountain-lake.jpg";
}

function packageHeadline(pkg: AdminPackage) {
  const lead = (pkg.lead || packageTitle(pkg)).trim();
  const accent = pkg.accent?.trim();
  if (!accent || accent.toLowerCase() === lead.toLowerCase()) return lead;
  return `${lead} ${accent}`;
}

export function DestinationDetail({
  destination,
  packages,
  moreDestinations,
  initialPackageId,
}: {
  destination: AdminDestination;
  packages: AdminPackage[];
  moreDestinations: AdminDestination[];
  initialPackageId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (!initialPackageId) return null;
    return packages.some((pkg) => pkg.id === initialPackageId)
      ? initialPackageId
      : null;
  });

  useEffect(() => {
    if (!initialPackageId) return;
    if (!packages.some((pkg) => pkg.id === initialPackageId)) return;
    setSelectedId(initialPackageId);
  }, [initialPackageId, packages]);

  const selected = useMemo(
    () => packages.find((pkg) => pkg.id === selectedId) ?? null,
    [packages, selectedId],
  );

  const planHref = whatsappUrl(
    `Hello EL PASEO Tours & Travels, I would like to plan a trip to ${destination.title}.`,
  );

  const heroImage = selected ? packageCover(selected) : destination.src;
  const heroAlt = selected
    ? selected.alt || `${packageTitle(selected)} package`
    : destination.alt || destination.title;

  function openPackage(id: string) {
    setSelectedId(id);
    router.replace(`${pathname}?package=${encodeURIComponent(id)}`, {
      scroll: false,
    });
    // Instant scroll so a mobile ghost-click can't land on the gallery lightbox.
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function closePackage() {
    setSelectedId(null);
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] flex-col overflow-hidden bg-navy-950 text-cream">
        <Image
          key={heroImage}
          src={heroImage}
          alt={heroAlt}
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
          <Reveal key={selected ? selected.id : "destination"}>
            {selected ? (
              <>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-gold-400/30 bg-gold-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                    Package
                  </span>
                  {(selected.region || destination.region) && (
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-gold-300/90 md:text-xs md:tracking-[0.4em]">
                      {selected.region || destination.region}
                    </p>
                  )}
                </div>
                <h1
                  className={`mt-5 max-w-[18ch] text-[clamp(2.4rem,8vw,5.5rem)] ${headlineClass}`}
                >
                  {packageHeadline(selected)}
                </h1>
                {selected.blurb ? (
                  <p
                    className={`mt-5 max-w-[46ch] text-[1.05rem] leading-[1.8] ${bodyClass}`}
                  >
                    {selected.blurb}
                  </p>
                ) : null}
                {selected.highlights?.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {selected.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-cream/15 bg-cream/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-cream/90 backdrop-blur-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2.5">
                  {destination.categoryName && (
                    <span className="rounded-full border border-gold-400/30 bg-gold-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
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
                <p
                  className={`mt-5 max-w-[42ch] text-[1.05rem] leading-[1.8] ${bodyClass}`}
                >
                  Handpicked stays and journeys in {destination.title}. Choose a
                  package, or tell us your dates and we will tailor one.
                </p>
              </>
            )}
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
          {!selected ? (
            <Reveal>
              <SectionHeader
                eyebrow="Packages"
                title={`Journeys in ${destination.title}`}
                id="destination-packages-title"
                description={`Handpicked packages shaped around ${destination.title}. Every itinerary can be adjusted to your dates, budget and pace.`}
              />
            </Reveal>
          ) : (
            <h2 id="destination-packages-title" className="sr-only">
              {packageHeadline(selected)} gallery
            </h2>
          )}

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
            <DestinationPackages
              packages={packages}
              destinationTitle={destination.title}
              selectedId={selectedId}
              onSelect={openPackage}
              onBack={closePackage}
            />
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
