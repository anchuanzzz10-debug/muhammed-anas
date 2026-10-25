import type { ReactNode } from "react";
import { navItems } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

type SectionProps = {
  id: string;
  index: number;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function Section({ id, index, title, description, children, className }: SectionProps) {
  const headingId = `${id}-heading`;
  // Number sections by their position among the visible ones, so hidden sections leave no gaps.
  const number = navItems.findIndex((item) => item.id === id) + 1 || index;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("cv-auto relative scroll-mt-24 py-20 sm:py-28 lg:py-32", className)}
    >
      <Container>
        <header className="mb-12 grid gap-6 border-t border-line pt-6 sm:mb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Reveal
              y={12}
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted"
            >
              <span className="text-accent">({String(number).padStart(2, "0")})</span>
              <span>{title}</span>
            </Reveal>
            <h2
              id={headingId}
              className="text-[clamp(2.5rem,7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
            >
              <SplitText text={title} />
              <span aria-hidden className="font-serif font-normal italic text-gradient">
                .
              </span>
            </h2>
          </div>
          {description ? (
            <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">{description}</p>
            </Reveal>
          ) : null}
        </header>
        {children}
      </Container>
    </section>
  );
}
