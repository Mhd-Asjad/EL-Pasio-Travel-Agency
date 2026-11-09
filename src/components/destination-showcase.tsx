"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { focusRing } from "./ui";

export type ShowcaseDestination = {
  id: string;
  title: string;
  region: string;
  alt: string;
  src: string;
  packageCount: number;
};

export function DestinationShowcase({
  destinations,
}: {
  destinations: ShowcaseDestination[];
}) {
  const [activeId, setActiveId] = useState(destinations[0]?.id ?? "");

  const featured = useMemo(
    () => destinations.find((d) => d.id === activeId) ?? destinations[0],
    [activeId, destinations],
  );
  const rest = useMemo(
    () => destinations.filter((d) => d.id !== featured?.id),
    [destinations, featured],
  );
  const side = rest.slice(0, 2);
  const more = rest.slice(2);

  if (!featured) return null;

  return (
    <div className="w-full text-left">
      <nav
        aria-label="Destination trail"
        className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {destinations.map((dest) => {
          const active = dest.id === featured.id;
          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => setActiveId(dest.id)}
              aria-current={active ? "true" : undefined}
              className={`shrink-0 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors md:px-4 ${focusRing} ${
                active
                  ? "text-gold-300"
                  : "text-cream/45 hover:text-cream/80"
              }`}
            >
              {dest.title}
              <span
                aria-hidden="true"
                className={`mt-2 block h-px w-full origin-left bg-gold-400 transition-transform duration-500 ease-spring ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5 lg:h-[34rem]">
        <DestinationTile dest={featured} featured />
        {side.map((dest) => (
          <DestinationTile
            key={dest.id}
            dest={dest}
            compact
            stretch
            className={side.length === 1 ? "lg:row-span-2" : undefined}
          />
        ))}
      </div>

      {more.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3 lg:gap-5">
          {more.map((dest) => (
            <DestinationTile key={dest.id} dest={dest} compact />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DestinationTile({
  dest,
  featured = false,
  compact = false,
  stretch = false,
  className = "",
}: {
  dest: ShowcaseDestination;
  featured?: boolean;
  compact?: boolean;
  stretch?: boolean;
  className?: string;
}) {
  const count =
    dest.packageCount === 1
      ? "1 package"
      : dest.packageCount > 0
        ? `${dest.packageCount} packages`
        : "Packages on request";

  return (
    <Link
      href={`/destinations/${dest.id}`}
      aria-label={`Explore packages for ${dest.title}, ${dest.region}`}
      className={`group relative block overflow-hidden rounded-2xl border border-cream/10 bg-navy-900 transition-[border-color,transform] duration-500 hover:border-gold-400/50 ${
        featured
          ? "h-full min-h-[22rem] lg:row-span-2"
          : stretch
            ? "h-full min-h-[16rem]"
            : "aspect-[16/10] min-h-[14rem]"
      } ${className}`}
    >
      <Image
        src={dest.src}
        alt={dest.alt || dest.title}
        fill
        sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-transparent"
      />
      <div className={`absolute inset-x-0 bottom-0 ${featured ? "p-6 md:p-8" : "p-5"}`}>
        {dest.region ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold-300">
            {dest.region}
          </p>
        ) : null}
        <h3
          className={`mt-1.5 font-display italic leading-tight text-cream ${
            featured
              ? "text-[clamp(2.15rem,4vw,3.5rem)]"
              : compact
                ? "text-2xl md:text-[1.85rem]"
                : "text-3xl"
          }`}
        >
          {dest.title}
        </h3>
        <p
          className={`mt-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream/70 transition-colors group-hover:text-gold-300 ${
            featured ? "mt-3" : ""
          }`}
        >
          {count}
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
