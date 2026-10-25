import { about, contact, faqs, isSectionVisible, location, services, site, skills, socials } from "@/content/site";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { OffscreenPause } from "@/components/layout/OffscreenPause";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CV } from "@/components/sections/CV";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Redesign } from "@/components/sections/Redesign";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

const personId = `${site.url}/#person`;
const businessId = `${site.url}/#business`;
const websiteId = `${site.url}/#website`;
const profiles = socials.filter((s) => s.icon !== "whatsapp").map((s) => s.href);
const portrait = about.image ? `${site.url}${about.image.src}` : undefined;

const address = {
  "@type": "PostalAddress",
  addressLocality: location.locality,
  addressRegion: location.region,
  addressCountry: location.countryCode,
};

const areaServed = [
  { "@type": "City", name: location.locality },
  { "@type": "City", name: location.district },
  { "@type": "AdministrativeArea", name: `${location.district} district` },
  { "@type": "State", name: location.region },
  { "@type": "Country", name: location.country },
  { "@type": "Country", name: "United Arab Emirates" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.name,
      alternateName: site.title,
      description: site.description,
      inLanguage: site.language,
      publisher: { "@id": businessId },
    },
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: site.language,
      isPartOf: { "@id": websiteId },
      about: { "@id": businessId },
      mainEntity: { "@id": businessId },
      dateModified: site.lastUpdated,
      ...(portrait ? { primaryImageOfPage: { "@type": "ImageObject", url: portrait } } : {}),
    },
    {
      "@type": "ProfessionalService",
      "@id": businessId,
      name: site.name,
      description: site.description,
      url: site.url,
      ...(portrait ? { image: portrait } : {}),
      logo: `${site.url}/icon.svg`,
      ...(contact.whatsapp ? { telephone: contact.whatsapp } : {}),
      ...(contact.email ? { email: contact.email } : {}),
      address,
      areaServed,
      founder: { "@id": personId },
      knowsAbout: services.map((s) => s.title),
      ...(profiles.length ? { sameAs: profiles } : {}),
      ...(contact.whatsapp
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              telephone: contact.whatsapp,
              contactType: "customer service",
              areaServed: [location.countryCode, "AE"],
            },
          }
        : {}),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital marketing, SEO, web and creative services",
        itemListElement: services.map((s, i) => ({
          "@type": "Offer",
          position: i + 1,
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.description,
            provider: { "@id": businessId },
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      jobTitle: site.jobTitle,
      description: site.shareDescription,
      worksFor: { "@id": businessId },
      address,
      knowsAbout: skills.flatMap((s) => s.tools),
      ...(portrait ? { image: portrait } : {}),
      ...(contact.whatsapp ? { telephone: contact.whatsapp } : {}),
      ...(profiles.length ? { sameAs: profiles } : {}),
    },
    ...(faqs.length
      ? [
          {
            "@type": "FAQPage",
            "@id": `${site.url}/#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]
      : []),
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Services />
        <Skills />
        {isSectionVisible("work") ? <Work /> : null}
        <Redesign />
        <About />
        <CV />
        {isSectionVisible("process") ? <Process /> : null}
        {isSectionVisible("testimonials") ? <Testimonials /> : null}
        {isSectionVisible("faq") ? <FAQ /> : null}
        <Contact />
      </main>
      <Footer />
      <OffscreenPause />
    </>
  );
}
