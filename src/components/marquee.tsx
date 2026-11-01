const SERVICES = [
  "Holiday Packages",
  "Resort & Hotel Stays",
  "Flight, Train & Bus Tickets",
  "Itinerary Planning",
  "Family, Couple & Solo Trips",
  "National & International Tours",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {SERVICES.map((label) => (
        <li
          key={label}
          className="flex shrink-0 items-center gap-4 pr-10 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-cream/80 md:gap-5 md:pr-16 md:text-[0.72rem] md:tracking-[0.26em]"
        >
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold-400" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Endless horizontal ticker of services. Two identical rows slide left by
 * exactly one row's width, so the loop is seamless. Pauses on hover; with
 * reduced motion it keeps running but at a much calmer pace.
 */
export function ServiceMarquee() {
  return (
    <div
      role="region"
      aria-label="Our services"
      className="group relative overflow-hidden border-t border-cream/15 py-5 [mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent)]"
    >
      <div className="flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused] motion-reduce:[animation-duration:90s]">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
