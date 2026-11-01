import { whatsappUrl } from "@/lib/contact";
import { CardSpread, type SpreadCard } from "./card-spread";
import { Parallax, Reveal } from "./motion";
import { ButtonLink, Eyebrow, bodyClass } from "./ui";

// Centre card is the hero destination: Kerala is home turf.
const RAW_CARDS: SpreadCard[] = [
  {
    id: "munnar",
    src: "/images/destinations/munnar.jpg",
    alt: "Misty tea plantation hills at sunrise in Munnar",
    title: "Munnar",
    region: "Kerala, India",
    href: "",
    external: true,
  },
  {
    id: "maldives",
    src: "/images/destinations/maldives.jpg",
    alt: "Overwater villas on a jetty over turquoise Maldivian water at sunset",
    title: "Maldives",
    region: "Indian Ocean",
    href: "",
    external: true,
  },
  {
    id: "kerala",
    src: "/images/destinations/kerala.jpg",
    alt: "A wooden houseboat on the Kerala backwaters at golden hour",
    title: "Kerala Backwaters",
    region: "Alleppey, India",
    href: "",
    external: true,
  },
  {
    id: "dubai",
    src: "/images/destinations/dubai.jpg",
    alt: "Dubai skyline with the Burj Khalifa above a glowing resort pool at dusk",
    title: "Dubai",
    region: "UAE",
    href: "",
    external: true,
  },
  {
    id: "bali",
    src: "/images/destinations/bali.jpg",
    alt: "A tiered Balinese temple beside a lotus pond at sunset",
    title: "Bali",
    region: "Indonesia",
    href: "",
    external: true,
  },
];

// Each card opens WhatsApp with a message that names the destination.
const CARDS: SpreadCard[] = RAW_CARDS.map((c) => ({
  ...c,
  href: whatsappUrl(
    `Hello EL PASEO Tours & Travels, I would like to plan a trip to ${c.title}.`,
  ),
}));

export function Destinations() {
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
        <div className="absolute left-1/2 top-[22%] h-[40rem] w-[72rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.55),transparent)]" />
        <div className="absolute left-1/2 top-[50%] h-[24rem] w-[40rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.09),transparent)]" />
      </Parallax>

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-5 py-24 text-center md:px-10 md:py-36">
        <Reveal>
          <Eyebrow className="!text-xl !font-semibold !tracking-[0.4em] md:!text-3xl md:!tracking-[0.45em]">Destinations</Eyebrow>
        </Reveal>

        <h2 id="destinations-title" className="sr-only">Places worth getting lost in</h2>

        <Reveal className="mt-8">
          <p
            className={`max-w-[56ch] text-pretty text-[1rem] font-normal leading-[1.8] md:text-[1.15rem] ${bodyClass}`}
          >
            From Kerala&rsquo;s backwaters to Maldivian lagoons and the Dubai
            skyline, explore destinations we&rsquo;ve handpicked for
            unforgettable trips.
          </p>
        </Reveal>

        <div className="mt-14 w-full md:mt-20">
          <CardSpread cards={CARDS} />
        </div>

        <Reveal className="mt-14 md:mt-20">
          <ButtonLink
            href={whatsappUrl(
              "Hello EL PASEO Tours & Travels, please share your destination options.",
            )}
            external
            variant="ghost"
            arrow
          >
            Explore All Destinations
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
