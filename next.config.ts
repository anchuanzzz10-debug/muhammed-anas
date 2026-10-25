import type { NextConfig } from "next";

// The one canonical address for the site. Every other host (e.g. www.) is 301-redirected here
// so search engines index a single copy. Keep in sync with `site.url` in src/content/site.ts.
const CANONICAL_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohdanaskc.in").replace(/\/$/, "");
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host;
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      {
        // www.mohdanaskc.in/anything?query → https://mohdanaskc.in/anything?query (query strings are kept)
        source: "/:path*",
        has: [{ type: "host", value: `www\\.${escapeRegex(CANONICAL_HOST)}(?::\\d+)?` }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        statusCode: 301,
      },
      // Common alternative sitemap addresses (e.g. typed into Search Console) would otherwise hit the
      // HTML 404 page, which Google reports as "sitemap is HTML". Send them to the real XML sitemap.
      ...["/sitemap", "/sitemap_index.xml", "/sitemap-index.xml", "/sitemaps.xml"].map((source) => ({
        source,
        destination: "/sitemap.xml",
        statusCode: 301 as const,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
