import Image from "next/image";
import { about, services, sectionIntros } from "@/content/site";
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
            <Reveal className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-[1.75rem] border border-line">
                <Image
                  src={about.image.src}
                  alt={about.image.alt}
                  width={about.image.width}
                  height={about.image.height}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-tr from-cerulean/20 via-transparent to-pink/20 mix-blend-overlay"
                />
              </div>
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

          <Reveal delay={0.2} className={cn(about.image ? "lg:col-span-12" : "lg:col-span-6")}>
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
