"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { about, hero, services, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingService() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % services.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  const service = services[index];

  return (
    <span className="relative block h-[2.6em] overflow-hidden leading-[1.3] sm:h-[1.3em]" aria-hidden>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={service.id}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease }}
          className="absolute inset-x-0 flex items-start gap-3"
        >
          <Icon name={service.icon} className="mt-[0.2em] size-[0.9em] shrink-0 text-accent" />
          <span>{service.title}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Portrait inside an orbit of service icons (desktop only). */
function Orbit() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-[min(80vw,20rem)] sm:w-[22rem] lg:w-full lg:max-w-[28rem]"
    >
      <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-cerulean/40 to-pink/40 blur-3xl" />
      <div className="absolute inset-0 rounded-full border border-dashed border-line-strong" />
      <div className="absolute inset-[16%] rounded-full border border-line" />

      <motion.div
        className="absolute inset-[22%] rounded-full bg-gradient-to-br from-cerulean to-pink p-[3px] shadow-[0_40px_90px_-30px_var(--color-cerulean)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative size-full overflow-hidden rounded-full bg-ink">
          {about.image ? (
            <Image
              src={about.image.src}
              alt=""
              width={about.image.width}
              height={about.image.height}
              sizes="260px"
              priority
              className="size-full scale-[1.25] object-cover object-[50%_24%]"
            />
          ) : (
            <span className="grid size-full place-items-center font-serif text-6xl italic text-gradient">
              {site.initials}
            </span>
          )}
        </div>
      </motion.div>

      <div className="orbit absolute inset-0">
        {services.map((s, i) => {
          const angle = (i / services.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 50;
          const y = 50 + Math.sin(angle) * 50;
          return (
            <span
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x.toFixed(3)}%`, top: `${y.toFixed(3)}%` }}
            >
              <span className="orbit-reverse grid size-10 place-items-center rounded-xl border border-line bg-surface/80 text-accent shadow-lg backdrop-blur sm:size-12 sm:rounded-2xl xl:size-14">
                <Icon name={s.icon} className="size-[18px] sm:size-5 xl:size-6" />
              </span>
            </span>
          );
        })}
      </div>

      <span className="absolute bottom-[8%] left-1/2 z-10 hidden -translate-x-1/2 lg:flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/90 px-4 py-2 text-sm font-medium shadow-xl backdrop-blur">
        <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px] shadow-emerald-500" />
        {site.name.split(" ")[0]}{" "}
        <span className="font-serif text-base italic text-gradient">{site.name.split(" ").slice(1).join(" ")}</span>
      </span>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  // Cursor-following glow.
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const smx = useSpring(mx, { stiffness: 120, damping: 20 });
  const smy = useSpring(my, { stiffness: 120, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${smx}px ${smy}px, color-mix(in srgb, var(--color-cerulean) 14%, transparent), transparent 60%)`;

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const [first, ...rest] = site.name.split(" ");

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 sm:pt-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <motion.div className="absolute inset-0" style={{ background: glow }} />
        <motion.div
          className="absolute -left-40 top-0 size-[32rem] rounded-full bg-cerulean/20 blur-[140px] dark:bg-cerulean/25"
          animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-pink/15 blur-[140px] dark:bg-pink/20"
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container>
        <motion.div
          style={{ y, opacity, scale }}
          className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16"
        >
          <div className="flex flex-col items-start gap-7 sm:gap-8 lg:col-span-7">
            {hero.eyebrow ? (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="border-spin inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-muted sm:text-sm"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-pink opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-pink" />
                </span>
                {hero.eyebrow}
              </motion.p>
            ) : null}

            <h1
              id="hero-heading"
              className="w-full text-[clamp(3.25rem,14vw,6.5rem)] font-semibold lg:text-[clamp(5rem,8vw,7.25rem)] leading-[0.9] tracking-[-0.05em]"
            >
              <span className="sr-only">
                {site.name} — {services.map((s) => s.title).join(", ")}
              </span>
              <span aria-hidden className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease }}
                >
                  {first}
                </motion.span>
              </span>
              <span aria-hidden className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="inline-block pr-[0.1em] font-serif font-normal italic tracking-[-0.02em] text-gradient"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease }}
                >
                  {rest.join(" ")}
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="w-full max-w-2xl text-xl font-medium tracking-tight sm:text-2xl"
            >
              <RotatingService />
            </motion.div>

            {hero.tagline ? (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease }}
                className="max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
              >
                {hero.tagline}
              </motion.p>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
                <ButtonLink href="#work" className="w-full sm:w-auto">
                  Work
                  <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
              </Magnetic>
              <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
                <ButtonLink href="#contact" variant="secondary" className="w-full sm:w-auto">
                  Contact
                </ButtonLink>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease }}
            className="order-first lg:order-none lg:col-span-5"
          >
            <Orbit />
          </motion.div>
        </motion.div>
      </Container>

      <motion.a
        href="#services"
        aria-label="Scroll to Services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:flex"
      >
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-line-strong p-1.5">
          <motion.span
            className="block size-1 rounded-full bg-fg"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
