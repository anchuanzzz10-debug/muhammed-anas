import type { MetadataRoute } from "next";
import { about, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: site.lastUpdated,
      changeFrequency: "monthly",
      priority: 1,
      images: [...(about.image ? [`${site.url}${about.image.src}`] : []), `${site.url}/opengraph-image`],
    },
  ];
}
