# Design

> Source of truth for typography, color, motion, layout, and component tokens.
> Read this BEFORE touching the UI in any later session.

## Aesthetic direction

Full-bleed booking stage: the hero photo runs edge to edge. Headline left, compact glass search card right (packages, stays, tickets, plan). Light-weight geometric sans, one italic serif gold word.

## Dials

- DESIGN_VARIANCE: 6 / 10 (full-bleed photo, split headline + search card)
- MOTION_INTENSITY: 4 / 10
- VISUAL_DENSITY: 4 / 10 (the card is a search widget, not a full form)

## Type stack

- Sans (headline + body + UI): **Montserrat** (variable) via `next/font/google`, `--font-montserrat`
- Display accent: **Instrument Serif** (italic) via `next/font/google`, `--font-instrument-serif`, tailwind `font-display`
- Headline: `font-light`, `tracking-[-0.035em]`, `leading-[1.02]`. The hero title is one line: “Explore, Dream, Discover”. Dream stays the italic gold word. The size scales so the line fits the column.
- Eyebrows / labels: uppercase, `font-semibold`, `tracking-[0.3em–0.42em]`, small (0.62–0.75rem), under 4 words
- Wordmark: `EL PASEO` semibold `tracking-[0.32em]`; `TOURS & TRAVELS` 0.56rem `tracking-[0.34em]` gold
- Rule: serif is used for one accent word or mobile-menu links only, never for body

Banned: Inter, Roboto, Arial, system-ui.

## Color tokens (OKLCH, defined in `src/app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `navy-950` | `oklch(0.2 0.055 258)` | page background, overlays, text on gold |
| `navy-900` | `oklch(0.25 0.065 258)` | surfaces |
| `navy-700` | `oklch(0.35 0.08 258)` | borders on navy |
| `gold-300` | `oklch(0.86 0.1 88)` | accent text, hover |
| `gold-400` | `oklch(0.8 0.125 84)` | primary buttons, emblem |
| `gold-500` | `oklch(0.73 0.125 80)` | shadows, rules, diamonds on cream |
| `gold-600` | `oklch(0.52 0.105 72)` | gold text on cream (AA contrast) |
| `cream` | `oklch(0.975 0.012 88)` | text on dark, light sections |
| `sun` | `oklch(0.88 0.15 95)` | rare emphasis |
| `teal` | `oklch(0.66 0.09 195)` | travel accent for later sections |

No pure black or white. Shadows are navy/gold tinted. Final hex values should still be sampled from the brand logo asset.

## Layout

- Container: `max-w-[1400px] mx-auto px-5 md:px-10`
- Hero: full-bleed photo, `min-h-[100dvh]` (never `h-screen`), no page margin. Header sits on the photo. Copy left (`lg:col-span-6`): eyebrow, one-line headline, sentence, button. Search card right (`lg:col-span-5`). Stacked layouts use `gap-14` / `gap-16` between the copy and the card. Bottom of the hero: a plain scroll icon linking to `#about`, then `ServiceMarquee`.
- Nav collapses to a full-screen menu below `lg`
- Primary CTA: gold pill, navy text. Secondary: outlined cream pill, glass blur. On cream surfaces (`tone="light"`): navy pill. Min height 48px. Use `Button` for form submits, `ButtonLink` for anchors.

## Sections

- Hero and About are both full-bleed navy. The hero photo carries the top of the page.
- Light (cream) sections are reserved for later contrast (Services/Packages); on cream use `gold-600` for gold text and `navy-950` buttons.
- Section recipe: gold stem or eyebrow, light headline with ONE italic serif gold word, body in `cream/85`, gold primary CTA.

## Motion (Framer Motion, `framer-motion` ^14)

- One easing: `EASE = [0.22, 1, 0.36, 1]`; scroll progress goes through `useSpring` (stiffness 110, damping 28) so motion feels weighted. No bounce.
- Hero (scroll-linked): photo drifts 8% and zooms to 1.06 inside the frame. Entrance: staggered fade-up of headline and card. Search card steps cross-fade (opacity + 10px).
- About (scroll-linked): headline lines slide in from opposite sides (`ScrollSlide`, 12vw), background glows drift (`Parallax`). One-shot: `Reveal` fade-up for copy, slogans (staggered), CTA; `GrowLine` draws the stem and ornament.
- Only `transform` and `opacity` animate. Reduced motion zeroes all travel distances via `useTravel()` (a motion value that starts at 1 on server AND client, then drops to 0 after mount). Never read `useReducedMotion()` while computing rendered styles or `initial` values: it differs between server and client and causes a hydration mismatch.
- Use `Reveal`/`ScrollSlide` from `motion.tsx` in new sections so motion stays consistent; keep sections themselves as server components where possible.

## Component inventory

