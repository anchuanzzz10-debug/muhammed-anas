import { cv, projects, sectionIntros, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

// What the CV covers.
const facts: Array<{ icon: IconName; label: string }> = [
  { icon: "spark", label: "Professional experience" },
  { icon: "code", label: "Skills & tools" },
  { icon: "link", label: `${projects.length} live projects` },
];

/** Decorative PDF document tile. */
function FileTile() {
  return (
    <div aria-hidden className="relative w-16 shrink-0 sm:w-28">
      <div className="absolute inset-2 -z-10 rounded-2xl bg-gradient-to-br from-cerulean/50 to-pink/50 blur-xl transition-opacity duration-500 group-hover:opacity-90" />
      <div className="relative aspect-[3/4] -rotate-6 overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.45)] ring-1 ring-black/5 transition-transform duration-700 ease-[var(--ease-out-expo)] [clip-path:polygon(0_0,72%_0,100%_22%,100%_100%,0_100%)] group-hover:-translate-y-1 group-hover:rotate-0 sm:rounded-2xl">
        <span className="absolute right-0 top-0 h-[22%] w-[28%] rounded-bl-lg bg-gradient-to-bl from-zinc-200 to-zinc-100" />
        <div className="flex h-full flex-col gap-[7%] p-[14%] pt-[16%]">
          <span className="w-fit rounded-md bg-gradient-to-br from-cerulean to-pink px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white sm:text-[11px]">
            PDF
          </span>
          <span className="h-[5%] w-[85%] rounded-full bg-zinc-900/80" />
          <span className="h-[3.5%] w-[55%] rounded-full bg-cerulean/70" />
          <span className="mt-[4%] h-[3%] w-full rounded-full bg-zinc-200" />
          <span className="h-[3%] w-[90%] rounded-full bg-zinc-200" />
          <span className="h-[3%] w-[70%] rounded-full bg-zinc-200" />
          <span className="mt-auto h-[3%] w-full rounded-full bg-gradient-to-r from-cerulean to-pink" />
        </div>
      </div>
    </div>
  );
}

export function CV() {
  return (
    <Section id="cv" index={5} title="CV" description={sectionIntros.cv}>
      <Reveal>
        <div className="ring-gradient group relative overflow-hidden rounded-[2rem] border border-line bg-surface">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-28 size-72 rounded-full bg-cerulean/15 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 right-10 size-72 rounded-full bg-pink/15 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
          />
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_left,black,transparent_70%)]"
          />

          <div className="relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-7 p-6 sm:gap-x-8 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:gap-x-12 lg:p-12">
            <FileTile />

            <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:text-[11px]">
                Curriculum Vitae · PDF
              </span>
              <h3 className="text-[clamp(1.3rem,5.8vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                {site.name}
                <span className="pr-[0.1em] font-serif font-normal italic tracking-[-0.02em] text-gradient">
                  {" "}
                  CV
                </span>
              </h3>
              <ul className="mt-1 hidden flex-wrap gap-x-5 gap-y-2 text-sm text-muted sm:flex">
                {facts.map((f) => (
                  <li key={f.label} className="inline-flex items-center gap-2">
                    <Icon name={f.icon} className="size-4 text-accent" />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="col-span-2 -mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted sm:hidden">
              {facts.map((f) => (
                <li key={f.label} className="inline-flex items-center gap-1.5">
                  <Icon name={f.icon} className="size-4 text-accent" />
                  {f.label}
                </li>
              ))}
            </ul>

            <div className="col-span-2 flex flex-col gap-3 sm:flex-row lg:col-span-1 lg:w-52 lg:flex-col">
              <ButtonLink
                href={cv.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                View CV
                <Icon name="arrowUpRight" className="size-4" />
                <span className="sr-only">
                  (opens Google Drive in a new tab)
                </span>
              </ButtonLink>
              <ButtonLink
                href={cv.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full"
              >
                <Icon name="arrowDown" className="size-4" />
                Download CV
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
