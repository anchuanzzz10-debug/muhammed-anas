import { navItems, services, site, socials } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-80 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-cerulean/20 to-pink/20 blur-[120px]"
      />
      <Container className="flex flex-col gap-14 pt-16 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <a href="#top" className="group flex items-center gap-3 self-start rounded-full">
              <span className="relative grid size-11 place-items-center overflow-hidden rounded-full bg-fg font-mono text-xs font-semibold text-bg">
                <span className="absolute inset-0 bg-gradient-to-br from-cerulean to-pink opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative">{site.initials}</span>
              </span>
              <span className="text-lg font-semibold tracking-tight">{site.name}</span>
            </a>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted">{site.jobTitle}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4" aria-label="Services">
            {services.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5 text-sm text-muted">
                <Icon name={s.icon} className="size-4 shrink-0 text-accent" />
                {s.title}
              </li>
            ))}
          </ul>
        </div>

        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center text-[clamp(2.5rem,11.5vw,9.75rem)] font-semibold leading-[0.8] tracking-[-0.06em]"
        >
          <span className="text-fg/[0.08]">{first} </span>
          <span className="font-serif font-normal italic tracking-[-0.03em] text-gradient">{rest.join(" ")}</span>
        </p>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-line py-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            © <CurrentYear /> {site.name}
          </p>

          <div className="flex items-center gap-2">
            {socials.length ? (
              <ul className="flex items-center gap-2">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                    >
                      <Icon name={s.icon} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <a
              href="#top"
              aria-label="Back to top"
              className="group grid size-10 place-items-center rounded-full bg-fg text-bg transition hover:-translate-y-0.5"
            >
              <Icon name="arrowUp" className="size-[18px] transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
