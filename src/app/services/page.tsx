import type { Metadata } from "next";
import {
  Palmtree,
  Hotel,
  Ticket,
  Map,
  Plane,
  Train,
  Bus,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SectionHeader } from "@/components/section-header";
import { ButtonLink } from "@/components/ui";
import { Parallax, Reveal } from "@/components/motion";
import { CONTACT, whatsappUrl } from "@/lib/contact";

export const instant = false;

export const metadata: Metadata = {
  title: "Travel Services | EL PASEO Tours & Travels — Calicut",
  description:
    "Explore comprehensive travel services by EL PASEO Tours & Travels, Calicut. Holiday packages, luxury resort stays, flight, train, and bus ticket bookings, and custom itinerary planning.",
};

const CORE_SERVICES = [
  {
    id: "holiday-packages",
    icon: Palmtree,
    title: "Holiday Packages",
    subtext: "Explore the world with us",
    description:
      "Customized national and international tour packages tailored for families, couples, groups, and solo travelers. From the serene tea hills of Munnar and backwaters of Alleppey to tropical escapes in Maldives, Bali, and Dubai.",
    features: [
      "Customized day-by-day itineraries to match your pace",
      "Domestic circuits: Kerala, Kashmir, Goa, Himachal & Golden Triangle",
      "International escapes: Maldives, Dubai, Bali, Thailand, Europe",
      "Dedicated private transfers and professional local guides",
    ],
    whatsappMsg: "Hello EL PASEO, I am interested in your Holiday Packages.",
  },
  {
    id: "resort-bookings",
    icon: Hotel,
    title: "Resort & Hotel Bookings",
    subtext: "Stay at the best places",
    description:
      "Premium hotel and luxury resort reservations at top destinations worldwide. We handpick cliffside villas, heritage plantations, secluded rainforest treehouses, and beachfront pool retreats verified for comfort and hospitality.",
    features: [
      "Private pool villas and luxury heritage bungalows",
      "Handpicked rainforest and hill resort stays in Wayanad & Munnar",
      "Exclusive room upgrades and honeymoon amenities on request",
      "Transparent pricing with verified real guest feedback",
    ],
    whatsappMsg: "Hello EL PASEO, I would like to book a Luxury Resort/Hotel stay.",
  },
  {
    id: "ticketing-services",
    icon: Ticket,
    title: "Ticketing Services",
    subtext: "Fast, hassle-free transit ticketing",
    description:
      "Complete booking solutions for Flights, Trains, and Interstate Buses. Skip the confusion of waitlists and complicated booking windows—our Calicut desk handles every ticket quickly and reliably.",
    features: [
      "Flight Bookings: Domestic & international airlines with seat & meal selection",
      "Train Bookings: Tatkal, express, executive chair car & AC sleeper tickets",
      "Interstate Buses: Luxury multi-axle Volvos & sleeper coaches",
      "Instant PNR tracking and live departure alerts",
    ],
    whatsappMsg: "Hello EL PASEO, I need assistance with Flight/Train/Bus Ticketing.",
  },
  {
    id: "tour-planning",
    icon: Map,
    title: "Travel Itinerary & Tour Planning",
    subtext: "Bespoke travel shaped around you",
    description:
      "Personalized trip planning and 24/7 travel assistance. Tell us your budget, dates, and interests, and we will sculpt a cohesive, stress-free route that makes every day memorable.",
    features: [
      "Non-cookie-cutter schedules adjusted to your family or group",
      "Curated dining, cultural immersion and sightseeing recommendations",
      "Transparent budget breakdown with zero hidden fees",
      "Continuous WhatsApp assistance throughout your trip",
    ],
    whatsappMsg: "Hello EL PASEO, I would like to plan a Custom Travel Itinerary.",
  },
];

const SPECIALIZED = [
  {
    icon: Heart,
    title: "Honeymoon & Romantic Escapes",
    desc: "Private pool retreats, candlelit beach dinners, and peaceful secluded stays in Munnar, Wayanad, Bali, and the Maldives.",
  },
  {
    icon: Users,
    title: "Family & Multi-Gen Vacations",
    desc: "Spacious multi-bedroom suites, private AC vehicles, and comfortable slow pacing so everyone from grandparents to kids enjoys.",
  },
  {
    icon: Sparkles,
    title: "Corporate & Group Off-Sites",
    desc: "Coordinated travel logistics, conference resort bookings, and team-building getaways across premier South Indian destinations.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Share Your Vision",
    desc: "Tell us where you want to go, your dates, budget, and who is traveling.",
  },
  {
    number: "02",
    title: "Tailored Options",
    desc: "We curate custom itineraries and verified stays with clear, all-inclusive quotes.",
  },
  {
    number: "03",
    title: "Seamless Booking",
    desc: "We confirm all resort rooms, transit tickets, and driver vouchers with full documentation.",
  },
  {
    number: "04",
    title: "24/7 Journey Care",
    desc: "Explore with peace of mind knowing our Calicut team is one WhatsApp message away.",
  },
];

