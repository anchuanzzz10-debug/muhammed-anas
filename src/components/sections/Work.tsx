"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useMemo, useState, type PointerEvent } from "react";
import { projects, services, type Project, sectionIntros } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const ALL = "all";

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

/** Bento spans: a 6-column grid on desktop, 2 columns on tablet. */
function spanFor(i: number, total: number) {
  const r = total % 3;
  const lg = r === 2 && i < 2 ? "lg:col-span-3" : r === 1 && i === 0 ? "lg:col-span-6" : "lg:col-span-2";
  const sm = total % 2 === 1 && i === 0 ? "sm:col-span-2" : "";
  return cn(sm, lg);
}

/** Stylized website mock-up shown when a project has no screenshot. */
function ProjectMock({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <div aria-hidden className="absolute inset-0 flex flex-col p-4 pt-3 sm:p-5 sm:pt-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-gradient-to-br from-cerulean to-pink" />
          <span className="h-1.5 w-12 rounded-full bg-fg/15" />
        </span>
        <span className="hidden gap-2 sm:flex">
          <span className="h-1.5 w-8 rounded-full bg-fg/10" />
          <span className="h-1.5 w-8 rounded-full bg-fg/10" />
          <span className="h-1.5 w-8 rounded-full bg-fg/10" />
        </span>
        <span className="h-4 w-12 rounded-full bg-fg/15" />
      </div>

      <div className={cn("flex flex-1 items-center gap-4", flip && "flex-row-reverse")}>
        <div className="flex flex-1 flex-col gap-2.5">
          <span className="self-start pr-1 font-serif text-5xl italic leading-none text-gradient sm:text-6xl">
            {initialsOf(project.title)}
          </span>
          <span className="h-2 w-4/5 rounded-full bg-fg/15" />
          <span className="h-2 w-3/5 rounded-full bg-fg/10" />
          <span className="mt-1 h-5 w-20 rounded-full bg-fg/80" />
        </div>
        <div
          className={cn(
            "relative aspect-square w-[38%] overflow-hidden rounded-2xl bg-gradient-to-br",
            flip ? "from-pink/40 to-cerulean/40" : "from-cerulean/40 to-pink/40",
          )}
        >
          <div className="absolute inset-[18%] rounded-full border border-white/40" />
          <div className="absolute inset-[34%] rounded-full bg-white/30 blur-md" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((n) => (
          <span key={n} className="h-8 rounded-lg border border-line bg-surface/70 sm:h-10" />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const reduce = useReducedMotion();
  const category = services.find((s) => s.id === project.category);
  const domain = project.href ? domainOf(project.href) : undefined;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 200, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const Wrapper = project.href ? motion.a : motion.div;
  const wrapperProps = project.href ? { href: project.href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper
      {...wrapperProps}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="ring-gradient group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-2 transition-shadow duration-500 hover:shadow-[0_30px_70px_-35px_var(--color-cerulean)]"
    >
      {/* Browser frame */}
      <div className="sheen relative overflow-hidden rounded-[1.35rem] border border-line bg-surface-2">
        <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-pink/70" />
            <span className="size-2.5 rounded-full bg-fg/15" />
            <span className="size-2.5 rounded-full bg-cerulean/70" />
          </span>
          {domain ? (
            <span className="mx-auto flex min-w-0 max-w-[75%] items-center gap-1.5 rounded-full bg-bg/70 px-3 py-1 font-mono text-[11px] text-muted">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="truncate">{domain}</span>
            </span>
          ) : null}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--color-cerulean)_18%,transparent),transparent_55%),radial-gradient(circle_at_90%_90%,color-mix(in_srgb,var(--color-pink)_16%,transparent),transparent_55%)]"
          />
          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
            {project.image ? (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                className="size-full object-cover object-top"
              />
            ) : (
              <ProjectMock project={project} index={index} />
            )}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-1 items-end justify-between gap-4 px-4 pb-4 pt-5 sm:px-5">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            {category ? <span className="text-accent"> · {category.title}</span> : null}
          </span>
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>
          {project.summary ? <p className="text-pretty text-sm leading-relaxed text-muted">{project.summary}</p> : null}
          {project.tags?.length ? (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {project.href ? (
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-line py-1.5 pl-4 pr-1.5 text-sm font-medium transition-all duration-500 group-hover:border-transparent group-hover:bg-fg group-hover:text-bg">
            <span className="hidden sm:inline">Visit</span>
            <span className="grid size-8 place-items-center rounded-full bg-fg text-bg transition-all duration-500 group-hover:rotate-45 group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white">
              <Icon name="arrowUpRight" className="size-4" />
            </span>
            <span className="sr-only">{project.title} (opens in a new tab)</span>
          </span>
        ) : null}
      </div>
    </Wrapper>
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

          <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={spanFor(i, visible.length)}
                >
                  <ProjectCard project={project} index={i} total={visible.length} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      ) : null}
    </Section>
  );
}
