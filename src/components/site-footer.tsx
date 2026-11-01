import Image from "next/image";
import {
  CONTACT,
  DEFAULT_WHATSAPP_MESSAGE,
  SOCIAL_LINKS,
  whatsappUrl,
} from "@/lib/contact";
import { Wordmark } from "./brand-mark";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { Reveal } from "./motion";
import { ButtonLink, focusRingLight } from "./ui";

const WHATSAPP = whatsappUrl(DEFAULT_WHATSAPP_MESSAGE);

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  /** Extra screen-reader text, e.g. when a social falls back to WhatsApp. */
  aria?: string;
};

// Socials without a real page yet fall back to WhatsApp (see lib/contact.ts).
function social(label: string, url?: string): FooterLink {
  return url
    ? { label, href: url, external: true }
    : {
        label,
        href: WHATSAPP,
        external: true,
        aria: `${label} (opens WhatsApp chat for now)`,
      };
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "#home" },
      { label: "About us", href: "#about" },
      { label: "Destinations", href: "#packages" },
      { label: "Traveller stories", href: "#testimonials" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "WhatsApp", href: WHATSAPP, external: true },
      { label: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { label: "Mankavu, Calicut", href: CONTACT.mapsUrl, external: true },
    ],
  },
  {
    title: "Follow",
    links: [
      social("Instagram", SOCIAL_LINKS.instagram),
      social("Facebook", SOCIAL_LINKS.facebook),
      { label: "WhatsApp", href: WHATSAPP, external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      aria-labelledby="footer-title"
      className="relative z-10 -mt-8 overflow-hidden rounded-t-[2rem] bg-[oklch(0.94_0.018_86)] text-navy-950 md:-mt-12 md:rounded-t-[3rem]"
    >
      <h2 id="footer-title" className="sr-only">
        Contact EL PASEO Tours &amp; Travels
      </h2>
      {/* Target for every "Plan My Trip" button until a full form exists */}
      <span id="inquiry" aria-hidden="true" className="absolute top-0" />

      <div className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand + call to action */}
          <Reveal className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.png"
                alt="EL PASEO emblem"
                width={1269}
                height={1240}
                sizes="64px"
                className="size-16 object-contain"
              />
              <Wordmark tone="light" />
            </div>

            <p className="mt-8 max-w-[34ch] text-[1.15rem] font-light leading-snug tracking-[-0.01em] text-navy-950 md:text-[1.3rem]">
              Your next journey is closer than you think.
            </p>
            <p className="mt-4 max-w-[42ch] text-[0.95rem] leading-[1.75] text-navy-900/75">
              Tell us where you want to go. Message us on WhatsApp or give us a
              call, and we will take care of the rest.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                href={WHATSAPP}
                external
                tone="light"
                icon={<WhatsAppIcon className="size-[1.15rem]" />}
              >
                Chat on WhatsApp
              </ButtonLink>
              <ButtonLink
                href={`tel:${CONTACT.phoneTel}`}
                tone="light"
                variant="ghost"
                icon={<PhoneIcon className="size-4" />}
              >
                Call us
              </ButtonLink>
            </div>
          </Reveal>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:pl-10"
          >
            {COLUMNS.map((col, i) => (
              <Reveal key={col.title} delay={0.08 * (i + 1)} y={24}>
                <h3 className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-gold-600">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={`${col.title}-${l.label}`}>
                      <a
                        href={l.href}
                        aria-label={l.aria}
                        {...(l.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={`group relative inline-block break-words text-[0.95rem] text-navy-900/80 transition-colors duration-300 hover:text-navy-950 ${focusRingLight}`}
                      >
                        {l.label}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-600 transition-transform duration-500 ease-spring group-hover:scale-x-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </nav>
        </div>

        {/* Legal row */}
        <div className="relative z-10 mt-16 flex flex-col gap-2 border-t border-navy-950/10 pt-6 text-[0.78rem] text-navy-900/65 md:mt-24 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; 2026 <span className="font-semibold">{CONTACT.name}</span>.
            All rights reserved.
          </p>
          <p>{CONTACT.address}</p>
        </div>
      </div>

      {/* Brand watermark: large, faint, cropped by the bottom edge */}
      <Reveal y={32} margin="0%">
        <div
          aria-hidden="true"
          className="pointer-events-none -mt-3 h-[0.74em] select-none overflow-hidden whitespace-nowrap text-center text-[16.4vw] font-semibold uppercase leading-[0.9] tracking-[0.03em] text-navy-950/[0.07] md:-mt-6"
        >
          EL PASEO
        </div>
      </Reveal>
    </footer>
  );
}
