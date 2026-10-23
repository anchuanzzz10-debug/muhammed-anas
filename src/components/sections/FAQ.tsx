"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { faqs, sectionIntros } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <Section id="faq" index={7} title="FAQ" description={sectionIntros.faq}>
      {faqs.length ? (
        <ul className="mx-auto flex max-w-3xl flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-a-${i}`;
            return (
              <li
                key={item.question}
                className={cn(
                  "rounded-2xl border bg-surface/50 transition-colors duration-300",
                  isOpen ? "border-accent/40" : "border-line hover:border-fg/20",
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-base font-medium sm:px-6 sm:text-lg"
                  >
                    {item.question}
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border border-line transition-all duration-300",
                        isOpen && "rotate-45 border-transparent bg-fg text-bg",
                      )}
                    >
                      <Icon name="plus" className="size-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-6 text-pretty leading-relaxed text-muted sm:px-6">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Section>
  );
}
