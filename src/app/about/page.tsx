import type { Metadata } from "next";
import {
  Compass,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
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
  title: "About Us | EL PASEO Tours & Travels — Mankavu, Calicut",
  description:
    "Learn about EL PASEO Tours & Travels, based in Mankavu, Calicut. Guided by our motto 'Journey Beyond Destinations', we craft unforgettable holiday packages, luxury stays, and transit bookings.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "Your Complete Travel Partner",
    desc: "From initial route planning and flight reservations to verified resort stays and 24/7 on-trip assistance, we handle every logistical nuance under one roof.",
  },
  {
    icon: Sparkles,
    title: "Explore, Dream, Discover",
    desc: "We curate authentic, unhurried journeys. Whether unwinding in private Kerala pool villas or exploring iconic world destinations, our itineraries awaken wonder.",
  },
  {
    icon: HeartHandshake,
    title: "Your Journey, Our Priority",
    desc: "Honest transparent pricing with zero hidden surcharges. Every schedule is tailored to your family's pace, budget, and comfort from our desk in Calicut.",
  },
];

const ADVANTAGES = [
  {
    icon: MapPin,
    title: "Rooted in Calicut, Global in Reach",
    desc: "Located in Mankavu, Calicut, we bring local warmth and personal care alongside deep industry connections across India and worldwide destinations.",
  },
  {
    icon: ShieldCheck,
    title: "Handpicked & Verified Stays",
    desc: "We do not sell generic lists. Every resort, heritage retreat, and pool villa in our catalog has been vetted for quality, cleanliness, and hospitality.",
  },
  {
    icon: Clock,
    title: "24/7 Dedicated Support",
    desc: "Travel plans can shift. Our team is available on WhatsApp and phone around the clock to re-book, resolve, and support you every step of the journey.",
  },
];

export default function AboutPage() {
  const planHref = whatsappUrl(
    "Hello EL PASEO Tours & Travels, I would like to learn more about your services and plan a journey."
  );

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-navy-950 text-cream">
        {/* Navigation */}
        <SiteHeader />

        {/* Hero Banner */}
        <section className="relative isolate overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
          <Parallax distance={80} className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[10%] h-[40rem] w-[75rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.5),transparent)]" />
            <div className="absolute left-1/2 top-[40%] h-[25rem] w-[45rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.09),transparent)]" />
          </Parallax>

          <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="Our Story & Philosophy"
                title="Journey Beyond Destinations"
                description="Guided by passion, trust, and personalized hospitality, EL PASEO Tours & Travels is your dedicated travel partner rooted in Mankavu, Calicut."
              />
            </Reveal>
          </div>
        </section>

        {/* Core Canonical Copy Section */}
        <section className="border-t border-cream/10 bg-navy-900/40 py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <Reveal>
              <div className="rounded-3xl border border-cream/10 bg-navy-950/80 p-8 md:p-14 shadow-2xl backdrop-blur-md">
                <span className="text-xs uppercase font-semibold tracking-[0.3em] text-gold-400">
                  Who We Are
                </span>
                <p className="mt-6 text-lg md:text-xl font-light leading-[1.85] text-cream/90">
                  At <strong className="font-semibold text-cream">EL PASEO Tours & Travels</strong>, based in Mankavu, Calicut, we believe that travel is more than just reaching a location—it&apos;s about the journey. Guided by our motto,{" "}
                  <span className="font-display text-[1.18em] italic text-gold-300 font-normal">
                    &ldquo;Journey Beyond Destinations,&rdquo;
                  </span>{" "}
                  we are your complete travel partner dedicated to crafting unforgettable travel experiences. Whether you are seeking luxury resort stays, customized holiday packages, or hassle-free transit bookings, EL PASEO handles every detail so you can explore, dream, and discover with peace of mind.
                </p>

                <div className="mt-8 pt-8 border-t border-cream/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-cream/50">Office Location</p>
                    <p className="text-sm text-cream font-medium mt-1">Mankavu, Calicut (Kozhikode), Kerala</p>
                  </div>
                  <ButtonLink href={planHref} external arrow>
                    Plan a Journey With Us
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3 Brand Pillars */}
        <section className="border-t border-cream/10 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="Our Commitments"
                title="The Three Pillars of EL PASEO"
                description="Everything we build rests on three foundational promises to every traveler who trusts us with their time and memories."
              />
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.title} delay={i * 0.1}>
                    <div className="h-full rounded-2xl border border-cream/10 bg-navy-900/60 p-8 transition-all duration-300 hover:border-gold-400/40 hover:bg-navy-900/90">
                      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-gold-400/10 border border-gold-400/25 text-gold-400">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-cream tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-cream/70">
                        {pillar.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="border-t border-cream/10 bg-navy-900/30 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <Reveal>
              <SectionHeader
                eyebrow="Why Travel With Us"
                title="The EL PASEO Difference"
                description="We replace the fatigue of booking dozens of disconnected tickets with one transparent, reliable concierge partner."
              />
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {ADVANTAGES.map((adv, i) => {
                const Icon = adv.icon;
                return (
                  <Reveal key={adv.title} delay={i * 0.1}>
                    <div className="h-full rounded-2xl border border-cream/10 bg-navy-950 p-8">
                      <div className="inline-flex size-11 items-center justify-center rounded-xl bg-cream/5 border border-cream/15 text-gold-400">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-cream">
                        {adv.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/65">
                        {adv.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Agency Desk & Contact Strip */}
        <section className="border-t border-cream/10 py-16 md:py-24 bg-gradient-to-b from-navy-950 to-navy-900">
          <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
            <Reveal>
              <span className="text-xs uppercase font-semibold tracking-[0.3em] text-gold-400">
                Visit or Contact
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-light text-cream">
                We Welcome You to Our Office
              </h2>
              <div
                aria-hidden="true"
                className="mx-auto mt-4 flex items-center justify-center gap-2"
              >
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/60" />
                <div className="size-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(242,207,120,0.6)]" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/60" />
              </div>
              <p className="mx-auto mt-4 text-cream/70 text-base max-w-lg">
                Drop in for a warm conversation about your next journey or reach out directly via phone or WhatsApp.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="rounded-2xl border border-cream/10 bg-navy-950 p-6">
                  <MapPin className="size-5 text-gold-400 mb-3" />
                  <p className="text-xs font-semibold text-cream/40 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-medium text-cream mt-1">{CONTACT.address}</p>
                </div>
                <div className="rounded-2xl border border-cream/10 bg-navy-950 p-6">
                  <Phone className="size-5 text-gold-400 mb-3" />
                  <p className="text-xs font-semibold text-cream/40 uppercase tracking-wider">Phone</p>
                  <a href={`tel:${CONTACT.phoneTel}`} className="text-sm font-medium text-gold-300 hover:underline mt-1 block">
                    {CONTACT.phoneDisplay}
                  </a>
                </div>
                <div className="rounded-2xl border border-cream/10 bg-navy-950 p-6">
                  <Mail className="size-5 text-gold-400 mb-3" />
                  <p className="text-xs font-semibold text-cream/40 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${CONTACT.email}`} className="text-sm font-medium text-gold-300 hover:underline mt-1 block truncate">
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <ButtonLink href={planHref} external arrow>
                  Chat on WhatsApp
                </ButtonLink>
                <ButtonLink href="/#destinations" variant="ghost">
                  Explore Destinations
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