- `src/components/site-header.tsx` (client: mobile menu state only)
- `src/components/brand-mark.tsx` (`LogoBadge`: real logo `public/images/logo.png` on a cream disc, `Wordmark`). The logo has navy lettering and mountains, so it must always sit on cream, never directly on navy.
- `src/components/about.tsx` (navy, fully centered, no imagery, no trip button; mobile vertical padding is `py-8`, desktop stays `py-14`; server component using the motion primitives; copy is the exact PRD 7.1 text with the motto in gold serif italic)
- `src/components/destinations.tsx` (id `#packages`; navy; same eyebrow/headline recipe; "Places worth getting *lost* in")
- `src/components/card-spread.tsx` (client; fanned deck: fans out on scroll-in, hovered card lifts and straightens, neighbours push aside with falloff, captions only on active/centre card; tap-to-open then tap-to-follow on touch; 192px spacing desktop, 56px compact below 640px; whole fan scales to fit). Local stand-in for React Bits Pro "Card Spread".
- `src/components/testimonials.tsx` (id `#testimonials`; navy; header recipe; holds the sample review data)
- `src/components/testimonial-carousel.tsx` (client; centred cream card, neighbours lightly blurred (2.5px) + tilted with perspective; shadcn `Avatar` with illustrated profile pictures from `public/images/avatars/` and initials fallback; compact 36px arrow buttons with a 48px hit area; spring-driven; drag/swipe, arrows, dots, ArrowLeft/Right, autoplay 7s that pauses on hover/focus/touch and is off for reduced motion; circular, shortest-path offsets)
- `src/components/ui/avatar.tsx` (shadcn Avatar, restyled to navy/gold tokens) and `src/lib/utils.ts` (`cn` = clsx + tailwind-merge). Run shadcn components with `@/lib/utils`; never the npm package `cn`.
- `src/components/marquee.tsx` (`ServiceMarquee`, bottom of the hero: endless horizontal service ticker, CSS `animate-marquee` 38s linear, two rows, pauses on hover, 90s when reduced motion is on)
- `src/components/booking-desk.tsx` (client; frosted glass search card: cream gradient `oklch(0.99/0.78)` to `oklch(0.97/0.62)`, `backdrop-blur-2xl`, cream edge and inset highlight. Fields stay a touch more opaque so navy text holds over the dark photo. Tabs: Packages, Stays, Tickets, Plan. Tickets opens Flight / Train / Bus. Step 1: where to, date, guests. Step 2: name, WhatsApp, email, note, then WhatsApp. `#services` is the card, `#inquiry` is the form.)
- `src/components/site-footer.tsx` (id `#contact`). Light footer: cream-warm bg, navy text, `gold-600` labels. WhatsApp/Call, link rows, huge faded "EL PASEO" watermark that slides in on scroll. Light-tone variants: `ButtonLink tone="light"`, `Wordmark tone="light"`. The watermark `Reveal` uses `margin="0%"` and a small `y`, because it sits at the very end of the page and a larger offset would never trigger
- `src/lib/contact.ts` (single source for phone, WhatsApp number, email, address, maps link, `whatsappUrl()`; `SOCIAL_LINKS` for Instagram/Facebook, empty = fall back to WhatsApp)
- `src/components/ui.tsx` (shared `Eyebrow`, `Button`, `ButtonLink`, `buttonClass`, `headlineClass`, `accentClass`, `bodyClass`, `focusRing`; every section must use these, never re-declare)
- `src/components/motion.tsx` (client: `Reveal`, `ScrollSlide`, `Parallax`, `GrowLine`, shared `EASE`)
- `src/components/hero.tsx` (client; full-bleed photo, header, search card, scroll icon, service ticker)
- `src/components/icons.tsx` (inline SVG, 1.5 stroke; booking set: suitcase, hotel, plane, train, bus, compass)

## Open items

- Instagram and Facebook URLs are not in the PRD. Set `SOCIAL_LINKS.instagram` / `.facebook` in `src/lib/contact.ts`; until then those icons open the WhatsApp chat (aria-label says so).
- WhatsApp link is built from the PRD phone number (+91 9074926319). Confirm it is the WhatsApp Business number.
- Destination cards open WhatsApp with a message naming the place.
- Testimonials are SAMPLE text with invented Indian names and illustrated avatars. Replace with real customer feedback (with permission) before launch.
- React Bits Pro: `components.json` has the `@reactbits-starter` and `@reactbits-pro` registries (Authorization `Bearer ${REACTBITS_LICENSE_KEY}`). Put the licence key in `.env.local` (gitignored), then run `npx shadcn@latest add @reactbits-starter/card-spread-tw`. Until then `card-spread.tsx` is a local implementation.
- Destination photos in `public/images/destinations/` are generated placeholders (portrait 768x1024); replace with real photography.
- Hero photo is a 1280x720 generated placeholder at `public/images/hero-mountain-lake.jpg`; swap in a real 2400px+ photo (Kerala hills, backwaters, or beach) for production.
- Hero inquiry submits to WhatsApp (no backend yet). A second, longer inquiry section is still on the PRD backlog.

Last updated: 2026-11-05 (hero title is one line: Explore, Dream, Discover)
