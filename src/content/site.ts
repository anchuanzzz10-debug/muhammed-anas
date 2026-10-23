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
  /** Featured services get a large highlighted card at the top of Services. */
  featured?: boolean;
  /** Key areas shown as a checklist on featured cards. */
  highlights?: string[];
};

export type Skill = {
  serviceId: Service["id"];
  tools: string[];
};

export type Project = {
  id: string;
  title: string;
  /** A Service id — adds the project to the Work filter. Optional. */
  category?: Service["id"];
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
  /** Shown under the label in the Contact section, e.g. a username or number. */
  handle?: string;
};

export const site = {
  name: "Muhammed Anas",
  initials: "MA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Primary SEO title (browser tab, search results, social shares). */
  title: "Muhammed Anas — Shopify Developer & Performance Marketer",
  jobTitle: "Shopify Developer & Performance Marketer",
  /** Meta description — keep it under ~160 characters. */
  description:
    "Shopify developer and performance marketer building high-converting online stores, profitable ad campaigns, custom software, video content and brand identities.",
  locale: "en_US",
};

const allNavItems: NavItem[] = [
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "redesign", label: "Redesign" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const services: Service[] = [
  {
    id: "shopify",
    title: "Shopify Store Development & Customization",
    icon: "shopify",
    description:
      "Fast, mobile-first Shopify stores built to convert — custom themes, Liquid development, app integrations and checkout optimization tailored to your products.",
  },
  {
    id: "performance",
    title: "Performance Marketing",
    icon: "chart",
    description:
      "Data-driven ad campaigns on Meta and Google, focused on return on ad spend, lower acquisition costs and growth you can measure.",
  },
  {
    id: "software",
    title: "Custom Software Development",
    icon: "code",
    featured: true,
    description:
      "Web apps, dashboards, automations and integrations designed around your workflow, so your business runs faster with less manual work.",
  },
  {
    id: "web",
    title: "Web Development",
    icon: "globe",
    featured: true,
    description:
      "Fast, responsive and SEO-ready websites — from landing pages to complete business sites — built with modern frameworks and designed to turn visitors into customers.",
  },
  {
    id: "seo",
    title: "SEO Services",
    icon: "search",
    featured: true,
    description:
      "Get found on Google by the customers already searching for you. I fix what holds your site back, optimize every page around the right keywords and make it fast — so you earn more organic traffic without paying for every click.",
    highlights: ["Technical SEO", "On-Page SEO", "Keyword Research", "Website Optimization"],
  },
  {
    id: "strategy",
    title: "Digital Marketing Strategy",
    icon: "target",
    description:
      "Clear, practical growth plans covering audience research, funnels, SEO, content and analytics — so every channel works toward the same goal.",
  },
  {
    id: "video",
    title: "Video Editing & Creative Design",
    icon: "film",
    description:
      "Scroll-stopping video edits, short-form reels, ad creatives and social graphics that capture attention and tell your story.",
  },
  {
    id: "branding",
    title: "Branding & Brand Identity",
    icon: "spark",
    description:
      "Memorable brand identities — logo, color palette, typography and guidelines — that make your business look consistent and credible everywhere.",
  },
];

export const hero = {
  eyebrow: "Your Digital Growth Partner",
  tagline:
    "I help brands grow online — from high-converting Shopify stores and data-driven ad campaigns to custom software, video content and brand identities that stand out.",
};

/** Short SEO-friendly intro shown under each section heading. Leave empty to hide. */
export const sectionIntros: Record<string, string> = {
  services:
    "End-to-end digital services to build, market and grow your brand online — from e-commerce development to paid advertising and creative.",
  skills: "The platforms and tools I use to design, build, launch and scale.",
  work: "A selection of live websites and online stores from my portfolio.",
  about: "",
  process: "A simple, transparent process that keeps every project focused on results.",
  testimonials: "",
  faq: "Answers to common questions about Shopify development, marketing and working together.",
  redesign:
    "Drag the slider to see what a redesign can do — from an outdated, slow website to a fast, modern experience built to convert.",
  contact: "Have a project in mind? Tell me about your goals and I'll get back to you with the next steps.",
};

export const skills: Skill[] = [
  {
    serviceId: "shopify",
    tools: ["Shopify", "Shopify Plus", "Liquid", "Online Store 2.0", "Theme Customization", "Shopify Apps", "Checkout Optimization"],
  },
  {
    serviceId: "performance",
    tools: ["Meta Ads", "Google Ads", "Conversion Tracking", "A/B Testing", "Retargeting", "Google Analytics 4"],
  },
  {
    serviceId: "software",
    tools: ["TypeScript", "Node.js", "REST APIs", "Databases", "Dashboards", "Automation", "Integrations"],
  },
  {
    serviceId: "seo",
    tools: [
      "Technical SEO",
      "On-Page SEO",
      "Keyword Research",
      "Website Optimization",
      "Core Web Vitals",
      "Schema Markup",
      "Google Search Console",
      "Local SEO",
    ],
  },
  {
    serviceId: "web",
    tools: ["HTML & CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "Responsive Design", "SEO-Friendly Builds"],
  },
  {
    serviceId: "strategy",
    tools: ["SEO", "Content Strategy", "Email Marketing", "Funnel Building", "Market Research", "Analytics & Reporting"],
  },
  {
    serviceId: "video",
    tools: [
      "CapCut",
      "CapCut Pro",
      "Reels & Shorts Editing",
      "Short-Form Video",
      "Captions & Subtitles",
      "Transitions & Effects",
      "Color Grading",
      "Canva",
    ],
  },
  {
    serviceId: "branding",
    tools: [
      "Brand Strategy",
      "Logo Design",
      "Visual Identity",
      "Brand Guidelines",
      "Typography",
      "Color Systems",
      "Brand Voice & Messaging",
      "Social Media Branding",
      "Packaging & Print",
    ],
  },
];

export const projects: Project[] = [
  { id: "greendrops-uae", title: "Green Drops UAE", href: "https://greendropsuae.com" },
  { id: "connect-docs-media", title: "Connect Docs Media", href: "https://connectdocsmedia.com" },
  { id: "south-ruwi", title: "South Ruwi", href: "https://southruwi.com" },
  { id: "docs-world-attestation", title: "Docs World Attestation", href: "https://docsworldattestation.com" },
  { id: "amairah-jewels", title: "Amairah Jewels", href: "https://amairahjewels.com" },
];

export const about = {
  paragraphs: [
    "I'm Muhammed Anas, a Shopify developer and performance marketer who works where technology, creativity and growth meet.",
    "Instead of juggling separate developers, marketers and designers, you get one partner who understands the whole picture — building your online store, creating the content that sells it and running the campaigns that bring customers in.",
    "Every project starts with your goals. Whether you are launching a new brand, redesigning a Shopify store or scaling paid ads, I focus on clean execution, clear communication and results you can measure.",
  ] as string[],
  image: {
    src: "/images/muhammed-anas.jpg",
    alt: "Portrait of Muhammed Anas",
    width: 1086,
    height: 1448,
  } as Project["image"],
  stats: [] as Stat[],
};

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    description:
      "We talk through your business, audience, competitors and goals, so the project is built on a clear understanding of what success looks like.",
  },
  {
    title: "Plan & Strategy",
    description:
      "I map out the scope, timeline and approach — from site structure and features to campaign strategy and creative direction.",
  },
  {
    title: "Design & Build",
    description:
      "Your store, software, brand or campaign assets are designed and developed with regular check-ins, so you can review progress along the way.",
  },
  {
    title: "Launch",
    description:
      "Everything is tested across devices, tracking is set up and the project goes live smoothly — with nothing left to chance.",
  },
  {
    title: "Optimize & Scale",
    description:
      "After launch, I monitor performance, test improvements and refine campaigns to keep your results growing over time.",
  },
];

