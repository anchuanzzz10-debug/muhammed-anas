import { cv, sectionIntros } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function CV() {
  return (
    <Section id="cv" index={5} title="CV" description={sectionIntros.cv}>
      <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          Download CV
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
