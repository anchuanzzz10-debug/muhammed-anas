import { about, contact, faqs, isSectionVisible, services, site, skills, socials } from "@/content/site";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Redesign } from "@/components/sections/Redesign";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

const personId = `${site.url}/#person`;
const profiles = socials.filter((s) => s.icon !== "whatsapp").map((s) => s.href);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      jobTitle: site.jobTitle,
      description: site.description,
      knowsAbout: skills.flatMap((s) => s.tools),
      ...(contact.email ? { email: `mailto:${contact.email}` } : {}),
      ...(about.image ? { image: `${site.url}${about.image.src}` } : {}),
      ...(contact.whatsapp ? { telephone: contact.whatsapp } : {}),
      ...(profiles.length ? { sameAs: profiles } : {}),
      makesOffer: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description, provider: { "@id": personId } },
      })),
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
        {isSectionVisible("process") ? <Process /> : null}
        {isSectionVisible("testimonials") ? <Testimonials /> : null}
        {isSectionVisible("faq") ? <FAQ /> : null}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
