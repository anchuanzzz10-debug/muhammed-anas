import { cv, sectionIntros, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Decorative stack of CV pages (not a real preview of the file). */
function CvIllustration() {
  const block = (widths: string[]) =>
    widths.map((w, i) => <span key={i} className="block h-[5px] rounded-full bg-ink/10" style={{ width: w }} />);

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[16rem] py-4 sm:max-w-[19rem]">
      <div className="absolute inset-y-4 inset-x-0 translate-x-5 translate-y-3 rotate-[6deg] rounded-2xl border border-line bg-surface-2 shadow-xl transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-7 group-hover:rotate-[9deg]" />
      <div className="relative flex aspect-[1/1.414] -rotate-[3deg] flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:rotate-0 sm:p-6">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-bold leading-none tracking-tight sm:text-[17px]">{site.name}</span>
          <span className="text-[9px] font-semibold text-cerulean sm:text-[10px]">{site.jobTitle}</span>
          <span className="mt-1.5 block h-[2px] rounded-full bg-gradient-to-r from-cerulean to-pink" />
        </div>
        {[
          ["Summary", ["100%", "92%", "70%"]],
          ["Experience", ["96%", "88%", "94%", "60%"]],
          ["Projects", ["84%", "72%"]],
          ["Skills", ["90%", "76%"]],
        ].map(([label, widths]) => (
          <div key={label as string} className="flex flex-col gap-1.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-cerulean sm:text-[8px]">
              {label as string}
            </span>
            {block(widths as string[])}
          </div>
        ))}
        <div className="mt-auto flex flex-wrap gap-1">
          {["SEO", "Ads", "Web", "Software"].map((t) => (
            <span key={t} className="rounded-full bg-ink/[0.06] px-1.5 py-0.5 text-[7px] font-medium text-ink/60">
              {t}
            </span>
          ))}
        </div>
      </div>
      <span className="absolute -right-1 top-8 flex items-center gap-1.5 rounded-full border border-white/40 bg-surface/90 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur dark:border-white/10 sm:-right-4">
        <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink text-[8px] font-bold text-white">
          PDF
        </span>
        CV
      </span>
    </div>
  );
}

export function CV() {
  return (
    <Section id="cv" index={5} title="CV" description={sectionIntros.cv}>
      <Reveal>
        <div className="ring-gradient group relative grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-cerulean/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-pink/15 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:col-span-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span className="size-1.5 rounded-full bg-gradient-to-br from-cerulean to-pink" />
              Curriculum Vitae
            </span>
            <h3 className="text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {site.name}
              <span className="block w-fit pr-1 font-serif font-normal italic tracking-[-0.02em] text-gradient">
                {site.jobTitle}
              </span>
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label="Focus areas">
              {cv.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={cv.viewUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                View CV
                <Icon name="arrowUpRight" className="size-4" />
                <span className="sr-only">(opens Google Drive in a new tab)</span>
              </ButtonLink>
              <ButtonLink
                href={cv.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Icon name="arrowDown" className="size-4" />
                Download PDF
              </ButtonLink>
            </div>
            <p className="text-sm text-muted">Hosted on Google Drive · PDF</p>
          </div>

          <div className="relative lg:col-span-5">
            <CvIllustration />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
