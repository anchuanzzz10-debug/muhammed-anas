"use client";

import { Icon } from "./Icon";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage may be unavailable (private mode); the theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative grid size-10 place-items-center rounded-full border border-line bg-surface/60 text-fg transition hover:border-accent/50 hover:text-accent"
    >
      <Icon name="moon" className="size-[18px] dark:hidden" />
      <Icon name="sun" className="hidden size-[18px] dark:block" />
    </button>
  );
}
