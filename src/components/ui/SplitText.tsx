"use client";

import { m, type Variants } from "framer-motion";

type SplitTextProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Word-by-word masked reveal. The in-view trigger sits on the wrapper because the
 * masked words themselves never intersect the viewport. Words stay real text nodes
 * so crawlers and screen readers read the heading normally.
 */
export function SplitText({ text, className, wordClassName, delay = 0, immediate = false }: SplitTextProps) {
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -60px 0px" } };

  return (
    <m.span
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <m.span className={`inline-block ${wordClassName ?? ""}`} variants={word}>
            {w}
            {i < words.length - 1 ? " " : null}
          </m.span>
        </span>
      ))}
    </m.span>
  );
}
