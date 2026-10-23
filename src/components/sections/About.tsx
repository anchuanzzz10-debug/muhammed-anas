import Image from "next/image";
import { about, services } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function About() {
  const hasText = about.paragraphs.length > 0;

  return (
    <Section id="about" index={4} title="About">
      <div className={cn("grid gap-10", about.image && "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16")}>
        {about.image ? (
          <Reveal>
            <div className="group relative overflow-hidden rounded-3xl border border-line">
              <Image
                src={about.image.src}
                alt={about.image.alt}
                width={about.image.width}
                height={about.image.height}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-cerulean/20 via-transparent to-pink/20 mix-blend-overlay" />
            </div>
          </Reveal>
        ) : null}

        <div className="flex flex-col gap-10">
          {hasText ? (
            <Reveal className="flex flex-col gap-5 text-pretty text-lg leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          ) : null}

          <Reveal delay={0.1}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm">
                  <Icon name={s.icon} className="size-5 shrink-0 text-accent" />
                  {s.title}
                </li>
              ))}
            </ul>
          </Reveal>

          {about.stats.length ? (
            <Reveal delay={0.15}>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {about.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse gap-1 rounded-2xl border border-line bg-surface/50 p-5">
                    <dt className="text-sm text-muted">{stat.label}</dt>
                    <dd className="bg-gradient-to-r from-cerulean to-pink bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
