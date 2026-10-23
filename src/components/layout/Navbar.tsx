"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const top = document.getElementById("top");
    const onScroll = () => {
      if (top && window.scrollY < top.offsetHeight * 0.5) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

function useNavVisibility() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > 320 && y > prev + 4 ? true : y < prev - 4 ? false : hidden);
  });

  return { scrolled, hidden, reveal: () => setHidden(false) };
}

const sectionIds = navItems.map((n) => n.id);

export function Navbar() {
  const active = useActiveSection(sectionIds);
  const { scrolled, hidden, reveal } = useNavVisibility();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggleButton = toggleRef.current;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const focusable = [
          toggleButton,
          ...menuRef.current.querySelectorAll<HTMLElement>("a, button"),
        ].filter(Boolean) as HTMLElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      toggleButton?.focus();
    };
  }, [open]);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !open ? "-130%" : "0%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onFocusCapture={reveal}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pl-2 pr-2 transition-all duration-500 sm:h-16 sm:pl-3",
          scrolled || open
            ? "border-line bg-bg/70 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="group flex items-center gap-2.5 rounded-full" aria-label={`${site.name} — back to top`}>
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-fg font-mono text-xs font-semibold text-bg">
            <span className="absolute inset-0 bg-gradient-to-br from-cerulean to-pink opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative">{site.initials}</span>
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">{site.name}</span>
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
          {navItems
            .filter((item) => item.id !== "contact")
            .map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                    active === item.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2 ring-1 ring-line"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  {item.label}
                </a>
              </li>
            ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="group hidden items-center gap-1.5 overflow-hidden rounded-full bg-fg py-2.5 pl-4 pr-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Contact
            <span className="grid size-5 place-items-center rounded-full bg-bg/15 transition-transform duration-300 group-hover:rotate-45">
              <Icon name="arrowUpRight" className="size-3.5" />
            </span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface/60 lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="size-[18px]" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl overflow-y-auto rounded-3xl border border-line bg-bg/90 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col px-5 py-3 sm:px-6">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between border-b border-line py-4 text-[1.75rem] font-semibold tracking-tight transition-colors",
                      active === item.id ? "text-accent" : "hover:text-accent",
                    )}
                  >
                    {item.label}
                    <Icon name="arrowRight" className="size-5 opacity-50" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
