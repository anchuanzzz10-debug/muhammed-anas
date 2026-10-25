"use client";

import {
  AnimatePresence,
  m,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { about, hero, location, services, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

const ROTATE_MS = 3000;

function RotatingService() {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % services.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [visible]);

  const service = services[index];

  return (
    <span ref={ref} className="flex flex-col gap-3" aria-hidden>
      <span className="relative block h-[2.6em] overflow-hidden leading-[1.3] sm:h-[1.3em]">
        <AnimatePresence initial={false}>
          <m.span
            key={service.id}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-60%", opacity: 0, transition: { duration: 0.3, ease } }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-x-0 top-0 flex items-start gap-3 will-change-transform"
          >
            <span className="mt-[0.1em] grid size-[1.1em] shrink-0 place-items-center rounded-md bg-gradient-to-br from-cerulean to-pink text-white">
              <Icon name={service.icon} className="size-[0.65em]" />
            </span>
            <span>{service.title}</span>
          </m.span>
        </AnimatePresence>
      </span>
      <span className="relative h-[2px] w-24 overflow-hidden rounded-full bg-line">
        <m.span
          key={index}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cerulean to-pink"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
        />
      </span>
    </span>
  );
}

/** Desktop: portrait inside an animated orbit of service icons. */
function Orbit() {
  return (
    <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[28rem] lg:block">
      <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-cerulean/40 to-pink/40 blur-3xl" />

      {/* Outer ring with a travelling light trail */}
      <div className="absolute inset-0 rounded-full border border-dashed border-line-strong" />
      <div className="orbit-fast absolute -inset-px rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,var(--color-cerulean)_330deg,var(--color-pink)_360deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%_-_2px),black_calc(100%_-_2px))]" />

      {/* Ripples */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="anim-ripple absolute inset-[22%] rounded-full border border-accent/40 will-change-transform"
          style={{ animationDelay: `${i * 1.2}s` }}
        />
      ))}

      {/* Portrait with spinning gradient border */}
      <div className="anim-float absolute inset-[22%]">
        <div className="absolute -inset-[3px] overflow-hidden rounded-full shadow-[0_40px_90px_-30px_var(--color-cerulean)]">
          <div className="orbit-fast absolute inset-[-50%] bg-[conic-gradient(from_0deg,var(--color-cerulean),var(--color-pink),#ffffff,var(--color-cerulean))]" />
        </div>
        <div className="relative size-full overflow-hidden rounded-full bg-ink">
          {about.image ? (
            <Image
              src={about.image.src}
              alt=""
              width={about.image.width}
              height={about.image.height}
              sizes="260px"
              className="size-full scale-[1.25] object-cover object-[50%_24%]"
            />
          ) : (
            <span className="grid size-full place-items-center font-serif text-6xl italic text-gradient">
              {site.initials}
            </span>
          )}
        </div>
      </div>

      {/* Orbiting service icons */}
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
    </div>
  );
}

/** Where the floating service tiles sit around the phone portrait. */
const TILE_SPOTS = ["-left-4 top-[12%] -rotate-6", "-right-4 top-[40%] rotate-6", "-left-3 bottom-[26%] rotate-3"];

