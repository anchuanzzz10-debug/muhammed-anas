"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent, type ReactNode } from "react";
import { contact, services, socials, sectionIntros } from "@/content/site";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

type Fields = { name: string; email: string; service: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "success" | "mailto" | "whatsapp" | "error";

const EMPTY: Fields = { name: "", email: "", service: "", message: "" };
/** With no email or form endpoint configured, the form hands off to WhatsApp. */
const viaWhatsApp = !contact.formEndpoint && !contact.email && Boolean(contact.whatsapp);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = "Name is required.";
  if (!f.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(f.email)) errors.email = "Enter a valid email address.";
  if (!f.message.trim()) errors.message = "Message is required.";
  return errors;
}

const inputClass =
  "w-full rounded-2xl border bg-surface-2 px-4 py-3.5 text-base text-fg outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-line-strong focus:border-accent focus:bg-bg focus:ring-4 focus:ring-accent/15";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-pink"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const update = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const a11y = (key: keyof Fields) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    const serviceTitle = services.find((s) => s.id === fields.service)?.title ?? "";

    if (contact.formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(contact.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...fields, service: serviceTitle }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus("success");
        setFields(EMPTY);
      } catch {
        setStatus("error");
      }
      return;
    }

    if (contact.email) {
      const subject = encodeURIComponent(serviceTitle ? `${serviceTitle} — ${fields.name}` : fields.name);
      const body = encodeURIComponent(`${fields.message}\n\n${fields.name}\n${fields.email}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      setStatus("mailto");
      return;
    }

    if (contact.whatsapp) {
      const text = [
        `Hi, I'm ${fields.name} (${fields.email}).`,
        serviceTitle ? `Service: ${serviceTitle}` : "",
        "",
        fields.message,
      ]
        .filter((line, i) => line || i === 2)
        .join("\n");
      const url = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setStatus("whatsapp");
      return;
    }

    setStatus("error");
  };

  return (
    <Section id="contact" index={8} title="Contact" className="overflow-x-clip">
      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-10 -z-10 size-80 rounded-full bg-cerulean/15 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 -z-10 size-80 rounded-full bg-pink/10 blur-[120px]"
        />
        <div className="flex flex-col gap-8 lg:col-span-5">
          {sectionIntros.contact ? (
            <p className="text-balance text-[clamp(1.6rem,3.2vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.03em]">
              {sectionIntros.contact}
            </p>
          ) : null}
          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="group inline-flex items-center gap-3 self-start text-xl font-medium tracking-tight sm:text-2xl"
            >
              <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-cerulean to-pink text-white transition-transform duration-300 group-hover:scale-110">
                <Icon name="mail" />
              </span>
              <span className="break-all bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                {contact.email}
              </span>
            </a>
          ) : null}

          {socials.length ? (
            <ul className="flex flex-col gap-3" aria-label="Contact links">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ring-gradient group relative flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 pr-4 transition-transform duration-300 hover:-translate-y-0.5 sm:p-4"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-accent transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-cerulean group-hover:to-pink group-hover:text-white">
                      <Icon name={s.icon} className="size-[22px]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-semibold tracking-tight">{s.label}</span>
                      {s.handle ? <span className="truncate text-sm text-muted">{s.handle}</span> : null}
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-fg group-hover:text-bg">
                      <Icon name="arrowUpRight" className="size-4" />
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          <form
            noValidate
            onSubmit={onSubmit}
            aria-label="Contact form"
            className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-surface p-5 shadow-[0_40px_100px_-50px_var(--color-cerulean)] sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="contact-name" label="Name" error={errors.name}>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fields.name}
                  onChange={update("name")}
                  className={cn(inputClass, errors.name ? "border-pink" : "border-line")}
                  {...a11y("name")}
                />
              </Field>
              <Field id="contact-email" label="Email" error={errors.email}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={fields.email}
                  onChange={update("email")}
                  className={cn(inputClass, errors.email ? "border-pink" : "border-line")}
                  {...a11y("email")}
                />
              </Field>
            </div>

            <Field id="contact-service" label="Service" optional>
              <div className="relative">
                <select
                  id="contact-service"
                  name="service"
                  value={fields.service}
                  onChange={update("service")}
                  className={cn(inputClass, "appearance-none border-line pr-12")}
                >
                  <option value="">—</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronRight"
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 rotate-90 text-muted"
                />
              </div>
            </Field>

            <Field id="contact-message" label="Message" error={errors.message}>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                required
                value={fields.message}
                onChange={update("message")}
                className={cn(inputClass, "resize-y", errors.message ? "border-pink" : "border-line")}
                {...a11y("message")}
              />
            </Field>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
                {status === "sending" ? "Sending…" : viaWhatsApp ? "Send via WhatsApp" : "Send"}
                <Icon
                  name={viaWhatsApp ? "whatsapp" : "arrowRight"}
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </Button>
              <p role="status" aria-live="polite" className="text-sm">
                {status === "success" ? (
                  <span className="inline-flex items-center gap-2 text-accent">
                    <Icon name="check" className="size-4" />
                    Message sent.
                  </span>
                ) : status === "whatsapp" ? (
                  <span className="text-muted">Opening WhatsApp…</span>
                ) : status === "mailto" ? (
                  <span className="text-muted">Opening your email app…</span>
                ) : status === "error" ? (
                  <span className="text-pink">Something went wrong. Please try again.</span>
                ) : null}
              </p>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
