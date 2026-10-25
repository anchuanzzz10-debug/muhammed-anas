import { about, site } from "@/content/site";

/*
 * Hand-written sitemap (instead of app/sitemap.ts) so the response is always plain XML with the
 * right headers, and so elements follow the sitemaps.org 0.9 schema order:
 * <loc>, <lastmod>, <changefreq>, <priority>, then extensions such as <image:image>.
 */

type SitemapPage = {
  /** Path on the canonical origin, e.g. "/" or "/blog". */
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  images?: string[];
};

/**
 * Every real, indexable page. Sections like #services or #contact are parts of the home page,
 * not separate URLs, so they don't belong here. Add new routes when you create them.
 */
const pages: SitemapPage[] = [
  {
    path: "/",
    changefreq: "monthly",
    priority: 1,
    images: [...(about.image ? [about.image.src] : []), "/opengraph-image"],
  },
];

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

const absolute = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

function urlEntry(page: SitemapPage) {
  const images = (page.images ?? [])
    .map((src) => `    <image:image>\n      <image:loc>${escapeXml(absolute(src))}</image:loc>\n    </image:image>`)
    .join("\n");
  return [
    "  <url>",
    `    <loc>${escapeXml(absolute(page.path))}</loc>`,
    `    <lastmod>${site.lastUpdated}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority.toFixed(1)}</priority>`,
    ...(images ? [images] : []),
    "  </url>",
  ].join("\n");
}

export function GET() {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...pages.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
