import { getPackages } from "@/lib/db";
import { PackageSlider, type TravelPackage } from "./package-slider";
import { Reveal } from "./motion";
import { SectionHeader } from "./section-header";

export async function Packages() {
  const allPackages = await getPackages();

  // Filter for packages explicitly featured (or default to all if featured flag isn't set)
  const featured = allPackages.filter((p) => p.featured !== false);
  const displayPackages = featured.length > 0 ? featured : allPackages.slice(0, 5);

  const PACKAGES: TravelPackage[] = displayPackages.map((p) => {
    const title = p.label || p.lead || "Package";
    const coverImage = p.src || (p.images && p.images[0]) || "/images/hero-mountain-lake.jpg";

    return {
      id: p.id,
      label: title,
      region: p.region || "",
      lead: p.lead || title,
      accent: p.accent || "",
      blurb:
        p.blurb ||
        (p.highlights && p.highlights.length > 0
          ? p.highlights.join(" • ")
          : `${title} travel package.`),
      highlights: p.highlights || [],
      src: coverImage,
      alt: p.alt || `${title} travel package`,
      bg: p.bg || "var(--navy-950)",
      tone: p.tone || "dark",
      href: `/destinations/${p.destinationId}?package=${encodeURIComponent(p.id)}`,
    };
  });

  if (PACKAGES.length === 0) {
    return null;
  }

  return (
    <section
      id="packages"
      aria-labelledby="packages-title"
      className="relative bg-navy-950 text-cream"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 pb-12 pt-16 text-center md:px-10 md:pb-16 md:pt-24">
        <Reveal>
          <SectionHeader
            eyebrow="Travel Packages"
            title="Journeys Made to Measure"
            id="packages-title"
            description="Browse our featured packages. Every journey is tailored to your dates, budget and pace."
          />
        </Reveal>
      </div>

      <PackageSlider packages={PACKAGES} />
    </section>
  );
}