/** Phones and tablets: the full, uncropped photo in a turning neon gradient frame, with floating service tiles. */
function Portrait() {
  if (!about.image) return null;
  const tiles = services.filter((s) => s.featured).slice(0, TILE_SPOTS.length);

  return (
    <figure className="relative mx-auto w-[min(78vw,20rem)] sm:w-[22rem] lg:hidden">
      {/* Neon glow: the frame's colours, blurred, turning with it */}
      <div
        aria-hidden
        className="orbit-fast absolute inset-x-[-8%] top-[8%] -z-10 aspect-square rounded-full bg-[conic-gradient(from_0deg,var(--color-cerulean),#2AA6D6,#7d5bb5,var(--color-pink),var(--color-cerulean))] opacity-70 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[2rem] p-1 shadow-[0_30px_60px_-25px_rgb(255_45_149/0.5)]">
        <div aria-hidden className="orbit-fast absolute inset-[-50%] bg-[conic-gradient(from_0deg,var(--color-cerulean),#2AA6D6,#7d5bb5,var(--color-pink),var(--color-cerulean))]" />
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink">
          <Image
            src={about.image.src}
            alt={about.image.alt}
            width={about.image.width}
            height={about.image.height}
            // Hidden from lg up, where the orbit shows instead: "1px" keeps desktops on the tiniest file.
            sizes="(min-width: 1024px) 1px, (min-width: 640px) 352px, 78vw"
            preload
            fetchPriority="high"
            className="h-auto w-full"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-tr from-cerulean/15 via-transparent to-pink/15 mix-blend-overlay"
          />
          <div
            aria-hidden
            className="anim-sweep absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.16)_50%,transparent_65%)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
          <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 pl-4 text-white backdrop-blur-md">
            <span className="truncate font-semibold tracking-tight">{site.name}</span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink font-serif text-lg italic">
              {site.initials}
            </span>
          </figcaption>
        </div>
      </div>

      {tiles.map((s, i) => (
        <span key={s.id} aria-hidden className={cn("absolute", TILE_SPOTS[i])}>
          <span
            className="anim-float grid size-12 place-items-center rounded-2xl border border-line bg-surface/80 text-accent shadow-lg backdrop-blur"
            style={{ animationDelay: `${i * -2}s` }}
          >
            <Icon name={s.icon} className="size-5" />
          </span>
        </span>
      ))}
    </figure>
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
        <m.div className="absolute inset-0" style={{ background: glow }} />
        <div className="anim-drift-a absolute -left-40 top-0 size-[32rem] rounded-full bg-cerulean/20 blur-[140px] will-change-transform dark:bg-cerulean/25" />
        <div className="anim-drift-b absolute -right-32 bottom-0 size-[30rem] rounded-full bg-pink/15 blur-[140px] will-change-transform dark:bg-pink/20" />
      </div>

      <Container>
        <m.div style={{ y, opacity, scale }} className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col items-start gap-7 sm:gap-8 lg:col-span-7">
            <div className="anim-fade-up flex flex-wrap items-center gap-2">
              {hero.eyebrow ? (
                <p className="border-spin inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-muted sm:text-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-pink opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-pink" />
                  </span>
                  {hero.eyebrow}
                </p>
              ) : null}
              <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur sm:text-sm">
                <Icon name="mapPin" className="size-3.5 text-accent sm:size-4" />
                {location.label}
              </p>
            </div>

            <h1
              id="hero-heading"
              className="w-full text-[clamp(3.25rem,14vw,6.5rem)] font-semibold lg:text-[clamp(5rem,8vw,7.25rem)] leading-[0.9] tracking-[-0.05em]"
            >
              <span className="sr-only">
                {site.name} — {site.jobTitle} in {location.label}, {location.region}
              </span>
              <span aria-hidden className="block overflow-hidden pb-[0.06em]">
                <span className="anim-rise block">{first}</span>
              </span>
              <span aria-hidden className="block overflow-hidden pb-[0.12em]">
                <span
                  className="anim-rise inline-block pr-[0.1em] font-serif font-normal italic tracking-[-0.02em] text-gradient"
                  style={{ animationDelay: "0.1s" }}
                >
                  {rest.join(" ")}
                </span>
              </span>
            </h1>

            <div
              className="anim-fade-up w-full max-w-2xl text-xl font-medium tracking-tight sm:text-2xl"
              style={{ animationDelay: "0.35s" }}
            >
              <RotatingService />
            </div>

            {hero.tagline ? (
              <p
                className="anim-fade-up max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
                style={{ animationDelay: "0.45s" }}
              >
                {hero.tagline}
              </p>
            ) : null}

            <div
              className="anim-fade-up flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              style={{ animationDelay: "0.55s" }}
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
            </div>
          </div>

          <div className="anim-scale-in order-first lg:order-none lg:col-span-5">
            <Portrait />
            <Orbit />
          </div>
        </m.div>
      </Container>

      <a
        href="#services"
        aria-label="Scroll to Services"
        style={{ animationDelay: "1.2s" }}
        className="anim-fade-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:flex"
      >
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-line-strong p-1.5">
          <span className="anim-scroll-dot block size-1 rounded-full bg-fg" />
        </span>
      </a>
    </section>
  );
}
