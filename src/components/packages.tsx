import { whatsappUrl } from "@/lib/contact";
import { PackageSlider, type TravelPackage } from "./package-slider";
import { Reveal } from "./motion";
import { Eyebrow, bodyClass } from "./ui";

type PackageData = Omit<TravelPackage, "href">;

const DATA: PackageData[] = [
  {
    id: "kerala",
    bg: "var(--navy-950)", tone: "dark",
    label: "Kerala",
    region: "Alleppey, India",
    lead: "Kerala",
    accent: "Backwaters",
    blurb:
      "Drift through palm-lined canals on a private houseboat, with home-cooked Kerala meals and slow golden sunsets.",
    highlights: [
      "Private houseboat",
      "Village canoe ride",
      "Kerala meals onboard",
      "Sunset cruise",
    ],
    src: "/images/destinations/kerala.jpg",
    alt: "A wooden houseboat on the Kerala backwaters at golden hour",
  },
  {
    id: "munnar",
    bg: "var(--gold-400)", tone: "light",
    label: "Munnar",
    region: "Kerala, India",
    lead: "Misty",
    accent: "Munnar",
    blurb:
      "Wake above the clouds in tea country. Walk the plantations, chase waterfalls and unwind in a hill-view resort.",
    highlights: [
      "Tea plantation walks",
      "Hill-view resort",
      "Waterfalls & viewpoints",
      "Spice garden visit",
    ],
    src: "/images/destinations/munnar.jpg",
    alt: "Misty tea plantation hills at sunrise in Munnar",
  },
  {
    id: "maldives",
    bg: "var(--navy-700)", tone: "dark",
    label: "Maldives",
    region: "Indian Ocean",
    lead: "Barefoot",
    accent: "Maldives",
    blurb:
      "Overwater villas, glassy lagoons and nothing on the schedule. We handle the flights, transfers and the resort.",
    highlights: [
      "Overwater villa",
      "Snorkelling & diving",
      "Island transfers",
      "Sunset dolphin cruise",
    ],
    src: "/images/destinations/maldives.jpg",
    alt: "Overwater villas on a jetty over turquoise Maldivian water at sunset",
  },
  {
    id: "dubai",
    bg: "var(--gold-400)", tone: "light",
    label: "Dubai",
    region: "UAE",
    lead: "Skyline",
    accent: "Dubai",
    blurb:
      "Tower-top views by day, desert dunes by dusk. A city break packed with the best of Dubai, minus the hassle.",
    highlights: [
      "Desert safari",
      "Burj Khalifa views",
      "Marina dhow dinner",
      "City & souk tour",
    ],
    src: "/images/destinations/dubai.jpg",
    alt: "Dubai skyline with the Burj Khalifa above a glowing resort pool at dusk",
  },
  {
    id: "bali",
    bg: "var(--navy-950)", tone: "dark",
    label: "Bali",
    region: "Indonesia",
    lead: "Sacred",
    accent: "Bali",
    blurb:
      "Sea temples, rice terraces and jungle villas. A slower, greener escape with the right guides and the right stays.",
    highlights: [
      "Temple & terrace tour",
      "Ubud villa stay",
      "Mount Batur sunrise",
      "Beach club afternoons",
    ],
    src: "/images/destinations/bali.jpg",
    alt: "A tiered Balinese temple beside a lotus pond at sunset",
  },
];

const PACKAGES: TravelPackage[] = DATA.map((p) => ({
  ...p,
  href: whatsappUrl(
    `Hello EL PASEO Tours & Travels, I would like to know more about your ${p.lead} ${p.accent} package.`,
  ),
}));

export function Packages() {
  return (
    <section
      id="packages"
      aria-labelledby="packages-title"
      className="relative bg-navy-950 text-cream"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 pb-12 pt-24 text-center md:px-10 md:pb-16 md:pt-16">
        <Reveal>
          <Eyebrow className="!text-xl !font-semibold !tracking-[0.4em] md:!text-3xl md:!tracking-[0.45em]">Travel Packages</Eyebrow>
        </Reveal>
        <h2 id="packages-title" className="sr-only">Journeys, made to measure</h2>
        <Reveal className="mt-8">
          <p
            className={`max-w-[52ch] text-pretty text-[1rem] leading-[1.8] md:text-[1.15rem] ${bodyClass}`}
          >
            Keep scrolling to travel through our most-loved packages. Every
            one is tailored to your dates, budget and pace.
          </p>
        </Reveal>
      </div>

      <PackageSlider packages={PACKAGES} />
    </section>
  );
}
