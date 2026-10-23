"use client";

import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const ease = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Custom Software — editor that types out real, highlighted code.           */
/* -------------------------------------------------------------------------- */

const k = "text-[#ff6bb5]"; // keyword
const f = "text-[#5cc8f0]"; // function
const s = "text-[#a5e3ff]"; // string
const p = "text-white/55"; // punctuation
const c = "text-white/35 italic"; // comment
const v = "text-white/90"; // identifier

const CODE: Array<Array<[string, string]>> = [
  [["// orders → WhatsApp → dashboard", c]],
  [
    ["import ", k],
    ["{ shopify, notify } ", v],
    ["from ", k],
    ['"@/lib"', s],
    [";", p],
  ],
  [],
  [
    ["export async function ", k],
    ["handleOrder", f],
    ["(id: ", p],
    ["string", k],
    [") {", p],
  ],
  [
    ["  const ", k],
    ["order ", v],
    ["= ", p],
    ["await ", k],
    ["shopify.", v],
    ["order", f],
    ["(id);", p],
  ],
  [
    ["  await ", k],
    ["notify.", v],
    ["whatsapp", f],
    ["(order.customer);", p],
  ],
  [
    ["  return ", k],
    ["dashboard.", v],
    ["sync", f],
    ["(order);", p],
  ],
  [["}", p]],
];

const typeLine: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: (len: number) => ({
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: Math.max(0.15, len * 0.018), ease: "linear" },
  }),
};

function Chip({ children, className, delay = 0 }: { children: React.ReactNode; className: string; delay?: number }) {
  return (
    <m.span
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease }}
      className={`absolute z-10 ${className}`}
    >
      <span
        style={{ animationDelay: `${delay}s` }}
        className="anim-chip flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white shadow-xl backdrop-blur-md"
      >
        {children}
      </span>
    </m.span>
  );
}

export function CodeVisual() {
  return (
    <div aria-hidden className="relative h-full overflow-hidden rounded-2xl bg-ink">
      <div className="absolute -left-16 -top-16 size-56 rounded-full bg-cerulean/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 size-56 rounded-full bg-pink/35 blur-3xl" />

      <div className="absolute inset-3 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0f14]/90 shadow-2xl backdrop-blur sm:inset-4">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2.5 rounded-full bg-pink/80" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-cerulean/80" />
          <span className="ml-3 rounded-md border border-white/10 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white">
            orders.ts
          </span>
          <span className="hidden px-2 py-0.5 font-mono text-[10px] text-white/40 sm:inline">dashboard.tsx</span>
        </div>

        <m.pre
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ show: { transition: { staggerChildren: 0.32, delayChildren: 0.3 } } }}
          className="flex-1 overflow-hidden px-3 py-3 font-mono text-[10.5px] leading-[1.75] sm:text-[12px]"
        >
          {CODE.map((tokens, i) => {
            const text = tokens.map(([t]) => t).join("");
            return (
              <div key={i} className="flex">
                <span className="w-6 shrink-0 select-none pr-3 text-right text-white/20">{i + 1}</span>
                <m.span custom={text.length} variants={typeLine} className="whitespace-pre">
                  {tokens.length
                    ? tokens.map(([t, cls], j) => (
                        <span key={j} className={cls}>
                          {t}
                        </span>
                      ))
                    : " "}
                  {i === CODE.length - 1 ? (
                    <span className="anim-blink ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-[#5cc8f0]" />
                  ) : null}
                </m.span>
              </div>
            );
          })}
        </m.pre>
      </div>

      <Chip className="right-5 top-11 sm:right-7" delay={2.6}>
        <span className="grid size-4 place-items-center rounded-full bg-emerald-400 text-black">
          <Icon name="check" className="size-3" />
        </span>
        Build passed
      </Chip>
      <Chip className="bottom-5 right-6 sm:bottom-7 sm:right-10" delay={3}>
        <span className="size-2 rounded-full bg-[#5cc8f0] shadow-[0_0_10px_#5cc8f0]" />
        API · 200 OK
      </Chip>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Web Development — a real-looking site on desktop + phone.                 */
/* -------------------------------------------------------------------------- */

const pop: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
};

