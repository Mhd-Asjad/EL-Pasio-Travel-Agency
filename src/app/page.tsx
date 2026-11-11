import { Destinations } from "@/components/destinations";
import { Hero } from "@/components/hero";
import type { HeroSearchItem } from "@/components/hero-search";
import { Packages } from "@/components/packages";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Testimonials } from "@/components/testimonials";
import { getDestinations, getPackages } from "@/lib/db";

export const instant = false;

export default async function Home() {
  const [destinations, packages] = await Promise.all([
    getDestinations(),
    getPackages(),
  ]);

  const destinationById = new Map(destinations.map((d) => [d.id, d]));

  const searchItems: HeroSearchItem[] = [
    ...destinations.map((d) => ({
      id: `destination-${d.id}`,
      type: "destination" as const,
      title: d.title,
      subtitle: [d.region, d.categoryName].filter(Boolean).join(" · "),
      href: `/destinations/${d.id}`,
      image: d.src,
      keywords: [d.title, d.region, d.categoryName, d.alt]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    })),
    ...packages.map((p) => {
      const destination = destinationById.get(p.destinationId);
      const title = p.label || p.lead || "Package";
      const cover =
        p.src ||
        p.images?.[0] ||
        destination?.src ||
        "/images/hero-mountain-lake.jpg";

      return {
        id: `package-${p.id}`,
        type: "package" as const,
        title,
        subtitle: [
          destination?.title,
          p.region || destination?.region,
        ]
          .filter(Boolean)
          .join(" · "),
        href: `/destinations/${p.destinationId}?package=${encodeURIComponent(p.id)}`,
        image: cover,
        keywords: [
          title,
          p.region,
          p.lead,
          p.blurb,
          p.alt,
          destination?.title,
          destination?.region,
          destination?.categoryName,
          ...(p.highlights ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      };
    }),
  ];

  return (
    <SmoothScroll>
      <main>
        <Hero searchItems={searchItems} />
        <Destinations />
        <Packages />
        <Testimonials />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
