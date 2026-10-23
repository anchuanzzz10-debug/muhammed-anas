import type { IconName } from "@/components/ui/Icon";

/**
 * Single source of truth for all site content.
 * Fill in the empty strings and arrays below — every section renders
 * only the fields that are provided.
 */

export type NavItem = { id: string; label: string };

export type Service = {
  id: string;
  title: string;
  icon: IconName;
  description?: string;
};

export type Skill = {
  serviceId: Service["id"];
  tools: string[];
};

export type Project = {
  id: string;
  title: string;
  /** Must match a Service id so the Work filter can group it. */
  category: Service["id"];
  summary?: string;
  image?: { src: string; alt: string; width: number; height: number };
  href?: string;
  tags?: string[];
};

export type Stat = { label: string; value: string };

export type ProcessStep = { title: string; description?: string };

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: { src: string; alt: string };
};

export type FaqItem = { question: string; answer: string };

export type SocialLink = {
  label: string;
  href: string;
  icon: IconName;
};

export const site = {
  name: "Muhammed Anas",
  initials: "MA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Used for SEO. Falls back to a list of services when empty. */
  description: "",
  locale: "en_US",
};

export const navItems: NavItem[] = [
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const services: Service[] = [
  { id: "shopify", title: "Shopify Store Development & Customization", icon: "shopify" },
  { id: "performance", title: "Performance Marketing", icon: "chart" },
  { id: "software", title: "Custom Software Development", icon: "code" },
  { id: "strategy", title: "Digital Marketing Strategy", icon: "target" },
  { id: "video", title: "Video Editing & Creative Design", icon: "film" },
  { id: "branding", title: "Branding & Brand Identity", icon: "spark" },
];

export const hero = {
  eyebrow: "",
  tagline: "",
};

export const skills: Skill[] = services.map((s) => ({ serviceId: s.id, tools: [] }));

export const projects: Project[] = [];

export const about = {
  paragraphs: [] as string[],
  image: undefined as Project["image"],
  stats: [] as Stat[],
};

export const processSteps: ProcessStep[] = [];

export const testimonials: Testimonial[] = [];

export const faqs: FaqItem[] = [];

export const contact = {
  email: "",
  /** Optional POST endpoint (e.g. Formspree). When empty, the form opens the visitor's mail client. */
  formEndpoint: "",
};

export const socials: SocialLink[] = [];
