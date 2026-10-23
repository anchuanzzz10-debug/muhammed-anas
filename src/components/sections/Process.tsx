"use client";

import { m } from "framer-motion";
import { processSteps, sectionIntros } from "@/content/site";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

function Steps() {
  return (
    <ol className="flex flex-col">
      {processSteps.map((step, i) => (
        <m.li
          key={step.title}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="group relative grid grid-cols-[3.25rem_1fr] gap-x-4 pb-10 pt-6 sm:grid-cols-[5.5rem_1fr] sm:gap-x-8 sm:pb-12 lg:grid-cols-12 lg:gap-x-10"
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
          <m.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, delay: 0.15, ease }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-cerulean via-pink to-transparent"
          />
          <span
            aria-hidden
            className="font-serif text-5xl italic leading-[0.85] text-fg/20 transition-colors duration-500 group-hover:text-accent sm:text-7xl lg:col-span-2 lg:text-8xl"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-3 lg:col-span-10 lg:grid lg:grid-cols-10 lg:gap-10">
            <h3 className="text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl lg:col-span-4">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            {step.description ? (
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg lg:col-span-6">
                {step.description}
              </p>
            ) : null}
          </div>
        </m.li>
      ))}
    </ol>
  );
}

export function Process() {
  return (
    <Section id="process" index={5} title="Process" description={sectionIntros.process}>
      {processSteps.length ? <Steps /> : null}
    </Section>
  );
}
