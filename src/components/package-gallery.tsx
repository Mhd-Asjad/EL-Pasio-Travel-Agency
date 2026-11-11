"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import CircularGallery from "@/components/circular-gallery/CircularGallery";
import Masonry from "@/components/masonry/Masonry";
import type { AdminPackage } from "@/lib/db";
import { whatsappUrl } from "@/lib/contact";
import { ButtonLink, focusRing } from "./ui";

type GalleryImage = {
  id: string;
  img: string;
  title?: string;
  description?: string;
  alt?: string;
  width?: number;
  height?: number;
};

type CircularItem = {
  image: string;
  text?: string;
  description?: string;
  alt?: string;
};

function uniqueImages(images: string[]) {
  const seen = new Set<string>();
  return images.filter((src) => {
    if (!src || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

const smallButton =
  "!min-h-9 gap-1.5 px-5 text-xs tracking-[0.03em] md:!min-h-10 md:px-6 md:text-[0.8125rem]";

function packageTitle(pkg: AdminPackage) {
  return pkg.label || pkg.lead || "Package";
}

function packageCover(pkg: AdminPackage) {
  return pkg.src || pkg.images?.[0] || "/images/hero-mountain-lake.jpg";
}

function photoItems(
  pkg: AdminPackage,
  destinationTitle: string,
): GalleryImage[] {
  const title = packageTitle(pkg);
  const cover = packageCover(pkg);
  const sources = uniqueImages([
    cover,
    ...(pkg.images?.length ? pkg.images : []),
  ]);

  return sources.map((img, i) => ({
    id: `${pkg.id}-${i}`,
    img,
    title: i === 0 ? title : undefined,
    description: i === 0 ? destinationTitle : undefined,
    alt: `${title} photo ${i + 1}`,
    width: 800,
    height: i % 3 === 0 ? 1100 : i % 3 === 1 ? 900 : 700,
  }));
}

export function DestinationPackages({
  packages,
  destinationTitle,
  selectedId,
  onSelect,
  onBack,
}: {
  packages: AdminPackage[];
  destinationTitle: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  const selected = useMemo(
    () => packages.find((pkg) => pkg.id === selectedId) ?? null,
    [packages, selectedId],
  );

  const circularItems = useMemo<CircularItem[]>(
    () =>
      packages.map((pkg) => {
        const title = packageTitle(pkg);
        return {
          image: packageCover(pkg),
          text: title,
          description:
            pkg.blurb ||
            pkg.highlights?.slice(0, 2).join(" · ") ||
            `Package in ${destinationTitle}`,
          alt: `${title} package`,
        };
      }),
    [packages, destinationTitle],
  );

  if (selected) {
    return (
      <PackageDetail
        pkg={selected}
        destinationTitle={destinationTitle}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="mt-12 w-full md:mt-16">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
        <p className="text-sm text-cream/55">
          click a package to open details
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300/80">
          {packages.length} package{packages.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="relative h-[min(68dvh,520px)] w-full overflow-hidden rounded-2xl border border-cream/10 bg-navy-950 sm:h-[600px]">
        <CircularGallery
          key={packages.map((pkg) => pkg.id).join("|")}
          items={circularItems}
          bend={3}
          textColor="#F7F3E8"
          borderRadius={0.05}
          scrollEase={0.05}
          itemSize={1}
          font='600 28px "Montserrat", sans-serif'
          showTitles
          openOnClick={false}
          snap
          fadeEdges={0.14}
          shadow={0.3}
          onItemClick={(_item: CircularItem, index: number) => {
            const pkg = packages[index];
            if (pkg) onSelect(pkg.id);
          }}
        />
      </div>
    </div>
  );
}

function PackageDetail({
  pkg,
  destinationTitle,
  onBack,
}: {
  pkg: AdminPackage;
  destinationTitle: string;
  onBack: () => void;
}) {
  const title = packageTitle(pkg);
  const enquireHref = whatsappUrl(
    `Hello EL PASEO Tours & Travels, I would like to know more about the ${title} package in ${destinationTitle}.`,
  );
  const items = useMemo(
    () => photoItems(pkg, destinationTitle),
    [pkg, destinationTitle],
  );
  // Mobile browsers fire a delayed "ghost" click after touch — ignore gallery
  // taps briefly so that click doesn't open the lightbox immediately.
  const [galleryReady, setGalleryReady] = useState(false);
  useEffect(() => {
    setGalleryReady(false);
    const id = window.setTimeout(() => setGalleryReady(true), 500);
    return () => window.clearTimeout(id);
  }, [pkg.id]);

  return (
    <div className="space-y-6 md:space-y-8">
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex min-h-9 items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 text-xs font-medium tracking-[0.04em] text-cream transition-colors hover:border-cream/40 hover:bg-cream/10 md:min-h-10 md:px-5 ${focusRing}`}
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to packages
      </button>

      <div className="w-full rounded-2xl border border-cream/10 bg-navy-950/80 px-3 py-5 sm:px-5 sm:py-7 md:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-1 sm:mb-6">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-300">
              Package gallery
            </p>
            <h3 className="mt-1 text-lg font-light tracking-[-0.03em] text-cream sm:text-xl">
              Photos & brochure
            </h3>
          </div>
          <p className="text-xs text-cream/50 sm:text-sm">
            {items.length} photo{items.length === 1 ? "" : "s"} · tap to enlarge
          </p>
        </div>

        {items.length > 0 ? (
          <div className={galleryReady ? undefined : "pointer-events-none"}>
            <Masonry
              items={items}
              columnWidth={200}
              gap={10}
              radius={14}
              animateFrom="bottom"
              hoverEffect="zoom"
              captions="hover"
              lightbox={galleryReady}
              draggable={false}
              blurToFocus
              revealOnScroll={false}
            />
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-cream/60">
            No brochure photos available for this package yet.
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-cream/10 bg-navy-900/80 px-5 py-6 text-center sm:px-8 sm:py-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-300">
          Ready to book?
        </p>
        <p className="max-w-md text-sm leading-relaxed text-cream/70">
          Tell us your dates and group size — we will tailor this {title} package
          for you.
        </p>
        <ButtonLink href={enquireHref} external arrow className={smallButton}>
          Enquire on WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}
