"use client";

import { useEffect } from "react";

/**
 * Marks page sections that are scrolled out of view with `data-offscreen`, which
 * pauses their looping CSS animations (see globals.css). Purely a performance aid:
 * nothing changes for the visitor because paused content isn't visible.
 */
export function OffscreenPause() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("main > section, footer");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
        }
      },
      { rootMargin: "200px 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
