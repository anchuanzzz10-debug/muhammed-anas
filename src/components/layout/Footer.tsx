import { navItems, site, socials } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <Container className="flex flex-col gap-10 py-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <a href="#top" className="flex items-center gap-3 self-start rounded-full">
            <span className="grid size-10 place-items-center rounded-full bg-fg font-mono text-xs font-semibold text-bg">
              {site.initials}
            </span>
            <span className="text-lg font-semibold tracking-tight">{site.name}</span>
          </a>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-muted transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
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
              className="grid size-10 place-items-center rounded-full bg-fg text-bg transition hover:-translate-y-0.5"
            >
              <Icon name="arrowUp" className="size-[18px]" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
