# Design

> Source of truth for typography, color, motion, layout, and component tokens.
> Read this BEFORE touching the UI in any later session.

## Aesthetic direction

Cinematic travel: a full-bleed golden-hour landscape, light-weight geometric sans, and one italic serif word in gold for warmth. Navy and gold carry the brand; the photo carries the emotion.

Note: the hero is deliberately **centered**. This follows the user's reference image (`Travels` hero) and is an intentional exception to the "no centered hero" rule.

## Dials

- DESIGN_VARIANCE: 4 / 10 (hero is centered on request; lower sections can be more asymmetric)
- MOTION_INTENSITY: 4 / 10
- VISUAL_DENSITY: 3 / 10

## Type stack

- Sans (headline + body + UI): **Montserrat** (variable) via `next/font/google`, `--font-montserrat`
- Display accent: **Instrument Serif** (italic) via `next/font/google`, `--font-instrument-serif`, tailwind `font-display`
- Headline: `font-light`, `tracking-[-0.035em]`, `leading-[1.02]`
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
- Hero: `min-h-[100dvh]` (never `h-screen`), image `fill` + `object-cover`, three overlays (top, vertical wash, radial behind headline)
- Nav collapses to a full-screen menu below `lg`
- Primary CTA: gold pill, navy text. Secondary: outlined cream pill, glass blur. Min height 48px.

## Sections

- Hero and About share one palette: navy-950 background, cream text, gold-300 accents, gold-400 primary buttons. The hero's bottom gradient and a scroll-built navy veil dissolve into About with no seam.
- Light (cream) sections are reserved for later contrast (Services/Packages); on cream use `gold-600` for gold text and `navy-950` buttons.
- Section recipe: gold stem or eyebrow, light headline with ONE italic serif gold word, body in `cream/85`, gold primary CTA.

## Motion (Framer Motion, `framer-motion` ^14)

- One easing: `EASE = [0.22, 1, 0.36, 1]`; scroll progress goes through `useSpring` (stiffness 110, damping 28) so motion feels weighted. No bounce.
- Hero (scroll-linked): photo drifts down 12% and zooms to 1.12, content rises 150px and fades, "Explore," slides left and "Discover" slides right, "Dream," lifts, navy veil fades in.
- About (scroll-linked): headline lines slide in from opposite sides (`ScrollSlide`, 12vw), background glows drift (`Parallax`). One-shot: `Reveal` fade-up for copy, slogans (staggered), CTA; `GrowLine` draws the stem and ornament.
- Only `transform` and `opacity` animate. Reduced motion zeroes all travel distances via `useTravel()` (a motion value that starts at 1 on server AND client, then drops to 0 after mount). Never read `useReducedMotion()` while computing rendered styles or `initial` values: it differs between server and client and causes a hydration mismatch.
- Use `Reveal`/`ScrollSlide` from `motion.tsx` in new sections so motion stays consistent; keep sections themselves as server components where possible.

## Component inventory

