"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { AdminCategory, AdminDestination } from "@/lib/db";
import { EASE, usePrefersReducedMotion } from "./motion";
import { focusRing } from "./ui";

export type DestinationWithCount = AdminDestination & {
  packageCount: number;
};

type CategoryTab = {
  id: string;
  label: string;
  count: number;
};

const TAB_WINDOW = 3;

export function CategoryDestinations({
  categories,
  destinations,
}: {
  categories: AdminCategory[];
  destinations: DestinationWithCount[];
}) {
  const reduce = usePrefersReducedMotion();

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of destinations) {
      if (d.categoryId) {
        map.set(d.categoryId, (map.get(d.categoryId) ?? 0) + 1);
      }
    }
    return map;
  }, [destinations]);

  const tabs: CategoryTab[] = useMemo(
    () =>
      categories
        .map((cat) => ({
          id: cat.id,
          label: cat.name,
          count: categoryCounts.get(cat.id) ?? 0,
        }))
        .filter((tab) => tab.count > 0),
    [categories, categoryCounts],
  );

  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const [windowStart, setWindowStart] = useState(0);

  useEffect(() => {
    if (tabs.length === 0) return;
    if (!tabs.some((tab) => tab.id === activeId)) {
      setActiveId(tabs[0].id);
      setWindowStart(0);
    }
  }, [activeId, tabs]);

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  );
  const activeTab = tabs[activeIndex] ?? tabs[0];

  const maxStart = Math.max(0, tabs.length - TAB_WINDOW);

  const revealAround = useCallback(
    (index: number) => {
      if (tabs.length <= TAB_WINDOW) {
        setWindowStart(0);
        return;
      }

      setWindowStart((prev) => {
        const end = prev + TAB_WINDOW - 1;
        let next = prev;

        if (index < prev) {
          next = index;
        } else if (index > end) {
          next = index - TAB_WINDOW + 1;
        } else if (index === end && index < tabs.length - 1) {
          // Last visible slot → slide forward so later tabs appear.
          next = Math.min(index, maxStart);
        } else if (index === prev && prev > 0) {
          // First visible slot → slide back so earlier tabs appear.
          next = Math.max(0, index - (TAB_WINDOW - 1));
        }

        return Math.max(0, Math.min(next, maxStart));
      });
    },
    [maxStart, tabs.length],
  );

  const shiftWindow = useCallback(
    (dir: -1 | 1) => {
      if (tabs.length <= TAB_WINDOW) return;
      setWindowStart((prev) =>
        Math.max(0, Math.min(prev + dir, maxStart)),
      );
    },
    [maxStart, tabs.length],
  );

  const selectTab = useCallback(
    (id: string) => {
      const index = tabs.findIndex((tab) => tab.id === id);
      if (index < 0) return;
      setActiveId(id);
      revealAround(index);
    },
    [revealAround, tabs],
  );

  const canShiftBack = windowStart > 0;
  const canShiftForward = windowStart < maxStart;

  const filtered = useMemo(() => {
    const active = categories.find((c) => c.id === activeId);
    return destinations.filter(
      (d) =>
        d.categoryId === activeId ||
        (!!active &&
          d.categoryName?.toLowerCase() === active.name.toLowerCase()),
    );
  }, [activeId, categories, destinations]);

  const visibleTabs = tabs.slice(windowStart, windowStart + TAB_WINDOW);

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, globalIndex: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = (globalIndex + step + tabs.length) % tabs.length;
    selectTab(tabs[next].id);
    requestAnimationFrame(() => {
      document.getElementById(`dest-tab-${tabs[next].id}`)?.focus();
    });
  }

  if (tabs.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center gap-2">
          {tabs.length > TAB_WINDOW ? (
            <button
              type="button"
              aria-label="Show earlier categories"
              disabled={!canShiftBack}
              onClick={() => shiftWindow(-1)}
              className={`grid size-10 shrink-0 place-items-center rounded-full border border-cream/15 bg-cream/5 text-cream transition-colors ${focusRing} disabled:pointer-events-none disabled:opacity-25`}
            >
              <ArrowLeft className="size-3.5" />
            </button>
          ) : null}

          <div
            role="tablist"
            aria-label="Destination categories"
            className="grid min-w-0 flex-1 overflow-hidden rounded-xl border border-cream/20 bg-navy-900/50"
            style={{
              gridTemplateColumns: `repeat(${Math.min(TAB_WINDOW, tabs.length)}, minmax(0, 1fr))`,
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleTabs.map((tab, i) => {
                const globalIndex = windowStart + i;
                const selected = tab.id === activeId;
                const showDivider = i < visibleTabs.length - 1;

                return (
                  <motion.div
                    key={tab.id}
                    layout
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: -12 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.28, ease: EASE }
                    }
                    className={`relative min-w-0 ${showDivider ? "border-r border-cream/15" : ""}`}
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`dest-tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls="dest-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => selectTab(tab.id)}
                      onKeyDown={(e) => onTabKey(e, globalIndex)}
                      className={`flex min-h-12 w-full flex-col items-center justify-center gap-0.5 px-2 py-3 text-center transition-colors duration-300 ${focusRing} ${
                        selected
                          ? "bg-gold-400/90 text-navy-950"
                          : "bg-transparent text-cream/55 hover:bg-cream/[0.04] hover:text-cream/85"
                      }`}
                    >
                      <span className="w-full truncate text-[0.62rem] font-semibold uppercase tracking-[0.14em] sm:text-[0.68rem] sm:tracking-[0.16em]">
                        {tab.label}
                      </span>
                      <span
                        className={`text-[0.58rem] tracking-wide ${selected ? "text-navy-950/60" : "text-cream/35"}`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {tabs.length > TAB_WINDOW ? (
            <button
              type="button"
              aria-label="Show later categories"
              disabled={!canShiftForward}
              onClick={() => shiftWindow(1)}
              className={`grid size-10 shrink-0 place-items-center rounded-full border border-cream/15 bg-cream/5 text-cream transition-colors ${focusRing} disabled:pointer-events-none disabled:opacity-25`}
            >
              <ArrowRight className="size-3.5" />
            </button>
          ) : null}
        </div>

        {tabs.length > TAB_WINDOW ? (
          <p className="mt-2.5 text-center text-[0.62rem] uppercase tracking-[0.18em] text-cream/35">
            {windowStart + 1}–{Math.min(windowStart + TAB_WINDOW, tabs.length)} of{" "}
            {tabs.length}
          </p>
        ) : null}
      </div>

      <div
        role="tabpanel"
        id="dest-panel"
        aria-label={activeTab?.label ?? "Destinations"}
        className="relative mt-8 md:mt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeId}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.28, ease: EASE }
            }
          >
            <DestinationRail destinations={filtered} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DestinationRail({
  destinations,
}: {
  destinations: DestinationWithCount[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [destinations, updateEdges]);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-rail-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  if (destinations.length === 0) {
    return (
      <div className="rounded-2xl border border-cream/10 bg-navy-900/60 px-5 py-12 text-center sm:px-6 sm:py-14">
        <p className="text-sm text-cream/50">
          No destinations found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="-mx-5 flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-4 md:mx-0 md:gap-5 md:px-0"
      >
        {destinations.map((dest) => (
          <DestinationCard key={dest.id} dest={dest} />
        ))}
        <div aria-hidden="true" className="w-1 shrink-0 md:hidden" />
      </div>

      {(canPrev || canNext) && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
          <RailArrow
            label="Previous destinations"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            side="left"
          />
          <RailArrow
            label="Next destinations"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            side="right"
          />
        </div>
      )}
    </div>
  );
}

function RailArrow({
  label,
  disabled,
  onClick,
  side,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  side: "left" | "right";
}) {
  const Icon = side === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`pointer-events-auto grid size-11 place-items-center rounded-full border border-cream/20 bg-navy-950/80 text-cream shadow-[0_12px_30px_-16px_oklch(0.2_0.055_258/0.9)] backdrop-blur-md transition-[opacity,border-color,color] duration-300 ${focusRing} ${
        disabled
          ? "opacity-0"
          : "opacity-100 hover:border-gold-400/50 hover:text-gold-300"
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}

function cardBlurb(dest: DestinationWithCount) {
  const place = dest.region?.trim();
  if (dest.packageCount > 0) {
    return place
      ? `${place}. ${dest.packageCount} curated package${dest.packageCount === 1 ? "" : "s"} ready to explore.`
      : `${dest.packageCount} curated package${dest.packageCount === 1 ? "" : "s"} ready to explore.`;
  }
  return place
    ? `${place}. Plan a tailored stay with EL PASEO.`
    : "Plan a tailored stay with EL PASEO.";
}

function DestinationCard({ dest }: { dest: DestinationWithCount }) {
  return (
    <Link
      data-rail-card
      href={`/destinations/${dest.id}`}
      className="group relative block aspect-[3/4] w-[min(78vw,18.5rem)] shrink-0 snap-center overflow-hidden rounded-[1.35rem] bg-navy-900 transition-transform duration-500 hover:-translate-y-1 sm:w-[min(46vw,21rem)] sm:snap-start lg:w-[min(28vw,22.5rem)]"
    >
      <Image
        src={dest.src}
        alt={dest.alt || dest.title}
        fill
        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 46vw, 78vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Soft top shade so photo still reads as full-bleed */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-navy-950/10"
      />

      {/* Glass caption — reference card treatment */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
        <div className="flex items-end gap-3 rounded-2xl border border-cream/20 bg-cream/[0.12] p-3.5 shadow-[0_16px_40px_-24px_oklch(0.1_0.04_258/0.85)] backdrop-blur-2xl sm:gap-4 sm:p-4">
          <div className="min-w-0 flex-1 text-left">
            <h3 className="truncate text-[1.05rem] font-semibold tracking-[-0.02em] text-cream sm:text-lg">
              {dest.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-[0.72rem] leading-relaxed text-cream/75 sm:text-[0.78rem]">
              {cardBlurb(dest)}
            </p>
          </div>
          <span className="mb-0.5 inline-flex shrink-0 items-center rounded-full border border-cream/20 bg-navy-950/55 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-cream transition-colors duration-300 group-hover:border-gold-400/50 group-hover:text-gold-300">
            Explore
          </span>
        </div>
      </div>
    </Link>
  );
}