function MiniSite({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#fbfbfc] text-ink">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="font-serif text-[13px] italic">Brand.</span>
        {compact ? (
          <Icon name="menu" className="size-3" />
        ) : (
          <span className="flex gap-2.5 text-[8px] font-medium text-ink/60">
            <span>Shop</span>
            <span>About</span>
            <span>Contact</span>
          </span>
        )}
      </div>
      <div className={compact ? "flex flex-col gap-1.5 px-3 pt-2" : "grid grid-cols-2 items-center gap-3 px-3 pt-1"}>
        <div className="flex flex-col gap-1.5">
          <span
            className={`font-semibold leading-[1.05] tracking-tight ${compact ? "text-[13px]" : "text-[15px] sm:text-[17px]"}`}
          >
            Made to <span className="font-serif font-normal italic text-[#007BA7]">stand out.</span>
          </span>
          <span className="text-[7.5px] leading-snug text-ink/55">Fast, responsive and built to convert.</span>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-cerulean to-pink px-2.5 py-1 text-[7.5px] font-semibold text-white">
            Get started
          </span>
        </div>
        {compact ? null : (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-cerulean to-pink">
            <div className="absolute inset-[22%] rounded-full border border-white/50" />
            <div className="absolute inset-[38%] rounded-full bg-white/40 blur-sm" />
          </div>
        )}
      </div>
      <div className={`mt-auto grid gap-1.5 p-3 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        {(compact ? [0, 1] : [0, 1, 2]).map((n) => (
          <div key={n} className="flex flex-col gap-1 rounded-md bg-white p-1 shadow-sm ring-1 ring-black/5">
            <span
              className={`aspect-[4/3] rounded ${
                [
                  "bg-gradient-to-br from-cerulean/70 to-cerulean/30",
                  "bg-gradient-to-br from-pink/70 to-pink/30",
                  "bg-gradient-to-br from-ink/80 to-cerulean/50",
                ][n]
              }`}
            />
            <span className="h-1 w-3/4 rounded-full bg-ink/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebVisual() {
  return (
    <m.div
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } }}
      className="relative h-full overflow-hidden rounded-2xl bg-ink"
    >
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-pink/35 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-cerulean/40 blur-3xl" />
      <div className="bg-grid absolute inset-0 opacity-20" />

      {/* Desktop browser */}
      <m.div
        variants={pop}
        className="absolute left-3 top-3 h-[86%] w-[80%] overflow-hidden rounded-xl border border-white/10 shadow-2xl sm:left-4 sm:top-4"
      >
        <div className="flex items-center gap-1.5 bg-[#16181d] px-2.5 py-1.5">
          <span className="size-2 rounded-full bg-pink/80" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-cerulean/80" />
          <span className="mx-auto flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 font-mono text-[8px] text-white/70">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            yourbrand.com
          </span>
        </div>
        <div className="relative h-[calc(100%-1.5rem)]">
          <MiniSite />
          {/* Translating a full-size layer by % of itself == moving by % of the parent, without layout work. */}
          <span className="anim-cursor-path pointer-events-none absolute inset-0 text-ink drop-shadow-md will-change-transform">
            <Icon name="cursor" className="size-4 fill-white" />
          </span>
        </div>
      </m.div>

      {/* Phone */}
      <m.div
        variants={pop}
        className="absolute bottom-3 right-3 h-[78%] w-[30%] overflow-hidden rounded-[1.1rem] border-[3px] border-[#22252c] bg-[#22252c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] sm:bottom-4 sm:right-4"
      >
        <div className="absolute left-1/2 top-1 z-10 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#22252c]" />
        <div className="h-full overflow-hidden rounded-[0.85rem]">
          <MiniSite compact />
        </div>
      </m.div>

      <Chip className="bottom-5 left-5 sm:bottom-6 sm:left-7" delay={1.4}>
        <Icon name="spark" className="size-3.5 text-[#ff6bb5]" />
        Responsive
      </Chip>
    </m.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SEO — a search result climbing to the top, with rising organic traffic.   */
/* -------------------------------------------------------------------------- */

const OTHERS = ["marketplace.com", "directory.net", "reviews.example"];
const OURS = "yourbrand.com";
const QUERY = "shopify store design";

function ResultRow({ domain, ours, top }: { domain: string; ours: boolean; top: boolean }) {
  return (
    <m.li
      layout
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={
        ours
          ? "relative z-10 flex items-center gap-3 rounded-xl bg-gradient-to-r from-cerulean to-pink p-[1.5px] shadow-[0_15px_40px_-15px_var(--color-pink)]"
          : "flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-2.5"
      }
    >
      <div className={ours ? "flex w-full items-center gap-3 rounded-[0.65rem] bg-[#12141a] p-2.5" : "contents"}>
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
            ours ? "bg-gradient-to-br from-cerulean to-pink text-white" : "bg-white/10 text-white/50"
          }`}
        >
          {domain.charAt(0).toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={`truncate font-mono text-[10px] ${ours ? "text-[#5cc8f0]" : "text-white/40"}`}>
            {domain}
          </span>
          <span className={`h-1.5 rounded-full ${ours ? "w-4/5 bg-white/80" : "w-3/5 bg-white/20"}`} />
        </span>
        {ours ? (
          <m.span
            key={top ? "top" : "climb"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              top ? "bg-emerald-400 text-black" : "bg-white/10 text-white"
            }`}
          >
            {top ? "#1" : <Icon name="arrowUp" className="size-3" />}
          </m.span>
        ) : null}
      </div>
    </m.li>
  );
}

export function SeoVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const visible = useInView(ref);
  const reduce = useReducedMotion();
  const [rank, setRank] = useState(3);

  useEffect(() => {
    if (!inView || !visible || reduce) return;
    let r = 3;
    const id = window.setInterval(() => {
      r = r === 0 ? 3 : r - 1;
      setRank(r);
    }, 1300);
    return () => window.clearInterval(id);
  }, [inView, visible, reduce]);

  const current = reduce ? 0 : rank;
  const rows = [...OTHERS];
  rows.splice(current, 0, OURS);

  return (
    <div ref={ref} aria-hidden className="relative h-full overflow-hidden rounded-2xl bg-ink text-white">
      <div className="absolute -left-16 -top-16 size-56 rounded-full bg-cerulean/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 size-56 rounded-full bg-pink/35 blur-3xl" />
      <div className="bg-grid absolute inset-0 opacity-20" />

      <div className="relative flex h-full flex-col gap-3 p-4 sm:p-5">
        {/* Search bar */}
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2.5 backdrop-blur">
          <Icon name="search" className="size-4 shrink-0 text-white/60" />
          <m.span
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={inView ? { clipPath: "inset(0 0% 0 0)" } : undefined}
            transition={{ duration: 1, ease: "linear", delay: 0.2 }}
            className="whitespace-nowrap text-[13px] text-white/90"
          >
            {QUERY}
          </m.span>
          <span className="anim-blink -ml-1.5 h-4 w-[1.5px] bg-[#5cc8f0]" />
        </div>

        {/* Results */}
        <ul className="flex w-full flex-col gap-2 sm:w-[62%] lg:w-[64%]">
          {rows.map((d) => (
            <ResultRow key={d} domain={d} ours={d === OURS} top={d === OURS && current === 0} />
          ))}
        </ul>
      </div>

      {/* Traffic chart */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, delay: 0.6, ease }}
        className="absolute bottom-4 right-4 hidden w-[34%] flex-col gap-2 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-md sm:flex sm:bottom-5 sm:right-5"
      >
        <span className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
          Organic traffic
          <Icon name="chart" className="size-3.5 text-emerald-400" />
        </span>
        <svg viewBox="0 0 120 60" className="h-16 w-full overflow-visible">
          <defs>
            <linearGradient id="seo-line" x1="0" x2="1">
              <stop offset="0" stopColor="#007BA7" />
              <stop offset="1" stopColor="#FF2D95" />
            </linearGradient>
            <linearGradient id="seo-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FF2D95" stopOpacity="0.35" />
              <stop offset="1" stopColor="#FF2D95" stopOpacity="0" />
            </linearGradient>
          </defs>
          <m.path
            d="M0 52 L20 48 L38 50 L56 38 L74 34 L92 20 L120 6 L120 60 L0 60 Z"
            fill="url(#seo-area)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ delay: 1.6, duration: 0.8 }}
          />
          <m.path
            d="M0 52 L20 48 L38 50 L56 38 L74 34 L92 20 L120 6"
            fill="none"
            stroke="url(#seo-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.4, delay: 0.8, ease }}
          />
          <m.circle
            cx="120"
            cy="6"
            r="3.5"
            fill="#FF2D95"
            initial={{ scale: 0 }}
            animate={inView ? { scale: [0, 1.4, 1] } : undefined}
            transition={{ delay: 2.1, duration: 0.5 }}
          />
        </svg>
      </m.div>

      <Chip className="right-5 top-16 hidden sm:block" delay={1.2}>
        <span className="grid size-4 place-items-center rounded-full bg-emerald-400 text-black">
          <Icon name="check" className="size-3" />
        </span>
        Core Web Vitals
      </Chip>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Digital Marketing — a live campaign dashboard with channels ramping up.   */
/* -------------------------------------------------------------------------- */

const KPIS: Array<{ label: string; icon: "spark" | "cursor" | "shopify"; path: string }> = [
  { label: "Reach", icon: "spark", path: "M0 22 L10 18 L20 20 L30 12 L40 14 L50 6 L60 4" },
  { label: "Clicks", icon: "cursor", path: "M0 24 L10 20 L20 22 L30 16 L40 10 L50 11 L60 3" },
  { label: "Sales", icon: "shopify", path: "M0 25 L10 23 L20 18 L30 19 L40 12 L50 8 L60 2" },
];

const CHANNELS = [
  { label: "Meta Ads", width: "88%", color: "from-cerulean to-[#5cc8f0]" },
  { label: "Google Ads", width: "74%", color: "from-pink to-[#ff6bb5]" },
  { label: "Instagram", width: "62%", color: "from-cerulean to-pink" },
  { label: "Email", width: "46%", color: "from-[#5cc8f0] to-cerulean" },
];

export function MarketingVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} aria-hidden className="relative h-full overflow-hidden rounded-2xl bg-ink text-white">
      <div className="absolute -left-16 -top-16 size-56 rounded-full bg-pink/35 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 size-56 rounded-full bg-cerulean/40 blur-3xl" />
      <div className="bg-grid absolute inset-0 opacity-20" />

      <div className="relative flex h-full flex-col gap-3 p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Campaign live
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] text-white/70">
            Last 30 days
          </span>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-3 gap-2">
          {KPIS.map((k, i) => (
            <m.div
              key={k.label}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
              className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur"
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-white/70">
                  <Icon name={k.icon} className="size-3 text-[#5cc8f0]" />
                  {k.label}
                </span>
                <span className="grid size-4 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                  <Icon name="arrowUp" className="size-2.5" />
                </span>
              </span>
              <svg viewBox="0 0 60 28" className="h-6 w-full overflow-visible">
                <m.path
                  d={k.path}
                  fill="none"
                  stroke="url(#mk-line)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : undefined}
                  transition={{ duration: 1.1, delay: 0.4 + i * 0.15, ease }}
                />
              </svg>
            </m.div>
          ))}
        </div>
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="mk-line" x1="0" x2="1">
              <stop offset="0" stopColor="#007BA7" />
              <stop offset="1" stopColor="#FF2D95" />
            </linearGradient>
          </defs>
        </svg>

        {/* Channel bars */}
        <div className="flex flex-1 flex-col justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">Channel performance</span>
          {CHANNELS.map((c, i) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[10px] text-white/70 sm:w-20 sm:text-[11px]">{c.label}</span>
              <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <m.span
                  className={`absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r ${c.color}`}
                  style={{ width: c.width }}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : undefined}
                  transition={{ duration: 1, delay: 0.6 + i * 0.12, ease }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <Chip className="bottom-4 right-6 hidden sm:block sm:bottom-5 sm:right-8" delay={1.6}>
        <span className="grid size-4 place-items-center rounded-full bg-emerald-400 text-black">
          <Icon name="arrowUp" className="size-3" />
        </span>
        Conversions up
      </Chip>
    </div>
  );
}
