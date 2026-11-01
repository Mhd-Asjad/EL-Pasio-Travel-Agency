import Image from "next/image";

/**
 * Brand logo on a cream disc. The logo's navy lettering and mountains
 * would disappear on dark backgrounds, so it always sits on cream.
 */
export function LogoBadge({
  className = "",
  sizes = "64px",
  preload = false,
}: {
  className?: string;
  sizes?: string;
  preload?: boolean;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full bg-cream p-[3px] shadow-[0_6px_24px_-8px_oklch(0.2_0.055_258/0.6)] ${className}`}
    >
      <Image
        src="/images/logo.png"
        alt="EL PASEO emblem: compass rose above mountains and a winding trail, framed by a laurel wreath"
        width={1269}
        height={1240}
        sizes={sizes}
        preload={preload}
        className="size-full object-contain"
      />
    </span>
  );
}

export function Wordmark({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** "light" = for cream backgrounds. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span
        className={`text-[1.05rem] font-semibold tracking-[0.32em] ${light ? "text-navy-950" : "text-cream"}`}
      >
        EL PASEO
      </span>
      <span
        className={`mt-1.5 text-[0.56rem] font-medium uppercase tracking-[0.34em] ${light ? "text-gold-600" : "text-gold-300"}`}
      >
        Tours &amp; Travels
      </span>
    </span>
  );
}
