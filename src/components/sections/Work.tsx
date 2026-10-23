"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useId, useMemo, useRef, useState, type PointerEvent } from "react";
import { projects, services, type Project, sectionIntros } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const ALL = "all";
const ease = [0.22, 1, 0.36, 1] as const;

function domainOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function initialsOf(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/* -------------------------------------------------------------------------- */
/*  Generative cover art — each project gets its own pattern and palette.     */
/* -------------------------------------------------------------------------- */

const PALETTES = [
  ["#007BA7", "#FF2D95"],
  ["#FF2D95", "#007BA7"],
  ["#0A0A0A", "#007BA7"],
  ["#007BA7", "#0A0A0A"],
  ["#FF2D95", "#0A0A0A"],
] as const;

function Pattern({ variant, id }: { variant: number; id: string }) {
  const stroke = "rgba(255,255,255,0.22)";
  switch (variant) {
    case 0: // offset rings
      return (
        <g fill="none" stroke={stroke}>
          {[40, 80, 120, 160, 200, 240].map((r) => (
            <circle key={r} cx="320" cy="60" r={r} />
          ))}
        </g>
      );
    case 1: // diagonal stripes
      return (
        <g stroke={stroke} strokeWidth="14">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={i * 50 - 200} y1="320" x2={i * 50 + 120} y2="-20" />
          ))}
        </g>
      );
    case 2: // dot matrix
      return (
        <g fill="rgba(255,255,255,0.3)">
          {Array.from({ length: 12 * 9 }, (_, i) => (
            <circle key={i} cx={20 + (i % 12) * 34} cy={20 + Math.floor(i / 12) * 34} r={(i % 5) + 1.5} />
          ))}
        </g>
      );
    case 3: // waves
      return (
        <g fill="none" stroke={stroke} strokeWidth="2">
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M-20 ${60 + i * 26} C 80 ${20 + i * 26}, 160 ${110 + i * 26}, 260 ${60 + i * 26} S 400 ${30 + i * 26}, 440 ${70 + i * 26}`}
            />
          ))}
        </g>
      );
    default: // orb + grid
      return (
        <g>
          <g stroke="rgba(255,255,255,0.12)">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
            ))}
          </g>
          <circle cx="290" cy="170" r="110" fill={`url(#${id}-orb)`} />
        </g>
      );
  }
}

function ProjectArt({ project, index, className }: { project: Project; index: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const [from, to] = PALETTES[index % PALETTES.length];
  const domain = project.href ? domainOf(project.href) : undefined;

  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden bg-ink", className)}>
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 1024px) 420px, 85vw"
          className="size-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className={cn("relative overflow-hidden bg-ink text-white", className)}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
          <radialGradient id={`${id}-orb`}>
            <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#${id}-bg)`} />
        <Pattern variant={index % 5} id={id} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 backdrop-blur">Live</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="font-serif text-7xl italic leading-[0.8] drop-shadow-lg">{initialsOf(project.title)}</span>
          {domain ? (
            <span className="truncate rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] backdrop-blur">
              {domain}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop: editorial index with a cursor-following preview.                 */
/* -------------------------------------------------------------------------- */

function ProjectIndex({ items }: { items: Project[] }) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const focusRow = (i: number, el: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;
    const lr = list.getBoundingClientRect();
    const rr = el.getBoundingClientRect();
    x.set(lr.width * 0.68);
    y.set(rr.top - lr.top + rr.height / 2);
    setActive(i);
  };

  return (
    <ul
      ref={listRef}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
      className="relative border-b border-line"
    >
      {items.map((project, i) => {
        const domain = project.href ? domainOf(project.href) : undefined;
        const category = services.find((s) => s.id === project.category);
        const dim = active !== null && active !== i;
        return (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease }}
            className="relative border-t border-line"
          >
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setActive(i)}
              onFocus={(e) => focusRow(i, e.currentTarget)}
              onBlur={() => setActive(null)}
              className={cn(
                "group relative grid grid-cols-12 items-center gap-6 py-8 transition-opacity duration-500 xl:py-10",
                dim ? "opacity-30" : "opacity-100",
              )}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cerulean via-pink to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
              <span className="col-span-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="col-span-7 flex items-baseline gap-4">
                <span className="text-[clamp(2.25rem,4.6vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-4">
                  <span className="group-hover:text-gradient">{project.title}</span>
                </span>
              </span>
              <span className="col-span-3 flex flex-col gap-1 text-sm">
                {category ? <span className="text-accent">{category.title}</span> : null}
                {domain ? <span className="font-mono text-muted">{domain}</span> : null}
              </span>
              <span className="col-span-1 flex justify-end">
                <span className="grid size-12 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white">
                  <Icon name="arrowUpRight" className="size-5" />
                </span>
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </motion.li>
        );
      })}

      {/* Floating preview */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block"
      >
        <AnimatePresence>
          {active !== null ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: reduce ? 0 : -4 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 4 }}
              transition={{ duration: 0.45, ease }}
              className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
            >
              <div className="relative h-[15rem] w-[20rem] xl:h-[17rem] xl:w-[23rem]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={items[active].id}
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="absolute inset-0"
                  >
                    <ProjectArt project={items[active]} index={projects.indexOf(items[active])} className="size-full" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile / tablet: swipeable cards.                                         */
/* -------------------------------------------------------------------------- */

const card: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

function ProjectCards({ items }: { items: Project[] }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto [contain:paint] px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:[contain:none] sm:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {items.map((project) => {
        const domain = project.href ? domainOf(project.href) : undefined;
        return (
          <motion.li key={project.id} variants={card} className="w-[82%] shrink-0 snap-center sm:w-auto">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-2 transition-transform duration-500 active:scale-[0.98]"
            >
              <ProjectArt
                project={project}
                index={projects.indexOf(project)}
                className="aspect-[4/3] rounded-[1.35rem]"
              />
              <div className="flex flex-1 items-center justify-between gap-3 px-3 pb-3 pt-4">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h3 className="truncate text-xl font-semibold tracking-tight">{project.title}</h3>
                  {domain ? <span className="truncate font-mono text-xs text-muted">{domain}</span> : null}
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 group-hover:rotate-45">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </div>
            </a>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export function Work() {
  const [filter, setFilter] = useState<string>(ALL);

  const filters = useMemo(
    () => [{ id: ALL, title: "All" }, ...services.filter((s) => projects.some((p) => p.category === s.id))],
    [],
  );
  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter);

  return (
    <Section id="work" index={3} title="Work" description={projects.length ? sectionIntros.work : undefined}>
      {projects.length ? (
        <LayoutGroup>
          {filters.length > 1 ? (
            <div
              role="group"
              aria-label="Filter projects"
              className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {filters.map((f) => {
                const selected = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                      selected ? "border-transparent text-bg" : "border-line text-muted hover:text-fg",
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="work-filter"
                        className="absolute inset-0 -z-10 rounded-full bg-fg"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {f.title}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div key={filter}>
            <div className="hidden lg:block">
              <ProjectIndex items={visible} />
            </div>
            <div className="lg:hidden">
              <ProjectCards items={visible} />
              <p
                aria-hidden
                className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:hidden"
              >
                <Icon name="arrowRight" className="size-3.5" />
                Swipe
              </p>
            </div>
          </div>
        </LayoutGroup>
      ) : null}
    </Section>
  );
}
