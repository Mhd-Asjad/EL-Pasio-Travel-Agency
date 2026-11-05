import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

/**
 * Shared styling primitives. Every section pulls from here so that
 * type, colour and buttons stay identical across the page.
 */

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300";

/** Headline: light Montserrat, tight tracking. */
export const headlineClass =
  "font-light leading-[1.02] tracking-[-0.035em] text-cream text-balance [text-shadow:0_2px_40px_oklch(0.2_0.055_258/0.45)]";

/** The single italic serif accent word inside a headline. */
export const accentClass =
  "font-display text-[1.12em] font-normal italic tracking-[-0.02em] text-gold-300";

/** Body copy colour on navy. */
export const bodyClass = "text-cream/85";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center justify-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-gold-300 [text-shadow:0_1px_14px_oklch(0.2_0.055_258/0.9)] sm:tracking-[0.42em] md:text-xs ${className}`}
    >
      {children}
    </p>
  );
}

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-8 text-sm tracking-[0.04em] transition-[transform,background-color,border-color] duration-500 ease-spring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

export const focusRingLight =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-600";

type ButtonTone = "dark" | "light";
type ButtonVariant = "primary" | "ghost";

export function buttonClass({
  variant = "primary",
  tone = "dark",
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
} = {}) {
  const styles =
    tone === "light"
      ? variant === "primary"
        ? "bg-navy-950 font-semibold text-cream shadow-[0_12px_32px_-14px_oklch(0.2_0.055_258/0.7)] hover:bg-navy-700"
        : "border border-navy-950/30 bg-transparent font-medium text-navy-950 hover:border-navy-950 hover:bg-navy-950/5"
      : variant === "primary"
        ? "bg-gold-400 font-semibold text-navy-950 shadow-[0_12px_40px_-12px_oklch(0.73_0.125_80/0.7)] hover:bg-gold-300"
        : "border border-cream/55 bg-cream/5 font-medium text-cream backdrop-blur-sm hover:border-cream hover:bg-cream/15";
  const ring = tone === "light" ? focusRingLight : focusRing;
  return `${buttonBase} ${styles} ${ring}`;
}

export function Button({
  variant = "primary",
  tone = "dark",
  arrow = false,
  icon,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  arrow?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button className={`${buttonClass({ variant, tone })} ${className}`} {...props}>
      {icon}
      {children}
      {arrow && (
        <ArrowRightIcon className="size-4 transition-transform duration-500 ease-spring group-hover:translate-x-1" />
      )}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  tone = "dark",
  arrow = false,
  icon,
  external = false,
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  /** "light" is for cream backgrounds (footer). */
  tone?: ButtonTone;
  arrow?: boolean;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Opens in a new tab (WhatsApp, social pages, maps). */
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${buttonClass({ variant, tone })} ${className}`}
    >
      {icon}
      {children}
      {arrow && (
        <ArrowRightIcon className="size-4 transition-transform duration-500 ease-spring group-hover:translate-x-1" />
      )}
    </a>
  );
}