export const testimonials: Testimonial[] = [];

export const faqs: FaqItem[] = [
  {
    question: "What services do you offer?",
    answer:
      "I offer Shopify store development and customization, performance marketing, custom software development, web development, SEO, digital marketing strategy, video editing and creative design, and branding and brand identity. You can hire me for a single service or combine them into one complete project.",
  },
  {
    question: "Can you redesign or improve my existing Shopify store?",
    answer:
      "Yes. I can redesign your theme, improve page speed and mobile experience, add custom features and optimize product pages and checkout to help increase conversions — without starting from scratch.",
  },
  {
    question: "Which advertising platforms do you work with?",
    answer:
      "I run and optimize campaigns on Meta (Facebook and Instagram) and Google, with proper conversion tracking so every decision is based on real data.",
  },
  {
    question: "Do you offer SEO for existing websites?",
    answer:
      "Yes. I start with a technical SEO audit of your current site, then improve on-page content, keywords, structure and page speed — whether your site runs on Shopify, a custom build or another platform.",
  },
  {
    question: "How long does a project take?",
    answer:
      "It depends on the scope. After an initial discussion about your goals and requirements, I share a clear timeline and keep you updated at every stage.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Every project is quoted individually based on its scope and goals. Get in touch with a few details about what you need and I'll send you a tailored proposal.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Yes. I offer ongoing support for updates, improvements and campaign management, so your store and marketing keep performing after launch.",
  },
  {
    question: "How do we get started?",
    answer:
      "Send a message through the contact form with a short description of your project. I'll review it and get back to you to discuss the next steps.",
  },
];

export const contact = {
  email: "",
  /** International format, digits only after the plus — used for wa.me links. */
  whatsapp: "+917025219962",
  whatsappDisplay: "+91 70252 19962",
  /** Optional POST endpoint (e.g. Formspree). When empty, the form opens the visitor's mail client. */
  formEndpoint: "",
};

export const socials: SocialLink[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/917025219962",
    icon: "whatsapp",
    handle: "+91 70252 19962",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_anchu_anzzz_/",
    icon: "instagram",
    handle: "@_anchu_anzzz_",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhammed-anas-708a24404",
    icon: "linkedin",
    handle: "Muhammed Anas",
  },
];

/** Sections whose content is still empty are hidden (with their nav links) until filled in. */
const emptySections = new Set<string>(
  [
    !projects.length && "work",
    !processSteps.length && "process",
    !testimonials.length && "testimonials",
    !faqs.length && "faq",
  ].filter((id): id is string => Boolean(id)),
);

export const isSectionVisible = (id: string) => !emptySections.has(id);

export const navItems: NavItem[] = allNavItems.filter((item) => isSectionVisible(item.id));
