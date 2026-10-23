"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { testimonials } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const AUTOPLAY_MS = 7000;

function Carousel() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + count) % count, delta]),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, count, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  const t = testimonials[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="relative overflow-hidden rounded-3xl border border-line bg-surface/50 p-6 sm:p-12"
    >
      <Icon name="quote" className="absolute right-6 top-6 size-16 text-accent/15 sm:size-24" />

      <div className="relative min-h-64" aria-live={paused ? "polite" : "off"}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.figure
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            className="flex cursor-grab flex-col gap-8 active:cursor-grabbing"
          >
            <blockquote className="text-pretty text-xl font-medium leading-relaxed tracking-tight sm:text-3xl">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="flex items-center gap-4">
              {t.avatar ? (
                <Image src={t.avatar.src} alt={t.avatar.alt} width={48} height={48} className="size-12 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink font-semibold text-white">
                  {t.name.charAt(0)}
                </span>
              )}
              <span className="flex flex-col">
                <span className="font-semibold">{t.name}</span>
                {t.role || t.company ? (
                  <span className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                ) : null}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="mt-10 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {testimonials.map((item, i) => (
              <button
                key={item.name + i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className="grid h-6 place-items-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-gradient-to-r from-cerulean to-pink" : "w-1.5 bg-line hover:bg-muted",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid size-11 place-items-center rounded-full border border-line transition hover:border-accent/50 hover:text-accent"
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid size-11 place-items-center rounded-full bg-fg text-bg transition hover:-translate-y-0.5"
            >
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials" index={6} title="Testimonials">
      {testimonials.length ? <Carousel /> : null}
    </Section>
  );
}
