"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { hero, services, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingService() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % services.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="relative block h-[1.3em] overflow-hidden" aria-hidden>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={services[index].id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="absolute inset-x-0 truncate bg-gradient-to-r from-cerulean to-pink bg-clip-text text-transparent"
        >
          {services[index].title}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [first, ...rest] = site.name.split(" ");

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28"
    >
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <motion.div
          className="absolute -left-32 top-10 size-[28rem] rounded-full bg-cerulean/25 blur-[120px] dark:bg-cerulean/30"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 size-[26rem] rounded-full bg-pink/20 blur-[120px] dark:bg-pink/25"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container>
        <motion.div style={{ y, opacity }} className="flex flex-col items-start gap-8">
          {hero.eyebrow ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-sm text-muted backdrop-blur"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-pink opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-pink" />
              </span>
              {hero.eyebrow}
            </motion.p>
          ) : null}

          <h1 id="hero-heading" className="w-full text-[clamp(3rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            <span className="sr-only">
              {site.name} — {services.map((s) => s.title).join(", ")}
            </span>
            <span aria-hidden className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease }}
              >
                {first}
              </motion.span>
            </span>
            <span aria-hidden className="block overflow-hidden">
              <motion.span
                className="block text-muted/80"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease }}
              >
                {rest.join(" ")}
                <span className="text-pink">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="w-full max-w-3xl text-xl font-medium tracking-tight sm:text-3xl"
          >
            <RotatingService />
          </motion.div>

          {hero.tagline ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
              className="max-w-xl text-pretty text-lg text-muted"
            >
              {hero.tagline}
            </motion.p>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="flex flex-wrap gap-3"
          >
            <ButtonLink href="#work">
              Work
              <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary">
              Contact
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>

      <motion.a
        href="#services"
        aria-label="Scroll to Services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <span className="grid h-12 w-7 place-items-start justify-center rounded-full border border-line p-1.5">
          <motion.span
            className="block size-1.5 rounded-full bg-fg"
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
