"use client";

import { AnimatePresence, m } from "framer-motion";
import { useId, useState } from "react";
import { services, skills, sectionIntros } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...services, ...services];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className={cn("marquee flex shrink-0 gap-4 pr-4", reverse && "marquee-reverse")}>
        {items.map((s, i) => (
          <span
            key={`${s.id}-${i}`}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium sm:px-6 sm:py-3.5 sm:text-base"
          >
            <Icon name={s.icon} className="size-4 text-accent" />
            {s.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const [active, setActive] = useState(services[0].id);
  const baseId = useId();
  const current = skills.find((s) => s.serviceId === active);
  const activeService = services.find((s) => s.id === active);
  const hasTools = skills.some((s) => s.tools.length > 0);

  return (
    <Section id="skills" index={2} title="Skills" description={sectionIntros.skills}>
      <div aria-hidden className="-mx-4 flex flex-col gap-4 sm:-mx-6 lg:-mx-8">
        <Marquee />
        <Marquee reverse />
      </div>

      {hasTools ? (
        <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div role="tablist" aria-label="Skills" aria-orientation="vertical" className="flex flex-col gap-2">
            {services.map((s) => {
              const selected = s.id === active;
              return (
                <button
                  key={s.id}
                  id={`${baseId}-tab-${s.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(s.id)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    e.preventDefault();
                    const i = services.findIndex((x) => x.id === active);
                    const next = services[(i + (e.key === "ArrowDown" ? 1 : -1) + services.length) % services.length];
                    setActive(next.id);
                    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
                  }}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors sm:text-base",
                    selected ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {selected ? (
                    <m.span
                      layoutId="skill-tab"
                      className="absolute inset-0 -z-10 rounded-2xl border border-line bg-surface shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <Icon name={s.icon} className={cn("size-5", selected && "text-accent")} />
                  {s.title}
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            className="ring-gradient relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 sm:p-10"
          >
            <AnimatePresence mode="wait">
              <m.div
                key={active}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-8"
              >
                {activeService ? (
                  <div className="flex flex-col gap-4">
                    <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-cerulean to-pink text-white shadow-[0_15px_40px_-15px_var(--color-pink)]">
                      <Icon name={activeService.icon} className="size-7" />
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{activeService.title}</h3>
                    {activeService.description ? (
                      <p className="max-w-xl text-pretty leading-relaxed text-muted">{activeService.description}</p>
                    ) : null}
                  </div>
                ) : null}
                <ul className="flex flex-wrap gap-2">
                  {current?.tools.map((tool, i) => (
                    <m.li
                      key={tool}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.03 }}
                      className="rounded-full border border-line bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {tool}
                    </m.li>
                  ))}
                </ul>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      <ul className="sr-only">
        {services.map((s) => (
          <li key={s.id}>{s.title}</li>
        ))}
      </ul>
    </Section>
  );
}
