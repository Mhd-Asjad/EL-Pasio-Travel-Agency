"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogoBadge, Wordmark } from "./brand-mark";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`relative z-40 -mr-2 grid size-11 place-items-center rounded-full text-cream lg:hidden ${focusRing}`}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open
        ? createPortal(
            <div
              id="mobile-menu"
              className="fixed inset-0 z-40 flex min-h-[100dvh] flex-col justify-between bg-navy-950/96 px-5 pb-10 pt-28 backdrop-blur-md lg:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`border-b border-cream/10 py-4 font-display text-4xl italic text-cream ${focusRing}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-400 px-6 text-sm font-semibold tracking-wide text-navy-950 ${focusRing}`}
              >
                <PhoneIcon className="size-4" />
                Call {CONTACT.phoneDisplay}
              </a>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
