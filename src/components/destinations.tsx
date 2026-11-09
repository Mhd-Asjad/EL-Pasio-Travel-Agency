import { getCategories, getDestinations, getPackages } from "@/lib/db";
import { CategoryDestinations, type DestinationWithCount } from "./category-destinations";
import { Parallax, Reveal } from "./motion";
import { SectionHeader } from "./section-header";

export async function Destinations() {
  const [categories, destinations, packages] = await Promise.all([
    getCategories(),
    getDestinations(),
    getPackages(),
  ]);

  const counts = new Map<string, number>();
  for (const pkg of packages) {
    counts.set(pkg.destinationId, (counts.get(pkg.destinationId) ?? 0) + 1);
  }

  const items: DestinationWithCount[] = destinations.map((dest) => ({
    ...dest,
    packageCount: counts.get(dest.id) ?? 0,
  }));

  return (
    <section
      id="destinations"
      aria-labelledby="destinations-title"
      className="relative isolate overflow-hidden border-t border-cream/10 bg-navy-950 text-cream"
    >
      <Parallax
        distance={100}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[18%] h-[40rem] w-[72rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.55),transparent)]" />
        <div className="absolute left-1/2 top-[55%] h-[24rem] w-[40rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.09),transparent)]" />
      </Parallax>

      <div className="relative mx-auto max-w-[1400px] px-5 py-20 text-center md:px-10 md:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Destinations"
            title="Explore Places by Category"
            id="destinations-title"
            description="Browse destinations organized by category. Choose a destination to view its packages, inclusions and brochure photos."
          />
        </Reveal>

        <div className="mt-12 md:mt-16">
          <CategoryDestinations categories={categories} destinations={items} />
        </div>
      </div>
    </section>
  );
}
