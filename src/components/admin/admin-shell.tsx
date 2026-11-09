"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoBadge } from "@/components/brand-mark";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";

function BrandLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/admin"
      aria-label="EL PASEO Admin Panel, dashboard"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 ${focusRing}`}
    >
      <LogoBadge className="size-10 md:size-11" sizes="44px" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="truncate text-[0.9rem] font-semibold tracking-[0.28em] text-gold-400 md:text-[0.95rem]">
          EL PASEO
        </span>
        <span className="mt-1.5 text-[0.56rem] font-medium uppercase tracking-[0.28em] text-cream/45">
          Admin Panel
        </span>
      </span>
    </Link>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="border-b border-cream/10 px-5 py-5">
        <BrandLink onClick={onNavigate} />
      </div>
      <AdminNav onNavigate={onNavigate} />
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const close = () => setOpen(false);

  return (
    <div className="flex min-h-svh bg-navy-900 text-cream">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-cream/10 bg-navy-950 lg:flex">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-cream/10 bg-navy-950/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <BrandLink />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className={`grid size-11 place-items-center rounded-full border border-cream/15 bg-cream/5 text-cream ${focusRing}`}
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden" id="admin-mobile-nav">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
              onClick={close}
            />
            <aside className="absolute inset-y-0 left-0 flex w-[min(18.5rem,88vw)] flex-col border-r border-cream/10 bg-navy-950 shadow-[0_24px_60px_-20px_oklch(0.05_0.04_258/0.9)]">
              <div className="flex items-center justify-between border-b border-cream/10 px-4 py-3">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream/50">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className={`grid size-10 place-items-center rounded-full border border-cream/15 bg-cream/5 text-cream ${focusRing}`}
                >
                  <CloseIcon className="size-4" />
                </button>
              </div>
              <SidebarBody onNavigate={close} />
            </aside>
          </div>,
          document.body,
        )}
    </div>
  );
}
