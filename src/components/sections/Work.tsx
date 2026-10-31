"use client";

import {
  AnimatePresence,
  LayoutGroup,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useId, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  contact,
  privateProjects,
  projects,
  services,
  site,
  type PrivateProject,
  type Project,
  sectionIntros,
} from "@/content/site";
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

function LocationBadge({ location, className = "" }: { location: string; className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium ${className}`}
    >
      <span className="size-1.5 rounded-full bg-gradient-to-br from-cerulean to-pink" />
      {location}
    </span>
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
          <m.li
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
                {project.location ? <LocationBadge location={project.location} className="mt-1" /> : null}
              </span>
              <span className="col-span-1 flex justify-end">
                <span className="grid size-12 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white">
                  <Icon name="arrowUpRight" className="size-5" />
                </span>
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </m.li>
        );
      })}

      {/* Floating preview */}
      <m.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block"
      >
        <AnimatePresence>
          {active !== null ? (
            <m.div
              key="preview"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: reduce ? 0 : -4 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 4 }}
              transition={{ duration: 0.45, ease }}
              className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
            >
              <div className="relative h-[15rem] w-[20rem] xl:h-[17rem] xl:w-[23rem]">
                <AnimatePresence initial={false}>
                  <m.div
                    key={items[active].id}
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="absolute inset-0"
                  >
                    <ProjectArt project={items[active]} index={projects.indexOf(items[active])} className="size-full" />
                  </m.div>
                </AnimatePresence>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.div>
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
    <m.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto [contain:paint] px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:[contain:none] sm:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {items.map((project) => {
        const domain = project.href ? domainOf(project.href) : undefined;
        return (
          <m.li key={project.id} variants={card} className="w-[82%] shrink-0 snap-center sm:w-auto">
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
                  {project.location ? <LocationBadge location={project.location} className="mt-1.5" /> : null}
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 group-hover:rotate-45">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </div>
            </a>
          </m.li>
        );
      })}
    </m.ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Private client software: NDA-safe cards with a redacted app preview.      */
/* -------------------------------------------------------------------------- */

function askAbout(title: string) {
  const text = `Hi ${site.name.split(" ")[0]}, I'd like to know more about your ${title} project.`;
  return `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

/** A blurred, generic app window over the cover pattern: hints at software without showing any of it. */
function RedactedArt({ project, index }: { project: PrivateProject; index: number }) {
  const id = useId().replace(/:/g, "");
  const [from, to] = PALETTES[(index + 1) % PALETTES.length];

  return (
    <div aria-hidden className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-ink text-white md:aspect-[4/3] xl:aspect-[16/10]">
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
        <Pattern variant={(index + 2) % 5} id={id} />
      </svg>

      <div className="absolute inset-x-6 bottom-0 top-12 rounded-t-2xl border border-white/20 bg-white/10 p-3 blur-[2px]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-white/40" />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-[1fr_2.4fr] gap-3">
          <div className="flex flex-col gap-2">
            {[85, 60, 75, 50].map((w) => (
              <span key={w} className="h-2 rounded-full bg-white/30" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-7 rounded-lg bg-white/20" />
              ))}
            </div>
            <span className="h-12 rounded-lg bg-white/15" />
            <span className="h-2 w-3/4 rounded-full bg-white/25" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-2xl border border-white/30 bg-white/15 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Icon name={project.icon} className="size-7" />
        </span>
      </div>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 backdrop-blur">
          {project.status ? (
            <span className="size-1.5 animate-pulse rounded-full bg-pink" />
          ) : (
            <Icon name="lock" className="size-3" />
          )}
          {project.status ?? "Private"}
        </span>
      </div>
    </div>
  );
}

function PrivateProjects() {
  const software = services.find((s) => s.id === "software");

  return (
    <div className="mt-20 sm:mt-24 lg:mt-20">
      {/* On desktop the project index above already ends with a rule, so the header needs no top border. */}
      <div className="mb-8 flex flex-col gap-4 border-t border-line pt-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:border-t-0 lg:pt-0">
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            <Icon name="lock" className="size-3.5 text-accent" />
            Under NDA
          </span>
          <h3 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-none tracking-[-0.045em]">
            Private{" "}
            <span className="pr-[0.1em] font-serif font-normal italic tracking-[-0.02em] text-gradient">projects</span>
          </h3>
        </div>
        {sectionIntros.privateWork ? (
          <p className="max-w-md text-pretty leading-relaxed text-muted">{sectionIntros.privateWork}</p>
        ) : null}
      </div>

      <m.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto [contain:paint] px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 md:[contain:none] [&::-webkit-scrollbar]:hidden"
      >
        {privateProjects.map((project, i) => (
          <m.li key={project.id} variants={card} className="w-[82%] shrink-0 snap-center md:w-auto">
            <article className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-2 transition-transform duration-500 hover:-translate-y-1">
              <RedactedArt project={project} index={i} />
              <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-4">
                {software ? <span className="text-xs font-medium text-accent">{software.title}</span> : null}
                <h4 className="text-balance text-xl font-semibold leading-snug tracking-tight">{project.title}</h4>
                {contact.whatsapp ? (
                  <div className="mt-auto pt-3">
                    <a
                      href={askAbout(project.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-transparent hover:bg-fg hover:text-bg"
                    >
                      <Icon name="whatsapp" className="size-4" />
                      Ask about this project
                      <span className="sr-only">(opens WhatsApp)</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </article>
          </m.li>
        ))}
      </m.ul>
      <p
        aria-hidden
        className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:hidden"
      >
        <Icon name="arrowRight" className="size-3.5" />
        Swipe
      </p>
    </div>
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
                      <m.span
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

      {privateProjects.length ? <PrivateProjects /> : null}
    </Section>
  );
}
