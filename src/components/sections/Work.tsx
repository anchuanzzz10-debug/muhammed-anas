"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
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

/** Browser-window preview shown when a project has no screenshot. */
function ProjectPreview({ project, domain }: { project: Project; domain?: string }) {
  return (
    <div aria-hidden className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-cerulean/15 via-transparent to-pink/15 transition-opacity duration-500 group-hover:opacity-70" />
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="absolute inset-x-4 top-4 flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 backdrop-blur">
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-pink/70" />
          <span className="size-2 rounded-full bg-fg/20" />
          <span className="size-2 rounded-full bg-cerulean/70" />
        </span>
        {domain ? <span className="truncate font-mono text-[11px] text-muted">{domain}</span> : null}
      </div>
      <div className="absolute inset-0 grid place-items-center pt-8">
        <span className="bg-gradient-to-br from-cerulean to-pink bg-clip-text text-6xl font-semibold tracking-tighter text-transparent transition-transform duration-500 group-hover:scale-110 sm:text-7xl">
          {initialsOf(project.title)}
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const category = services.find((s) => s.id === project.category);
  const domain = project.href ? domainOf(project.href) : undefined;
  const Wrapper = project.href ? "a" : "div";
  const wrapperProps = project.href ? { href: project.href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/50 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_50px_-25px_var(--color-cerulean)]"
    >
      {project.image ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <ProjectPreview project={project} domain={domain} />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            {category ? (
              <p className="font-mono text-xs uppercase tracking-wider text-accent">{category.title}</p>
            ) : null}
            <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
            {domain ? (
              <p className="truncate text-sm text-muted transition-colors group-hover:text-accent">{domain}</p>
            ) : null}
          </div>
          {project.href ? (
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-hover:rotate-45 group-hover:bg-fg group-hover:text-bg">
              <Icon name="arrowUpRight" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </span>
          ) : null}
        </div>
        {project.summary ? <p className="text-pretty text-muted">{project.summary}</p> : null}
        {project.tags?.length ? (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-bg px-3 py-1 text-xs text-muted ring-1 ring-line">
                {tag}
              </li>
            ))}
          </ul>
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
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}
                    {f.title}
                  </button>
                );
              })}
            </div>
          ) : null}

          <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      ) : null}
    </Section>
  );
}
