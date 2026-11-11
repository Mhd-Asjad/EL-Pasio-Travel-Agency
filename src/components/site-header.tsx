"use client";

import { useEffect, useRef, useState } from "react";
import { LogoBadge, Wordmark } from "./brand-mark";
import { MenuIcon, PhoneIcon } from "./icons";
import { focusRing } from "./ui";
import { CONTACT } from "@/lib/contact";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Packages", href: "/#packages" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <a
          href="/"
          aria-label="EL PASEO Tours & Travels, home"
          className={`flex items-center gap-3 ${focusRing}`}
        >
          <LogoBadge className="size-12 md:size-14" sizes="56px" preload />
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group relative py-2 text-[0.8rem] font-medium tracking-[0.06em] text-cream/90 transition-colors hover:text-cream ${focusRing}`}
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-spring group-hover:scale-x-100" />
            </a>
          ))}
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className={`ml-2 inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 py-2.5 text-[0.8rem] font-medium tracking-[0.04em] text-cream backdrop-blur-sm transition-colors hover:border-gold-400 hover:text-gold-300 ${focusRing}`}
          >
            <PhoneIcon className="size-4" />
            {CONTACT.phoneDisplay}
          </a>
        </nav>

        <div ref={menuRef} className="relative z-40 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`-mr-2 grid size-11 place-items-center rounded-full text-cream ${focusRing}`}
          >
            <MenuIcon />
          </button>

          {open ? (
            <div
              id="mobile-menu"
              role="dialog"
              aria-label="Menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-[min(15.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-cream/20 bg-cream/[0.08] shadow-[0_18px_50px_-18px_oklch(0.2_0.055_258/0.7),inset_0_1px_0_oklch(0.975_0.012_88/0.18)] backdrop-blur-xl backdrop-saturate-150"
            >
              <nav aria-label="Mobile" className="flex flex-col p-2">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3.5 py-2.5 text-[0.8rem] font-medium tracking-[0.06em] text-cream/90 transition-colors hover:bg-cream/12 hover:text-cream ${focusRing}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="border-t border-cream/15 p-2">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  onClick={() => setOpen(false)}
                  className={`inline-flex w-full min-h-10 items-center justify-center gap-2 rounded-xl bg-gold-400/90 px-3 text-[0.75rem] font-semibold tracking-[0.04em] text-navy-950 shadow-[inset_0_1px_0_oklch(0.975_0.012_88/0.25)] backdrop-blur-sm ${focusRing}`}
                >
                  <PhoneIcon className="size-3.5" />
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
