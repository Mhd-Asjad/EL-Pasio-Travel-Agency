'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { AdminCategory, AdminDestination } from '@/lib/db';
import { focusRing } from './ui';

export type DestinationWithCount = AdminDestination & {
  packageCount: number;
};

export function CategoryDestinations({
  categories,
  destinations,
}: {
  categories: AdminCategory[];
  destinations: DestinationWithCount[];
}) {
  const [selectedCat, setSelectedCat] = useState<string>('all');

  // Filter destinations
  const filtered = useMemo(() => {
    if (selectedCat === 'all') return destinations;
    return destinations.filter(
      (d) => d.categoryId === selectedCat || d.categoryName?.toLowerCase() === selectedCat.toLowerCase()
    );
  }, [destinations, selectedCat]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of destinations) {
      if (d.categoryId) {
        map.set(d.categoryId, (map.get(d.categoryId) ?? 0) + 1);
      }
    }
    return map;
  }, [destinations]);

  return (
    <div className="w-full">
      {/* ── Category Filter Pills ── */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          aria-current={selectedCat === 'all' ? 'true' : undefined}
          className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${focusRing} ${
            selectedCat === 'all'
              ? 'bg-gold-400 text-navy-950 shadow-[0_4px_20px_oklch(0.8_0.125_84/0.3)]'
              : 'border border-cream/15 bg-cream/5 text-cream/70 hover:border-gold-400/50 hover:text-cream'
          }`}
        >
          All ({destinations.length})
        </button>

        {categories.map((cat) => {
          const count = categoryCounts.get(cat.id) ?? 0;
          const isActive = selectedCat === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${focusRing} ${
                isActive
                  ? 'bg-gold-400 text-navy-950 shadow-[0_4px_20px_oklch(0.8_0.125_84/0.3)]'
                  : 'border border-cream/15 bg-cream/5 text-cream/70 hover:border-gold-400/50 hover:text-cream'
              }`}
            >
              {cat.name}
              {count > 0 && <span className="ml-1.5 opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* ── Plain Destination Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-cream/10 bg-navy-900/60 p-12 text-center">
          <p className="text-sm text-cream/50">No destinations found in this category.</p>
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300"
          >
            <span>Show all destinations</span>
            <ArrowRight className="size-3" />
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {filtered.map((dest) => {
            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.id}`}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-cream/10 bg-navy-900 transition-all duration-500 hover:border-gold-400/60 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
              >
                {/* Photo with subtle zoom */}
                <Image
                  src={dest.src}
                  alt={dest.alt || dest.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay for readability */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-transparent"
                />

                {/* Top Badge: Category */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  {dest.categoryName && (
                    <span className="rounded-full bg-navy-950/85 backdrop-blur-md border border-gold-400/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-300">
                      {dest.categoryName}
                    </span>
                  )}
                  {dest.packageCount > 0 && (
                    <span className="rounded-full bg-cream/15 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-cream/90">
                      {dest.packageCount} package{dest.packageCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Bottom Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  {dest.region && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
                      {dest.region}
                    </p>
                  )}
                  <h3 className="mt-1 font-display text-2xl md:text-3xl font-normal italic leading-tight text-cream">
                    {dest.title}
                  </h3>
                  <div className="mt-3.5 flex items-center justify-between text-xs font-medium tracking-wider text-cream/75 transition-colors group-hover:text-gold-300">
                    <span>View packages & details</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
