"use client";

import { m } from "framer-motion";
import type { MouseEvent } from "react";
import { services, skills, sectionIntros, type Service } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { CodeVisual, MarketingVisual, SeoVisual, WebVisual } from "./ServiceVisuals";

const ease = [0.22, 1, 0.36, 1] as const;

function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

const numberOf = (service: Service) => String(services.indexOf(service) + 1).padStart(2, "0");

const VISUALS: Record<string, () => React.JSX.Element> = {
  strategy: MarketingVisual,
  software: CodeVisual,
  web: WebVisual,
  seo: SeoVisual,
};

/* --------------------------------- Cards ---------------------------------- */

function FeaturedCard({ service, wide = false }: { service: Service; wide?: boolean }) {
  const tools = (skills.find((s) => s.serviceId === service.id)?.tools ?? []).filter(
    (t) => !service.highlights?.includes(t),
  );
  const Visual = VISUALS[service.id];

  return (
    <article
      onMouseMove={handleSpotlight}
      className={cn(
        "border-spin spotlight group relative flex h-full flex-col gap-8 overflow-hidden rounded-[2rem] p-5 transition-transform duration-500 hover:-translate-y-1.5 sm:p-7",
        wide && "lg:flex-row lg:items-stretch lg:gap-10 lg:p-8",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-cerulean/25 to-pink/25 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
      />
      {Visual ? (
        <div
          className={cn(
            "relative h-64 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02] sm:h-72",
            wide && "lg:h-auto lg:min-h-[22rem] lg:w-[52%] lg:shrink-0",
          )}
        >
          <Visual />
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cerulean to-pink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
            <Icon name="spark" className="size-3.5" />
            Featured
          </span>
          <span className="font-mono text-xs text-muted">{numberOf(service)}</span>
        </div>
        <h3 className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          <m.span
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-fg text-bg"
            whileHover={{ rotate: -8, scale: 1.08 }}
          >
            <Icon name={service.icon} className="size-5" />
          </m.span>
          {service.title}
        </h3>
        {service.description ? (
          <p className="text-pretty text-base leading-relaxed text-muted sm:text-[17px]">{service.description}</p>
        ) : null}
        {service.highlights?.length ? (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {service.highlights.map((h, i) => (
              <m.li
                key={h}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease }}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2/70 p-3 text-sm font-semibold"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink text-white">
                  <Icon name="check" className="size-3.5" />
                </span>
                {h}
              </m.li>
            ))}
          </ul>
        ) : null}
        {tools.length ? (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {tools.map((tool, i) => (
              <m.li
                key={tool}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent"
              >
                {tool}
              </m.li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      onMouseMove={handleSpotlight}
      className="spotlight ring-gradient relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-6 transition-transform duration-500 group-hover:-translate-y-1.5 sm:p-8"
    >
      <Icon
        name={service.icon}
        className="pointer-events-none absolute -bottom-8 -right-8 size-44 text-fg/[0.03] transition-all duration-700 group-hover:-rotate-12 group-hover:text-accent/[0.08]"
      />
      <div className="relative flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface-2 text-accent transition-all duration-500 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white group-hover:shadow-[0_10px_30px_-10px_var(--color-pink)]">
          <Icon name={service.icon} className="size-[22px]" />
        </span>
        <span className="font-mono text-xs text-muted">{numberOf(service)}</span>
      </div>
      <div className="relative mt-auto flex flex-col gap-3 pt-12">
        <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight sm:text-[1.35rem]">
          {service.title}
        </h3>
        {service.description ? (
          <p className="text-pretty text-[15px] leading-relaxed text-muted">{service.description}</p>
        ) : null}
      </div>
    </article>
  );
}

/** Spans for the regular cards on a 6-column desktop / 2-column tablet grid. */
function spanFor(i: number, total: number) {
  const r = total % 3;
  const fromEnd = total - i;
  const lg = r === 2 && fromEnd <= 2 ? "lg:col-span-3" : r === 1 && fromEnd === 1 ? "lg:col-span-6" : "lg:col-span-2";
  const sm = total % 2 === 1 && fromEnd === 1 ? "sm:col-span-2" : "";
  return cn(sm, lg);
}

export function Services() {
  const featured = services.filter((s) => s.featured);
  const regular = services.filter((s) => !s.featured);
  // An odd featured card out (or a single one) spans the full width with a side-by-side layout.
  const isWide = (i: number) => featured.length % 2 === 1 && i === featured.length - 1;

  return (
    <Section id="services" index={1} title="Services" description={sectionIntros.services}>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
        {featured.map((service, i) => (
          <m.li
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
            className={cn("sm:col-span-2", isWide(i) ? "lg:col-span-6" : "lg:col-span-3")}
          >
            <FeaturedCard service={service} wide={isWide(i)} />
          </m.li>
        ))}
        {regular.map((service, i) => (
          <m.li
            key={service.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
            className={cn("group", spanFor(i, regular.length))}
          >
            <ServiceCard service={service} />
          </m.li>
        ))}
      </ul>
    </Section>
  );
}
