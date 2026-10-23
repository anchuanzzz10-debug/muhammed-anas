"use client";

import { motion, type Variants } from "framer-motion";
import type { MouseEvent } from "react";
import { services, skills, sectionIntros, type Service } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

const numberOf = (service: Service) => String(services.indexOf(service) + 1).padStart(2, "0");

/* ----------------------------- Featured visuals ---------------------------- */

const line: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease } },
};

const CODE_LINES = [
  { indent: 0, parts: ["w-10 bg-pink/80", "w-16 bg-fg/30", "w-8 bg-cerulean/80"] },
  { indent: 1, parts: ["w-14 bg-cerulean/80", "w-20 bg-fg/20"] },
  { indent: 2, parts: ["w-8 bg-pink/70", "w-24 bg-fg/25", "w-6 bg-cerulean/70"] },
  { indent: 2, parts: ["w-16 bg-fg/20", "w-10 bg-pink/60"] },
  { indent: 1, parts: ["w-6 bg-fg/30"] },
  { indent: 1, parts: ["w-12 bg-cerulean/80", "w-28 bg-fg/20"] },
  { indent: 0, parts: ["w-4 bg-fg/30"] },
];

/** Code editor whose lines "type" in when scrolled into view. */
function CodeVisual() {
  return (
    <div aria-hidden className="relative h-full overflow-hidden rounded-2xl border border-line bg-ink/95 text-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-pink/80" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-cerulean/80" />
        <span className="ml-3 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50">app.ts</span>
      </div>
      <motion.div
        className="flex flex-col gap-2.5 p-4 sm:p-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
      >
        {CODE_LINES.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-right font-mono text-[10px] text-white/25">{i + 1}</span>
            <span style={{ width: `${l.indent * 1.25}rem` }} className="shrink-0" />
            {l.parts.map((cls, j) => (
              <motion.span key={j} variants={line} className={cn("h-2 origin-left rounded-full", cls)} />
            ))}
            {i === CODE_LINES.length - 1 ? (
              <motion.span
                className="h-3.5 w-[2px] bg-white"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ) : null}
          </div>
        ))}
      </motion.div>
      <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-cerulean/30 blur-3xl" />
    </div>
  );
}

const block: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
};

/** Browser window whose layout assembles itself, with a cursor clicking the CTA. */
function WebVisual() {
  return (
    <div aria-hidden className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-pink/80" />
        <span className="size-2.5 rounded-full bg-fg/15" />
        <span className="size-2.5 rounded-full bg-cerulean/80" />
        <span className="mx-auto h-4 w-1/2 rounded-full bg-bg/80" />
      </div>
      <motion.div
        className="relative flex flex-col gap-3 p-4 sm:p-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
      >
        <motion.div variants={block} className="flex items-center justify-between">
          <span className="h-2.5 w-14 rounded-full bg-fg/25" />
          <span className="flex gap-2">
            <span className="h-2 w-6 rounded-full bg-fg/15" />
            <span className="h-2 w-6 rounded-full bg-fg/15" />
            <span className="h-2 w-6 rounded-full bg-fg/15" />
          </span>
        </motion.div>
        <motion.div
          variants={block}
          className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cerulean/80 to-pink/80 p-4"
        >
          <span className="h-3 w-3/5 rounded-full bg-white/90" />
          <span className="h-2 w-2/5 rounded-full bg-white/60" />
          <span className="relative mt-2 h-6 w-20 rounded-full bg-white">
            <motion.span
              className="absolute inset-0 rounded-full bg-white"
              animate={{ scale: [1, 1, 1.35, 1], opacity: [0, 0, 0.5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.55, 0.7, 1] }}
            />
          </span>
        </motion.div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((n) => (
            <motion.span key={n} variants={block} className="h-10 rounded-lg border border-line bg-surface sm:h-12" />
          ))}
        </div>
        <motion.span
          className="absolute text-fg drop-shadow"
          animate={{ left: ["78%", "24%", "24%", "78%"], top: ["88%", "64%", "64%", "88%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 0.75, 1] }}
        >
          <Icon name="cursor" className="size-5 fill-bg" />
        </motion.span>
      </motion.div>
    </div>
  );
}

const VISUALS: Record<string, () => React.JSX.Element> = { software: CodeVisual, web: WebVisual };

/* --------------------------------- Cards ---------------------------------- */

function FeaturedCard({ service }: { service: Service }) {
  const tools = skills.find((s) => s.serviceId === service.id)?.tools ?? [];
  const Visual = VISUALS[service.id];

  return (
    <article
      onMouseMove={handleSpotlight}
      className="border-spin spotlight group relative flex h-full flex-col gap-8 overflow-hidden rounded-[2rem] p-5 transition-transform duration-500 hover:-translate-y-1.5 sm:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br from-cerulean/25 to-pink/25 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
      />
      {Visual ? (
        <div className="relative h-60 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02] sm:h-64">
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
          <motion.span
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-fg text-bg"
            whileHover={{ rotate: -8, scale: 1.08 }}
          >
            <Icon name={service.icon} className="size-5" />
          </motion.span>
          {service.title}
        </h3>
        {service.description ? (
          <p className="text-pretty text-base leading-relaxed text-muted sm:text-[17px]">{service.description}</p>
        ) : null}
        {tools.length ? (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {tools.map((tool, i) => (
              <motion.li
                key={tool}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent"
              >
                {tool}
              </motion.li>
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

  return (
    <Section id="services" index={1} title="Services" description={sectionIntros.services}>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
        {featured.map((service, i) => (
          <motion.li
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
            className={cn("sm:col-span-2", featured.length > 1 ? "lg:col-span-3" : "lg:col-span-6")}
          >
            <FeaturedCard service={service} />
          </motion.li>
        ))}
        {regular.map((service, i) => (
          <motion.li
            key={service.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
            className={cn("group", spanFor(i, regular.length))}
          >
            <ServiceCard service={service} />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
