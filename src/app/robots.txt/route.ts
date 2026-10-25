import { site } from "@/content/site";

// Plain-text robots.txt served by a route handler, matching the sitemap route.
export function GET() {
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${site.url}/sitemap.xml`, ""].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
