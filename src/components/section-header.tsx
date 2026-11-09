import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  id,
  className = "",
}: Props) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      {eyebrow && (
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-gold-400 md:text-xs">
          {eyebrow}
        </p>
      )}

      <h2
        id={id}
        className="mt-3 text-[clamp(2rem,4.5vw,3.15rem)] font-light leading-[1.12] tracking-[-0.03em] text-cream"
      >
        {title}
      </h2>

      {/* Elegant Architectural Gold Underline */}
      <div
        aria-hidden="true"
        className="mx-auto mt-4 flex items-center justify-center gap-2"
      >
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/60" />
        <div className="size-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(242,207,120,0.6)]" />
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/60" />
      </div>

      {description && (
        <div className="mx-auto mt-4 max-w-[54ch] text-pretty text-[1rem] font-normal leading-[1.8] text-cream/70 md:text-[1.12rem]">
          {description}
        </div>
      )}
    </div>
  );
}
