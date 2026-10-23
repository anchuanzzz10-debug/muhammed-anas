import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

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
  return (
    <section id={id} aria-labelledby={headingId} className={cn("relative scroll-mt-20 py-20 sm:py-28", className)}>
      <Container>
        <Reveal className="mb-12 flex flex-col gap-4 sm:mb-16">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-accent">{String(index).padStart(2, "0")}</span>
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-cerulean to-pink" />
          </div>
          <h2 id={headingId} className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h2>
          {description ? <p className="max-w-2xl text-pretty text-lg text-muted">{description}</p> : null}
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