- `src/components/site-header.tsx` (client: mobile menu state only)
- `src/components/brand-mark.tsx` (`LogoBadge`: real logo `public/images/logo.png` on a cream disc, `Wordmark`). The logo has navy lettering and mountains, so it must always sit on cream, never directly on navy.
- `src/components/about.tsx` (navy, fully centered, no imagery; server component using the motion primitives; copy is the exact PRD 7.1 text with the motto in gold serif italic)
- `src/components/destinations.tsx` (id `#packages`; navy; same eyebrow/headline recipe; "Places worth getting *lost* in")
- `src/components/card-spread.tsx` (client; fanned deck: fans out on scroll-in, hovered card lifts and straightens, neighbours push aside with falloff, captions only on active/centre card; tap-to-open then tap-to-follow on touch; 192px spacing desktop, 56px compact below 640px; whole fan scales to fit). Local stand-in for React Bits Pro "Card Spread".
- `src/components/testimonials.tsx` (id `#testimonials`; navy; header recipe; holds the sample review data)
- `src/components/testimonial-carousel.tsx` (client; centred cream card, neighbours lightly blurred (2.5px) + tilted with perspective; shadcn `Avatar` with illustrated profile pictures from `public/images/avatars/` and initials fallback; compact 36px arrow buttons with a 48px hit area; spring-driven; drag/swipe, arrows, dots, ArrowLeft/Right, autoplay 7s that pauses on hover/focus/touch and is off for reduced motion; circular, shortest-path offsets)
- `src/components/ui/avatar.tsx` (shadcn Avatar, restyled to navy/gold tokens) and `src/lib/utils.ts` (`cn` = clsx + tailwind-merge). Run shadcn components with `@/lib/utils`; never the npm package `cn`.
- `src/components/marquee.tsx` (`ServiceMarquee`, bottom of the hero on every breakpoint: endless horizontal service ticker, CSS `animate-marquee` (transform only, 38s linear) over two identical rows for a seamless loop, edge fade mask, pauses on hover, always auto-scrolls (90s, calmer, when reduced motion is on); keyframes live in `globals.css` `@theme`)
- `src/components/site-footer.tsx` (id `#contact`, also hosts the `#inquiry` anchor so every "Plan My Trip / Plan Your Trip" button lands here until a full inquiry form exists). Light footer: cream bg, navy text, `gold-600` labels, rounded top corners overlapping the section above, no big headline. Logo + short line + WhatsApp/Call buttons, three link columns (Explore, Contact, Follow), legal row, and a huge faint "EL PASEO" watermark (`text-[16.4vw]`, nowrap, cropped at the bottom). Light-tone variants: `ButtonLink tone="light"`, `Wordmark tone="light"`. The watermark `Reveal` uses `margin="0%"` and a small `y`, because it sits at the very end of the page and a larger offset would never trigger
- `src/lib/contact.ts` (single source for phone, WhatsApp number, email, address, maps link, `whatsappUrl()`; `SOCIAL_LINKS` for Instagram/Facebook, empty = fall back to WhatsApp)
- `src/components/ui.tsx` (shared `Eyebrow`, `ButtonLink`, `headlineClass`, `accentClass`, `bodyClass`, `focusRing`; every section must use these, never re-declare)
- `src/components/motion.tsx` (client: `Reveal`, `ScrollSlide`, `Parallax`, `GrowLine`, shared `EASE`)
- `src/components/hero.tsx` (client; Framer Motion scroll parallax)
- `src/components/icons.tsx` (inline SVG, 1.5 stroke)

## Open items

- Instagram and Facebook URLs are not in the PRD. Set `SOCIAL_LINKS.instagram` / `.facebook` in `src/lib/contact.ts`; until then those icons open the WhatsApp chat (aria-label says so).
- WhatsApp link is built from the PRD phone number (+91 9074926319). Confirm it is the WhatsApp Business number.
- Destination cards open WhatsApp with a message naming the place.
- Testimonials are SAMPLE text with invented Indian names and illustrated avatars. Replace with real customer feedback (with permission) before launch.
- React Bits Pro: `components.json` has the `@reactbits-starter` and `@reactbits-pro` registries (Authorization `Bearer ${REACTBITS_LICENSE_KEY}`). Put the licence key in `.env.local` (gitignored), then run `npx shadcn@latest add @reactbits-starter/card-spread-tw`. Until then `card-spread.tsx` is a local implementation.
- Destination photos in `public/images/destinations/` are generated placeholders (portrait 768x1024); replace with real photography.
- Hero photo is a 1280x720 generated placeholder at `public/images/hero-mountain-lake.jpg`; swap in a real 2400px+ photo (Kerala hills, backwaters, or beach) for production.
- Anchor target `#services` does not exist yet (`#packages` is the destinations section).

Last updated: 2026-10-31 (hero, about, destinations, testimonials, footer)
