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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.li
            key={service.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <article
              onMouseMove={handleSpotlight}
              className="spotlight group relative flex h-full min-h-56 flex-col justify-between gap-10 overflow-hidden rounded-3xl border border-line bg-surface/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-bg text-accent ring-1 ring-line transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white group-hover:ring-transparent">
                  <Icon name={service.icon} className="size-6" />
                </span>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                {service.description ? <p className="text-pretty text-muted">{service.description}</p> : null}
              </div>
            </article>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
