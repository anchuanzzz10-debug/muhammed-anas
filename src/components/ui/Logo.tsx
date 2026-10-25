import { useId } from "react";
import { cn } from "@/lib/cn";

/** Monogram geometry on a 40×40 grid; `src/app/icon.svg` and the share image draw the same strokes. */
export const monogram = {
  // One stroke draws the M; its last peak doubles as the A. Legs run past the baseline and are clipped flat.
  stroke: "M6.3 33 13.5 13 20 26 26.5 13 33.7 33",
  crossbar: "M21.3 23.5h9",
  baseline: 31,
};

/** "MA" ligature: the M in currentColor, the A in the brand gradient. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const gradient = `${id}-gradient`;
  const clip = `${id}-clip`;

  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <defs>
        {/* Hard stop at the valley (x = 20) so the colour changes exactly where the A begins. */}
        <linearGradient id={gradient} x1="6" x2="34" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.5" stopColor="currentColor" />
          <stop offset="0.5" stopColor="#1A9BCB" />
          <stop offset="1" stopColor="#FF2D95" />
        </linearGradient>
        <clipPath id={clip}>
          <rect width="40" height={monogram.baseline} />
        </clipPath>
      </defs>
      <g stroke={`url(#${gradient})`} strokeWidth="2.75" strokeMiterlimit="4">
        <path d={monogram.stroke} clipPath={`url(#${clip})`} />
        <path d={monogram.crossbar} />
      </g>
    </svg>
  );
}

/** The monogram on an ink disc with a gradient ring. Size it with a `size-*` class. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 rounded-full bg-gradient-to-br from-cerulean to-pink p-[1.5px] transition-shadow duration-500 group-hover:shadow-[0_8px_24px_-8px_var(--color-pink)]",
        className,
      )}
    >
      <span className="grid place-items-center rounded-full bg-ink text-white">
        <LogoMark className="size-[78%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110" />
      </span>
    </span>
  );
}
