"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Fragment, useMemo, useRef } from "react";
import { SPRING, useTravel } from "./motion";

export type Segment = {
  text: string;
  /** Styles this piece as the italic gold accent (the brand motto). */
  accent?: boolean;
};

type Part = { text: string; accent?: boolean };

/** Splits segments into words. Pieces with no space between them (a quote
 * mark touching the motto) stay together in one word so they never wrap apart. */
function toWords(segments: Segment[]): Part[][] {
  const words: Part[][] = [];
  let current: Part[] | null = null;
  for (const seg of segments) {
    for (const tok of seg.text.split(/(\s+)/)) {
      if (tok === "") continue;
      if (/^\s+$/.test(tok)) {
        current = null;
        continue;
      }
      if (!current) {
        current = [];
        words.push(current);
      }
      current.push({ text: tok, accent: seg.accent });
    }
  }
  return words;
}

/**
 * Paragraph split into words that light up one by one as you scroll
 * (scroll-linked, so it reverses on the way back up) and lift + turn gold
 * when hovered. The copy itself is unchanged; screen readers read it as
 * normal text.
 */
export function SplitParagraph({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const travel = useTravel();
  const words = useMemo(() => toWords(segments), [segments]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.5"],
  });
  const progress = useSpring(scrollYProgress, SPRING);

  return (
    <p ref={ref} className={className}>
      {words.map((parts, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <Word
            parts={parts}
            progress={progress}
            travel={travel}
            start={i / words.length}
            end={Math.min(1, (i + 4) / words.length)}
          />
        </Fragment>
      ))}
    </p>
  );
}

function Word({
  parts,
  progress,
  travel,
  start,
  end,
}: {
  parts: Part[];
  progress: MotionValue<number>;
  travel: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(
    [progress, travel] as MotionValue<number>[],
    ([p, t]: number[]) => {
      if (t === 0) return 1;
      const k = Math.min(1, Math.max(0, (p - start) / (end - start || 1)));
      return 0.18 + 0.82 * k;
    },
  );

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block cursor-default transition-[transform,color] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.06] hover:text-gold-300"
    >
      {parts.map((part, i) =>
        part.accent ? (
          <span
            key={i}
            className="font-display text-[1.14em] font-normal italic leading-[0] text-gold-300"
          >
            {part.text}
          </span>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </motion.span>
  );
}
