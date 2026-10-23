import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_var(--color-cerulean)] active:translate-y-0",
  secondary:
    "border border-line bg-surface/60 text-fg backdrop-blur hover:-translate-y-0.5 hover:border-accent/50 active:translate-y-0",
  ghost: "text-fg hover:text-accent",
};

type CommonProps = { variant?: Variant; children: ReactNode; className?: string };

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
