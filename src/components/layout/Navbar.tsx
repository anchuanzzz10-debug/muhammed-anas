"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { navItems, site, socials } from "@/content/site";
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
    menuRef.current?.querySelector<HTMLElement>("ul")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const focusable = [toggleButton, ...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
          Boolean,
        ) as HTMLElement[];
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
    <m.header
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
        <a
          href="#top"
          className="group flex items-center gap-2.5 rounded-full"
        >
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-fg font-mono text-xs font-semibold text-bg">
            <span className="absolute inset-0 bg-gradient-to-br from-cerulean to-pink opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative">{site.initials}</span>
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">{site.name}</span>
          <span className="sr-only">{site.name} — back to top</span>
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
                    <m.span
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
          <m.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-2 flex max-h-[calc(100dvh-5.5rem)] max-w-6xl origin-top flex-col overflow-hidden rounded-[1.75rem] border border-white/40 bg-bg/65 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)] ring-1 ring-black/5 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-bg/60 sm:max-h-[calc(100dvh-6rem)] lg:hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-cerulean/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-pink/20 blur-3xl"
            />

            <ul tabIndex={-1} className="relative flex flex-col overflow-y-auto px-6 pb-2 pt-3 outline-none">
              {navItems
                .filter((item) => item.id !== "contact")
                .map((item, i, arr) => {
                  const current = active === item.id;
                  return (
                    <m.li
                      key={item.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i + 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={current ? "true" : undefined}
                        className={cn(
                          "group flex items-center justify-between gap-4 border-b border-line py-4 transition-colors [@media(max-height:700px)]:py-2",
                          i === arr.length - 1 && "border-b-0",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[1.75rem] font-semibold leading-none tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1 [@media(max-height:700px)]:text-2xl",
                            current && "text-gradient",
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 group-hover:rotate-45 group-active:rotate-45",
                            current
                              ? "border-transparent bg-gradient-to-br from-cerulean to-pink text-white"
                              : "border-line text-muted group-hover:border-transparent group-hover:bg-fg group-hover:text-bg",
                          )}
                        >
                          <Icon name="arrowUpRight" className="size-4" />
                        </span>
                      </a>
                    </m.li>
                  );
                })}
            </ul>

            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="relative flex flex-col gap-3 border-t border-line p-4"
            >
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-full bg-fg py-2 pl-5 pr-2 text-base font-semibold text-bg"
              >
                Let&apos;s talk
                <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink text-white">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
              </a>
              {socials.length ? (
                <ul className="flex gap-2">
                  {socials.map((s) => (
                    <li key={s.href} className="flex-1">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-surface/50 text-sm font-medium backdrop-blur transition-colors active:bg-surface-2 dark:border-white/10"
                      >
                        <Icon name={s.icon} className="size-[18px] text-accent" />
                        <span className="hidden min-[370px]:inline">{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.header>
  );
}
