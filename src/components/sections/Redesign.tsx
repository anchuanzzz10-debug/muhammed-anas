"use client";

import {
  animate,
  m,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { sectionIntros } from "@/content/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

const CHANGES: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: "spark", title: "Design", text: "A clean, modern look that builds trust at first glance." },
  { icon: "chart", title: "Speed", text: "Optimized code and assets so pages load fast on every device." },
  {
    icon: "target",
    title: "Conversion",
    text: "Clear structure and calls to action that turn visitors into customers.",
  },
];

/** A deliberately dated, cluttered website. */
function BeforeSite() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#ece8de] font-[Times_New_Roman,serif] text-[#222]">
      <div className="flex items-center justify-between border-b-4 border-double border-[#8a7f6a] bg-[#d9d2c0] px-3 py-2 sm:px-5">
        <span className="text-sm font-bold text-[#1a1aa6] sm:text-lg">My Business Website</span>
        <span className="hidden gap-3 text-[11px] text-[#1a1aa6] underline sm:flex sm:text-xs">
          <span>Home</span>
          <span>About Us</span>
          <span>Products</span>
          <span>Contact</span>
        </span>
      </div>
      <div className="overflow-hidden whitespace-nowrap bg-[#ffef5a] py-1 text-[10px] font-bold text-[#c00] sm:text-xs">
        <span className="anim-ticker inline-block">
          *** WELCOME TO OUR WEBSITE!!! *** BEST PRICES *** CALL NOW *** SITE UNDER CONSTRUCTION ***
        </span>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-3 p-3 sm:grid-cols-[1fr_1.4fr] sm:gap-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold leading-tight text-[#7a1f1f] sm:text-3xl">Welcome!!</span>
          <span className="text-[10px] leading-snug sm:text-xs">
            We are a company that does many things. Please browse our website for more information about our services
            and products. Thank you for visiting.
          </span>
          <span className="mt-1 w-fit border-2 border-outset border-[#999] bg-[#ddd] px-2 py-0.5 text-[10px] sm:text-xs">
            Click Here
          </span>
          <span className="mt-auto flex items-center gap-2 text-[10px] text-[#666]">
            <span className="size-3 animate-spin rounded-full border-2 border-[#999] border-t-transparent" />
            Loading…
          </span>
        </div>
        <div className="grid grid-cols-3 content-start gap-1.5 sm:max-w-[85%]">
          {["#b9a98b", "#9fb0a3", "#c7a6a6", "#a7a3c2", "#c5c08f", "#9fb7c2"].map((c, i) => (
            <span
              key={c}
              className="flex aspect-square items-end p-1 text-[8px] text-white/80"
              style={{ background: c, transform: `rotate(${(i % 3) - 1}deg)` }}
            >
              img{i + 1}.jpg
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-[#b5ab95] bg-[#d9d2c0] px-3 py-1 text-center text-[9px] text-[#555]">
        Best viewed in 800×600 · Visitors: 000123
      </div>
    </div>
  );
}

/** The same site, redesigned. */
function AfterSite() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-ink text-white">
      <div className="absolute -left-20 -top-24 size-80 rounded-full bg-cerulean/45 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 size-80 rounded-full bg-pink/40 blur-3xl" />
      <div className="bg-grid absolute inset-0 opacity-25" />

      <div className="relative flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="font-serif text-lg italic sm:text-xl">Brand.</span>
        <span className="hidden gap-5 text-xs text-white/60 sm:flex">
          <span>Shop</span>
          <span>About</span>
          <span>Journal</span>
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-ink sm:text-xs">Contact</span>
      </div>

      <div className="relative grid flex-1 grid-cols-1 items-center gap-4 px-4 pb-4 sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-3 sm:order-2 sm:pl-6">
          <span className="w-fit rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
            New collection
          </span>
          <span className="text-2xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Made to <span className="font-serif font-normal italic text-gradient">stand out.</span>
          </span>
          <span className="max-w-xs text-[11px] leading-relaxed text-white/60 sm:text-sm">
            Fast, responsive and designed around your customers.
          </span>
          <span className="flex gap-2">
            <span className="rounded-full bg-gradient-to-r from-cerulean to-pink px-3.5 py-1.5 text-[10px] font-semibold sm:text-xs">
              Shop now
            </span>
            <span className="rounded-full border border-white/20 px-3.5 py-1.5 text-[10px] sm:text-xs">Learn more</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:order-1 sm:gap-3">
          {[
            "from-cerulean to-cerulean/40",
            "from-pink to-pink/40",
            "from-pink/70 to-cerulean/70",
            "from-cerulean/70 to-ink",
          ].map((g, i) => (
            <span
              key={g}
              className={`relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br p-2 ${g} ${
                i >= 2 ? "hidden sm:flex" : ""
              }`}
            >
              <span className="absolute inset-[25%] rounded-full border border-white/40" />
              <span className="relative h-1.5 w-2/3 rounded-full bg-white/80" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Comparison() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const pos = useMotionValue(50);
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);

  useMotionValueEvent(pos, "change", (v) => setValue(Math.round(v)));
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(pos, (v) => `${v}%`);

  // Hint the interaction once when it scrolls into view.
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(pos, [50, 82, 18, 50], { duration: 2.6, ease: "easeInOut", delay: 0.4 });
    return () => controls.stop();
  }, [inView, reduce, pos]);

  const setFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        pos.stop();
        setFromPointer(e);
      }}
      onPointerMove={(e) => dragging && setFromPointer(e)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className="group relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[1.75rem] border border-line shadow-[0_50px_120px_-60px_var(--color-cerulean)] sm:aspect-[16/10]"
    >
      <AfterSite />
      <m.div className="absolute inset-0" style={{ clipPath: clip }}>
        <BeforeSite />
      </m.div>

      {/* Labels */}
      <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink backdrop-blur">
        After
      </span>

      {/* Handle */}
      <m.div className="pointer-events-none absolute inset-y-0 w-0" style={{ left }}>
        <span className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
        <span className="absolute left-0 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-2xl ring-4 ring-white/30 transition-transform group-active:scale-90 group-has-[:focus-visible]:ring-accent">
          <span className="flex items-center">
            <Icon name="chevronLeft" className="size-4" />
            <Icon name="chevronRight" className="size-4" />
          </span>
        </span>
      </m.div>

      {/* Keyboard / screen reader control */}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => {
          pos.stop();
          pos.set(Number(e.target.value));
        }}
        aria-label="Compare before and after redesign"
        className="sr-only"
      />
    </div>
  );
}

export function Redesign() {
  return (
    <Section id="redesign" index={4} title="Before & after" description={sectionIntros.redesign}>
      <Reveal>
        <Comparison />
      </Reveal>

      <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
        {CHANGES.map((c, i) => (
          <m.li
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
            className="ring-gradient group relative flex items-start gap-4 rounded-2xl border border-line bg-surface p-5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-accent transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white">
              <Icon name={c.icon} className="size-5" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-semibold tracking-tight">{c.title}</span>
              <span className="text-pretty text-sm leading-relaxed text-muted">{c.text}</span>
            </span>
          </m.li>
        ))}
      </ul>
    </Section>
  );
}
