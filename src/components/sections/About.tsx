import Image from "next/image";
import { about, services, sectionIntros, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function About() {
  const [lead, ...body] = about.paragraphs;

  return (
    <Section id="about" index={4} title="About" description={sectionIntros.about}>
      <div className="flex flex-col gap-12 lg:gap-16">
        {lead ? (
          <Reveal>
            <p className="max-w-5xl text-balance text-[clamp(1.6rem,3.6vw,2.9rem)] font-medium leading-[1.15] tracking-[-0.03em]">
              {lead}
            </p>
          </Reveal>
        ) : null}

        <div className={cn("grid gap-10 lg:grid-cols-12 lg:gap-16", about.image ? "" : "lg:items-start")}>
          {about.image ? (
            <Reveal className="lg:col-span-5 lg:row-span-2">
              <figure className="group relative mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none">
                <div
                  aria-hidden
                  className="absolute -inset-2 -z-10 rounded-[2.25rem] sm:-inset-4 bg-gradient-to-br from-cerulean/30 via-transparent to-pink/30 opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-ink p-1.5">
                  <div className="relative overflow-hidden rounded-[1.4rem]">
                    <Image
                      src={about.image.src}
                      alt={about.image.alt}
                      width={about.image.width}
                      height={about.image.height}
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 100vw"
                      className="aspect-[3/4] h-auto w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-tr from-cerulean/15 via-transparent to-pink/15 mix-blend-overlay"
                    />
                    <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 pl-4 text-white backdrop-blur-md sm:inset-x-4 sm:bottom-4">
                      <span className="flex min-w-0 flex-col">
                        <span className="font-semibold tracking-tight">{site.name}</span>
                        <span className="truncate text-xs text-white/70">{site.jobTitle}</span>
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink font-serif text-lg italic">
                        {site.initials}
                      </span>
                    </figcaption>
                  </div>
                </div>
              </figure>
            </Reveal>
          ) : null}

          {body.length ? (
            <Reveal
              delay={0.1}
              className={cn(
                "flex flex-col gap-6 text-pretty text-lg leading-relaxed text-muted",
                about.image ? "lg:col-span-7" : "lg:col-span-6",
              )}
            >
              {body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          ) : null}

          <Reveal delay={0.2} className={cn(about.image ? "lg:col-span-7" : "lg:col-span-6")}>
            <ul className="flex flex-wrap gap-2">
              {services.map((s) => (
                <li
                  key={s.id}
                  className="group flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-2 pr-4 text-sm font-medium transition-colors hover:border-accent/40"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-surface-2 text-accent transition-colors group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white">
                    <Icon name={s.icon} className="size-4" />
                  </span>
                  {s.title}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {about.stats.length ? (
          <Reveal delay={0.15}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-4">
              {about.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-2 bg-surface p-6">
                  <dt className="text-sm text-muted">{stat.label}</dt>
                  <dd className="font-serif text-5xl italic tracking-tight text-gradient">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
