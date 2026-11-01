import {
  CONTACT,
  DEFAULT_WHATSAPP_MESSAGE,
  SOCIAL_LINKS,
  whatsappUrl,
} from "@/lib/contact";
import { LogoBadge, Wordmark } from "./brand-mark";
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

const EXPLORE: FooterLink[] = [
  { label: "Home", href: "#home" },
  { label: "About us", href: "#about" },
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Traveller stories", href: "#testimonials" },
];

const CONTACT_LINKS: FooterLink[] = [
  { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
  { label: "WhatsApp", href: WHATSAPP, external: true },
];

const SOCIALS: FooterLink[] = [
  social("Instagram", SOCIAL_LINKS.instagram),
  social("Facebook", SOCIAL_LINKS.facebook),
  { label: "WhatsApp", href: WHATSAPP, external: true },
];

const linkClass = `inline-block transition-colors duration-300 hover:text-gold-600 ${focusRingLight}`;

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <a
      href={link.href}
      aria-label={link.aria}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={linkClass}
    >
      {link.label}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      aria-labelledby="footer-title"
      className="relative z-10 overflow-hidden bg-[oklch(0.94_0.018_86)] text-navy-950"
    >
      {/* Target for every "Plan My Trip" button until a full form exists */}
      <span id="inquiry" aria-hidden="true" className="absolute top-0" />

      <div className="mx-auto max-w-[1400px] px-5 pt-24 md:px-10 md:pt-40">
        {/* Call to action */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2
              id="footer-title"
              className="max-w-[16ch] text-balance text-[clamp(2.5rem,10vw,3.25rem)] font-light leading-[1.04] tracking-[-0.04em] md:text-[clamp(3.25rem,7vw,6.5rem)]"
            >
              Your next journey is <span className="font-display text-[1.12em] font-normal italic tracking-[-0.02em] text-gold-600">closer</span>{" "}
              than you think.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <p className="max-w-[44ch] text-pretty text-[1rem] leading-[1.75] text-navy-900/75">
              Tell us where you want to go. Message us on WhatsApp or give us a
              call, and we will take care of the rest.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
        </div>

        {/* Info rows */}
        <div className="mt-20 border-t border-navy-950/20 pt-6 md:mt-32">
          <div className="grid gap-10 text-[0.72rem] font-medium uppercase leading-[1.9] tracking-[0.12em] md:grid-cols-3 md:gap-6">
            <div>
              <div className="flex items-center gap-3.5">
                <LogoBadge className="size-12" sizes="48px" />
                <Wordmark tone="light" />
              </div>
              <p className="mt-5 max-w-[30ch] text-navy-900/75">
                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {CONTACT.address}
                </a>
              </p>
            </div>

            <nav aria-label="Footer" className="md:text-center">
              <ul>
                {EXPLORE.map((l) => (
                  <li key={l.label}>
                    <FooterAnchor link={l} />
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="md:text-right">
              {CONTACT_LINKS.map((l) => (
                <li key={l.label} className="break-words">
                  <FooterAnchor link={l} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-navy-950/20 pt-6 text-[0.72rem] font-medium uppercase tracking-[0.12em] md:flex-row md:items-start md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 md:flex-col md:gap-x-0">
            {SOCIALS.map((l) => (
              <li key={l.label}>
                <FooterAnchor link={l} />
              </li>
            ))}
          </ul>
          <p className="text-navy-900/60 md:text-right">
            &copy; 2026 {CONTACT.name}.
            <br className="hidden md:block" /> All rights reserved.
          </p>
        </div>
      </div>

      {/* Brand wordmark: huge, cropped by the bottom edge */}
      <Reveal y={32} margin="0%">
        <div
          aria-hidden="true"
          className="pointer-events-none mt-10 h-[0.74em] select-none overflow-hidden whitespace-nowrap text-center pl-[0.03em] text-[18vw] font-semibold uppercase leading-[0.9] tracking-[0.03em] text-navy-950 md:mt-16"
        >
          EL PASEO
        </div>
      </Reveal>
    </footer>
  );
}
