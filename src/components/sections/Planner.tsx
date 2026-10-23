"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { contact, sectionIntros, services } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

const GOALS: Array<{ id: string; label: string; icon: IconName }> = [
  { id: "launch", label: "Launch a new brand", icon: "spark" },
  { id: "sales", label: "Grow online sales", icon: "chart" },
  { id: "redesign", label: "Redesign or upgrade", icon: "globe" },
  { id: "automate", label: "Automate my business", icon: "code" },
];

const TIMELINES = [
  { id: "now", label: "Right away" },
  { id: "month", label: "Within a month" },
  { id: "exploring", label: "Just exploring" },
];

/** Short deterministic reference code for the current selection. */
function briefCode(parts: string[]) {
  let h = 7;
  for (const ch of parts.join("|")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `MA-${(h % 9000) + 1000}`;
}

function StepLabel({ n, id, children }: { n: number; id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="flex items-center gap-3 text-lg font-semibold tracking-tight sm:text-xl">
      <span className="grid size-8 place-items-center rounded-full border border-line font-mono text-xs text-muted">
        {n}
      </span>
      {children}
    </h3>
  );
}

export function Planner() {
  const uid = useId();
  const [picked, setPicked] = useState<string[]>([]);
  const [goal, setGoal] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const reset = () => {
    setPicked([]);
    setGoal(null);
    setTimeline(null);
  };

  const chosenServices = services.filter((s) => picked.includes(s.id));
  const goalLabel = GOALS.find((g) => g.id === goal)?.label;
  const timelineLabel = TIMELINES.find((t) => t.id === timeline)?.label;
  const progress = (Number(picked.length > 0) + Number(Boolean(goal)) + Number(Boolean(timeline))) / 3;
  const ready = picked.length > 0 && Boolean(goal);
  const code = briefCode([...picked, goal ?? "", timeline ?? ""]);

  const message = [
    `Hi Anas! Here's my project brief (${code}):`,
    "",
    `Services: ${chosenServices.map((s) => s.title).join(", ")}`,
    goalLabel ? `Goal: ${goalLabel}` : "",
    timelineLabel ? `Timeline: ${timelineLabel}` : "",
  ]
    .filter((line, i) => line || i === 1)
    .join("\n");
  const sendHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : "#contact";

  return (
    <Section id="plan" index={8} title="Plan your project" description={sectionIntros.plan}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Steps */}
        <div className="flex flex-col gap-10 lg:col-span-7">
          <div className="flex flex-col gap-4">
            <StepLabel n={1} id={`${uid}-s1`}>
              What do you need?
            </StepLabel>
            <div role="group" aria-labelledby={`${uid}-s1`} className="flex flex-wrap gap-2">
              {services.map((s) => {
                const on = picked.includes(s.id);
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 rounded-full border py-2 pl-2 pr-4 text-sm font-medium transition-colors duration-300",
                      on
                        ? "border-transparent bg-fg text-bg"
                        : "border-line bg-surface text-fg hover:border-line-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full transition-colors duration-300",
                        on ? "bg-gradient-to-br from-cerulean to-pink text-white" : "bg-surface-2 text-accent",
                      )}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={on ? "on" : "off"}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon name={on ? "check" : s.icon} className="size-4" />
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    {s.title}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <StepLabel n={2} id={`${uid}-s2`}>
              What&apos;s the goal?
            </StepLabel>
            <div role="radiogroup" aria-labelledby={`${uid}-s2`} className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const on = goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setGoal(g.id)}
                    className={cn(
                      "group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
                      on
                        ? "border-accent/60 bg-surface shadow-[0_15px_40px_-25px_var(--color-cerulean)]"
                        : "border-line bg-surface hover:border-line-strong",
                    )}
                  >
                    {on ? (
                      <motion.span
                        layoutId={`${uid}-goal`}
                        className="absolute inset-0 bg-gradient-to-br from-cerulean/10 to-pink/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-300",
                        on ? "bg-gradient-to-br from-cerulean to-pink text-white" : "bg-surface-2 text-accent",
                      )}
                    >
                      <Icon name={g.icon} className="size-5" />
                    </span>
                    <span className="relative font-medium">{g.label}</span>
                    <span
                      className={cn(
                        "relative ml-auto grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                        on ? "border-transparent bg-accent text-white" : "border-line-strong",
                      )}
                    >
                      {on ? <Icon name="check" className="size-3" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <StepLabel n={3} id={`${uid}-s3`}>
              When do you want to start?
            </StepLabel>
            <div
              role="radiogroup"
              aria-labelledby={`${uid}-s3`}
              className="grid grid-cols-3 gap-1 rounded-full border border-line bg-surface p-1"
            >
              {TIMELINES.map((t) => {
                const on = timeline === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTimeline(t.id)}
                    className={cn(
                      "relative rounded-full px-2 py-2.5 text-xs font-medium transition-colors sm:text-sm",
                      on ? "text-bg" : "text-muted hover:text-fg",
                    )}
                  >
                    {on ? (
                      <motion.span
                        layoutId={`${uid}-time`}
                        className="absolute inset-0 rounded-full bg-fg"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live brief ticket */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-ink text-white shadow-[0_40px_100px_-40px_var(--color-pink)]">
              <div aria-hidden className="absolute -right-20 -top-20 size-60 rounded-full bg-pink/30 blur-3xl" />
              <div aria-hidden className="absolute -bottom-24 -left-16 size-60 rounded-full bg-cerulean/35 blur-3xl" />

              <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Project brief</span>
                  <span className="font-serif text-3xl italic">
                    {picked.length || goal || timeline ? code : "Your idea"}
                  </span>
                </div>
                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-cerulean to-pink">
                  <Icon name="spark" className="size-6" />
                </span>
              </div>

              <div className="relative mx-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cerulean to-pink"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.6, ease }}
                />
              </div>

              {/* Perforation */}
              <div aria-hidden className="relative my-5 flex items-center">
                <span className="-ml-3 size-6 rounded-full bg-bg" />
                <span className="mx-2 flex-1 border-t-2 border-dashed border-white/15" />
                <span className="-mr-3 size-6 rounded-full bg-bg" />
              </div>

              <dl className="relative flex min-h-[13rem] flex-col gap-5 px-6" aria-live="polite">
                <div className="flex flex-col gap-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Services</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {chosenServices.length ? (
                        chosenServices.map((s) => (
                          <motion.span
                            key={s.id}
                            layout
                            initial={{ opacity: 0, scale: 0.6, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.3, ease }}
                            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs"
                          >
                            <Icon name={s.icon} className="size-3.5 text-[#5cc8f0]" />
                            {s.title}
                          </motion.span>
                        ))
                      ) : (
                        <motion.span
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-white/35"
                        >
                          —
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Goal", goalLabel],
                    ["Timeline", timelineLabel],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{label}</dt>
                      <dd className="text-sm font-medium">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={value ?? "none"}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className={cn("block", !value && "text-white/35")}
                          >
                            {value ?? "—"}
                          </motion.span>
                        </AnimatePresence>
                      </dd>
                    </div>
                  ))}
                </div>
              </dl>

              <div className="relative flex flex-col gap-3 p-6 pt-8 sm:flex-row sm:items-center">
                <a
                  href={ready ? sendHref : undefined}
                  target={ready && contact.whatsapp ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-disabled={!ready}
                  onClick={(e) => {
                    if (!ready) e.preventDefault();
                  }}
                  className={cn(
                    "group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300",
                    ready
                      ? "bg-white text-ink hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_var(--color-pink)]"
                      : "cursor-not-allowed bg-white/10 text-white/40",
                  )}
                >
                  <Icon name={contact.whatsapp ? "whatsapp" : "mail"} className="size-4" />
                  {contact.whatsapp ? "Send brief on WhatsApp" : "Send brief"}
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full px-4 py-3 text-sm text-white/60 transition-colors hover:text-white"
                >
                  Reset
                </button>
              </div>
              {!ready ? (
                <p className="relative -mt-3 px-6 pb-6 text-xs text-white/40">
                  Pick at least one service and a goal to send your brief.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
