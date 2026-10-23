"use client";

import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import { services, sectionIntros } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export function Services() {
  return (
    <Section id="services" index={1} title="Services" description={sectionIntros.services}>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.li
            key={service.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
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
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
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
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
