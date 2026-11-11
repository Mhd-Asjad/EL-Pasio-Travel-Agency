"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Package, Search, X } from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { focusRing } from "./ui";

export type HeroSearchItem = {
  id: string;
  type: "destination" | "package";
  title: string;
  subtitle: string;
  href: string;
  image: string;
  keywords: string;
};

const MAX_RESULTS = 8;

export function HeroSearch({
  items,
  onActiveChange,
}: {
  items: HeroSearchItem[];
  onActiveChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter((item) => item.keywords.includes(q))
      .slice(0, MAX_RESULTS);
  }, [deferredQuery, items]);

  const showPanel = open && query.trim().length > 0;

  useEffect(() => {
    onActiveChange?.(showPanel);
  }, [showPanel, onActiveChange]);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!showPanel) return;
    const option = listRef.current?.querySelector<HTMLElement>(
      `[data-search-index="${activeIndex}"]`,
    );
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, showPanel]);

  function goTo(index: number) {
    const item = results[index];
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) {
      if (event.key === "ArrowDown" && results.length > 0) {
        setOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIndex]) goTo(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={rootRef} className="relative z-50 mx-auto w-full max-w-[min(100%,34rem)] px-0">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search destinations and packages
      </label>
      <div
        className={`group flex min-h-12 items-center gap-3 rounded-full border border-cream/25 bg-cream/[0.08] px-3.5 shadow-[0_18px_50px_-28px_oklch(0.2_0.055_258/0.85)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-500 ease-spring focus-within:border-gold-400/55 focus-within:bg-cream/[0.12] focus-within:shadow-[0_20px_60px_-24px_oklch(0.73_0.125_80/0.45)] sm:min-h-14 sm:px-5 ${focusRing}`}
      >
        <Search
          className="size-[1.15rem] shrink-0 text-gold-300"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showPanel && results[activeIndex]
              ? `${listId}-option-${activeIndex}`
              : undefined
          }
          autoComplete="off"
          placeholder="Search destinations or packages…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent py-3.5 text-left text-[0.95rem] text-cream placeholder:text-cream/45 outline-none md:text-[1.02rem]"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className={`grid size-8 shrink-0 place-items-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream ${focusRing}`}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Search results"
          data-lenis-prevent
          onWheel={(event) => event.stopPropagation()}
          className="hero-search-scroll absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(13.5rem,36dvh)] overflow-y-auto overscroll-contain rounded-2xl border border-cream/15 bg-navy-950 shadow-[0_28px_80px_-36px_oklch(0.2_0.055_258/0.95)] backdrop-blur-xl sm:top-[calc(100%+0.65rem)] sm:max-h-[min(16rem,40dvh)] md:max-h-[min(18rem,42dvh)]"
        >
          {results.length === 0 ? (
            <p className="px-3.5 py-4 text-left text-sm text-cream/65 sm:px-5 sm:py-5">
              No destinations or packages match “{query.trim()}”.
            </p>
          ) : (
            <ul className="divide-y divide-cream/8 px-1 py-1 sm:px-1.5 sm:py-1.5">
              {results.map((item, index) => {
                const active = index === activeIndex;
                const Icon = item.type === "destination" ? MapPin : Package;
                return (
                  <li key={item.id} role="presentation">
                    <Link
                      id={`${listId}-option-${index}`}
                      data-search-index={index}
                      role="option"
                      aria-selected={active}
                      href={item.href}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors duration-200 sm:gap-3 sm:px-3 sm:py-2.5 ${
                        active ? "bg-cream/10" : "hover:bg-cream/6"
                      }`}
                    >
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-cream/12 sm:size-11">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                          <span className="truncate text-[0.8125rem] font-medium text-cream sm:text-sm">
                            {item.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cream/12 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-300/85 sm:px-2 sm:text-[10px]">
                            <Icon className="size-2.5" aria-hidden="true" />
                            {item.type === "destination" ? "Place" : "Package"}
                          </span>
                        </span>
                        {item.subtitle ? (
                          <span className="mt-0.5 block truncate text-[11px] text-cream/50 sm:text-xs">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
