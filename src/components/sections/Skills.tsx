"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { services, skills } from "@/content/site";
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
            className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-line bg-surface/50 px-5 py-3 text-sm font-medium sm:text-base"
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
  const hasTools = skills.some((s) => s.tools.length > 0);

  return (
    <Section id="skills" index={2} title="Skills">
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
                    <motion.span
                      layoutId="skill-tab"
                      className="absolute inset-0 -z-10 rounded-2xl border border-line bg-surface"
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
            className="rounded-3xl border border-line bg-surface/50 p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              <motion.ul
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap gap-2"
              >
                {current?.tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-line bg-bg px-4 py-2 text-sm transition hover:border-accent/50 hover:text-accent"
                  >
                    {tool}
                  </li>
                ))}
              </motion.ul>
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