export default function ServicesPage() {
  const generalHref = whatsappUrl(
    "Hello EL PASEO Tours & Travels, I would like to inquire about your travel services."
  );

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-navy-950 text-cream">
        <SiteHeader />

        {/* Hero Section */}
        <section className="relative isolate overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
          <Parallax distance={80} className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[10%] h-[40rem] w-[75rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.5),transparent)]" />
            <div className="absolute left-1/2 top-[40%] h-[25rem] w-[45rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.09),transparent)]" />
          </Parallax>

          <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="What We Do"
                title="Comprehensive Travel Services"
                description="From customized holiday packages and luxury resort reservations to flight, train, and bus ticketing—handled with personal care from Mankavu, Calicut."
              />
            </Reveal>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-navy-900/80 px-4 py-1.5 text-xs text-cream/80 backdrop-blur-md">
                <Plane className="size-3.5 text-gold-400" /> Flights & Transit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-navy-900/80 px-4 py-1.5 text-xs text-cream/80 backdrop-blur-md">
                <Hotel className="size-3.5 text-gold-400" /> Luxury Resorts
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-navy-900/80 px-4 py-1.5 text-xs text-cream/80 backdrop-blur-md">
                <Palmtree className="size-3.5 text-gold-400" /> Holiday Packages
              </span>
            </div>
          </div>
        </section>

        {/* 4 Core Services Detailed Cards */}
        <section className="border-t border-cream/10 bg-navy-900/30 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="Core Expertise"
                title="Our Four Pillars of Service"
                description="Every service is backed by direct industry connections, transparent pricing, and personalized concierge attention."
              />
            </Reveal>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {CORE_SERVICES.map((service, i) => {
                const Icon = service.icon;
                const ctaHref = whatsappUrl(service.whatsappMsg);

                return (
                  <Reveal key={service.id} delay={i * 0.1}>
                    <div
                      id={service.id}
                      className="flex h-full scroll-mt-28 flex-col justify-between rounded-3xl border border-cream/10 bg-navy-950 p-8 md:p-10 transition-all duration-300 hover:border-gold-400/50 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gold-400/10 border border-gold-400/25 text-gold-400">
                            <Icon className="size-7" />
                          </div>
                          <span className="text-xs uppercase tracking-widest font-semibold text-gold-300/80 bg-gold-400/5 border border-gold-400/15 px-3 py-1 rounded-full">
                            {service.subtext}
                          </span>
                        </div>

                        <h3 className="mt-6 text-2xl md:text-3xl font-light text-cream">
                          {service.title}
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-cream/70">
                          {service.description}
                        </p>

                        <div className="mt-6 space-y-2.5 pt-6 border-t border-cream/10">
                          <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-3">
                            Key Inclusions
                          </p>
                          {service.features.map((feat) => (
                            <div key={feat} className="flex items-start gap-2.5 text-xs text-cream/80">
                              <CheckCircle2 className="size-4 shrink-0 text-gold-400 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-cream/10 flex items-center justify-between">
                        <ButtonLink href={ctaHref} external arrow>
                          Inquire on WhatsApp
                        </ButtonLink>
                        <span className="text-xs text-cream/40">Prompt Response</span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Specialized Journeys */}
        <section
          id="specialized"
          className="scroll-mt-28 border-t border-cream/10 py-20 md:py-28"
        >
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="Specialized Offerings"
                title="Bespoke Travel Styles"
                description="Whether escaping on a romantic honeymoon or orchestrating a large family reunion, we tailor the experience to your exact needs."
              />
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {SPECIALIZED.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 0.1}>
                    <div className="h-full rounded-2xl border border-cream/10 bg-navy-900/60 p-8 transition-colors hover:border-gold-400/40">
                      <div className="inline-flex size-11 items-center justify-center rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-cream">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/65">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works (4 Steps) */}
        <section className="border-t border-cream/10 bg-navy-900/40 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="Seamless Process"
                title="How We Plan Your Journey"
                description="Four simple steps from your first inquiry to stepping into your private resort villa."
              />
            </Reveal>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal key={step.number} delay={i * 0.1}>
                  <div className="relative rounded-2xl border border-cream/10 bg-navy-950 p-6 h-full flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-3xl font-bold text-gold-400/40">
                        {step.number}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-cream">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-cream/60">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Contact & CTA Banner */}
        <section className="border-t border-cream/10 py-20 md:py-28 bg-gradient-to-b from-navy-950 to-navy-900">
          <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
            <Reveal>
              <span className="text-xs uppercase font-semibold tracking-[0.3em] text-gold-400">
                Ready to Plan?
              </span>
              <h2 className="mt-3 text-3xl md:text-5xl font-light text-cream">
                Let Us Handle the Details
              </h2>
              <p className="mx-auto mt-5 text-cream/70 text-base md:text-lg max-w-xl">
                Have questions about an upcoming holiday, resort booking, or transit ticket? Our travel specialists in Mankavu, Calicut are ready to assist.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <ButtonLink href={generalHref} external arrow>
                  Chat with Our Calicut Desk
                </ButtonLink>
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cream/30 bg-cream/5 px-8 text-sm font-medium text-cream hover:border-gold-400 hover:text-gold-300 transition-colors"
                >
                  <Phone className="size-4" />
                  <span>Call {CONTACT.phoneDisplay}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
