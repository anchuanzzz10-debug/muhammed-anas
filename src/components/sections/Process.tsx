"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { processSteps } from "@/content/site";
import { Section } from "@/components/ui/Section";

function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 50%"] });

  return (
        <ol ref={listRef} className="relative flex flex-col gap-6 pl-10 sm:pl-16">
          <span aria-hidden className="absolute bottom-2 left-[15px] top-2 w-px bg-line sm:left-[23px]" />
          <motion.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-gradient-to-b from-cerulean to-pink sm:left-[23px]"
          />
          {processSteps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                aria-hidden
                className="absolute -left-10 top-5 grid size-8 place-items-center rounded-full border border-line bg-bg font-mono text-xs sm:-left-16 sm:size-12 sm:text-sm"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="rounded-3xl border border-line bg-surface/50 p-6 transition-colors duration-300 hover:border-accent/40 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                {step.description ? <p className="mt-3 text-pretty text-muted">{step.description}</p> : null}
              </div>
            </motion.li>
          ))}
        </ol>
  );
}

export function Process() {
  return (
    <Section id="process" index={5} title="Process">
      {processSteps.length ? <Timeline /> : null}
    </Section>
  );
}
