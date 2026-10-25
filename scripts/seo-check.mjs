#!/usr/bin/env node
/**
 * SEO & indexability check for the portfolio.
 *
 *   npm run seo:check                       # checks https://mohdanaskc.in
 *   npm run seo:check -- http://localhost:3000 --origin https://mohdanaskc.in
 *
 * --origin is the canonical site URL the pages should point to (defaults to the checked URL).
 * Exits with code 1 if any check fails.
 */

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "https://mohdanaskc.in").replace(/\/$/, "");
const originFlag = args.indexOf("--origin");
const origin = (originFlag >= 0 ? args[originFlag + 1] : base).replace(/\/$/, "");
const LOCAL_TERMS = ["Kanhangad", "Kasaragod", "Digital Marketing"];

let failures = 0;
let warnings = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};
const warn = (msg) => {
  warnings++;
  console.log(`  ! ${msg}`);
};
const check = (cond, pass, problem) => (cond ? ok(pass) : fail(problem));

async function get(url, init) {
  try {
    return await fetch(url, { redirect: "follow", headers: { "user-agent": "seo-check" }, ...init });
  } catch (err) {
    return { ok: false, status: 0, error: err, headers: new Headers(), text: async () => "" };
  }
}

const meta = (html, attr, key) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1];
};
const decode = (s = "") =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

console.log(`\nSEO check for ${base}${origin !== base ? ` (canonical origin ${origin})` : ""}\n`);

// ---------------------------------------------------------------- Homepage
console.log("Homepage");
const res = await get(`${base}/`);
const reason = res.error ? [res.error.message, res.error.cause?.message].filter(Boolean).join(": ") : "";
check(res.status === 200, "responds 200", `responds ${res.status}${reason ? ` (${reason})` : ""}`);
if (/redirect count exceeded/i.test(reason))
  console.log(
    "    → Redirect loop: your host probably redirects this domain to www while the app redirects www back.\n" +
      "      In your hosting dashboard, make the non-www domain primary (see README → www redirect).",
  );
const html = await res.text();
if (!html) {
  console.log("\nCould not load the page — stopping.\n");
  process.exit(1);
}

const xRobots = res.headers.get("x-robots-tag") ?? "";
check(!/noindex/i.test(xRobots), "no X-Robots-Tag noindex header", `X-Robots-Tag blocks indexing: ${xRobots}`);
const robotsMeta = meta(html, "name", "robots") ?? "";
check(
  !/noindex/i.test(robotsMeta),
  `robots meta allows indexing (${robotsMeta || "none"})`,
  `robots meta: ${robotsMeta}`,
);

const lang = html.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1];
check(Boolean(lang), `html lang="${lang}"`, "missing <html lang>");

const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1]);
check(title && title.length <= 65, `title (${title?.length} chars): ${title}`, `title missing or too long: ${title}`);
const description = decode(meta(html, "name", "description"));
check(
  description && description.length >= 70 && description.length <= 165,
  `meta description (${description?.length} chars)`,
  `meta description missing or wrong length (${description?.length ?? 0})`,
);

const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]?.match(/href=["']([^"']+)["']/i)?.[1];
check(
  canonical?.replace(/\/$/, "") === origin,
  `canonical → ${canonical}`,
  `canonical is ${canonical ?? "missing"} (expected ${origin})`,
);

const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;
check(h1s === 1, "exactly one <h1>", `${h1s} <h1> elements`);

const visible = decode(
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "),
);
for (const term of LOCAL_TERMS) {
  const n = visible.match(new RegExp(term, "gi"))?.length ?? 0;
  check(n > 0, `page text mentions "${term}" (${n}×)`, `page text never mentions "${term}"`);
}
const inTitleOrDesc = LOCAL_TERMS.slice(0, 2).every((t) => `${title} ${description}`.includes(t));
check(inTitleOrDesc, "title/description include Kanhangad and Kasaragod", "title/description miss a location");

const gsv = meta(html, "name", "google-site-verification");
if (gsv) ok("google-site-verification tag present");
else warn("no google-site-verification meta tag (fine if verified via DNS)");

// ---------------------------------------------------------------- Social preview
console.log("\nLink preview");
const ogTitle = decode(meta(html, "property", "og:title"));
const ogImage = meta(html, "property", "og:image");
check(Boolean(ogTitle), `og:title: ${ogTitle}`, "missing og:title");
check(Boolean(meta(html, "property", "og:description")), "og:description present", "missing og:description");
check(ogImage?.startsWith(origin), `og:image on ${origin}`, `og:image is ${ogImage ?? "missing"}`);
if (ogImage) {
  const img = await get(ogImage.replace(origin, base));
  check(
    img.status === 200 && (img.headers.get("content-type") ?? "").startsWith("image/"),
    "og:image loads",
    `og:image returns ${img.status} ${img.headers.get("content-type") ?? ""}`,
  );
}

// ---------------------------------------------------------------- Structured data
console.log("\nStructured data");
const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const nodes = [];
for (const raw of blocks) {
  try {
    const data = JSON.parse(raw);
    nodes.push(...(data["@graph"] ?? [data]));
  } catch {
    fail("a JSON-LD block is not valid JSON");
  }
}
const types = nodes.map((n) => n["@type"]).flat();
check(nodes.length > 0, `JSON-LD types: ${types.join(", ")}`, "no JSON-LD found");
const business = nodes.find((n) => [n["@type"]].flat().some((t) => /LocalBusiness|ProfessionalService/.test(t)));
if (business) {
  ok(`local business: ${business.name}`);
  check(
    business.address?.addressLocality,
    `address locality: ${business.address?.addressLocality}`,
    "business has no addressLocality",
  );
  check(business.telephone, `telephone: ${business.telephone}`, "business has no telephone");
  const areas = (business.areaServed ?? []).map((a) => a.name ?? a);
  check(
    LOCAL_TERMS.slice(0, 2).every((t) => areas.some((a) => String(a).includes(t))),
    `areaServed: ${areas.join(", ")}`,
    `areaServed misses Kanhangad/Kasaragod: ${areas.join(", ")}`,
  );
  const firstService = business.hasOfferCatalog?.itemListElement?.[0]?.itemOffered?.name;
  check(
    /digital marketing/i.test(firstService ?? ""),
    `first listed service: ${firstService}`,
    `first service is ${firstService}`,
  );
} else {
  fail("no LocalBusiness/ProfessionalService node");
}

// ---------------------------------------------------------------- robots.txt
console.log("\nrobots.txt");
const robots = await get(`${base}/robots.txt`);
const robotsTxt = robots.status === 200 ? await robots.text() : "";
check(robots.status === 200, "robots.txt responds 200", `robots.txt responds ${robots.status}`);
const robotsType = robots.headers.get("content-type") ?? "";
check(
  /^text\/plain/i.test(robotsType),
  `Content-Type: ${robotsType}`,
  `robots.txt Content-Type is "${robotsType}" (expected text/plain)`,
);
check(!/^\s*Disallow:\s*\/\s*$/im.test(robotsTxt), "does not block the whole site", "robots.txt contains Disallow: /");
const sitemapLine = robotsTxt.match(/^\s*Sitemap:\s*(\S+)/im)?.[1];
check(
  sitemapLine === `${origin}/sitemap.xml`,
  `Sitemap: ${sitemapLine}`,
  `Sitemap line is ${sitemapLine ?? "missing"}`,
);

// ---------------------------------------------------------------- sitemap.xml
console.log("\nsitemap.xml");
const sm = await get(`${base}/sitemap.xml`, { redirect: "manual" });
const smXml = sm.status === 200 ? await sm.text() : "";
check(
  sm.status === 200,
  "sitemap.xml responds 200 (no redirect)",
  `sitemap.xml responds ${sm.status}${sm.headers.get("location") ? ` → ${sm.headers.get("location")}` : ""}`,
);
const smType = sm.headers.get("content-type") ?? "";
check(
  /xml/i.test(smType),
  `Content-Type: ${smType}`,
  `Content-Type is "${smType}" — Google reads this as HTML, not a sitemap`,
);
const looksHtml = /<!doctype html|<html[\s>]/i.test(smXml);
check(!looksHtml, "body is not HTML", "body is an HTML page, not XML");
check(
  /^\uFEFF?<\?xml[^>]*\?>\s*<urlset[\s>]/.test(smXml) && /<\/urlset>\s*$/.test(smXml),
  "starts with <?xml …?><urlset> and closes </urlset>",
  "not a well-formed <urlset> document",
);
const entries = [...smXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const order = ["<loc>", "<lastmod>", "<changefreq>", "<priority>"];
const badOrder = entries.filter((e) => {
  const idx = order.map((t) => e.indexOf(t)).filter((i) => i >= 0);
  const firstImage = e.indexOf("<image:image>");
  return idx.some((v, i) => i > 0 && v < idx[i - 1]) || (firstImage >= 0 && idx.some((v) => v > firstImage));
});
check(
  entries.length > 0 && badOrder.length === 0,
  `${entries.length} <url> entr${entries.length === 1 ? "y" : "ies"} in schema order`,
  `${badOrder.length} <url> entries break sitemaps.org element order (loc, lastmod, changefreq, priority, then images)`,
);
const locs = [...smXml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]).replace(/\/$/, ""));
check(locs.includes(origin), `lists ${origin}`, `does not list ${origin} (found: ${locs.join(", ")})`);
const offOrigin = locs.filter((l) => !l.startsWith(origin));
check(
  offOrigin.length === 0,
  "every <loc> is on the canonical origin",
  `URLs on another host: ${offOrigin.join(", ")}`,
);
for (const loc of locs) {
  const page = await get(loc.replace(origin, base) || `${base}/`, { redirect: "manual" });
  check(page.status === 200, `${loc} → 200`, `${loc} → ${page.status} (sitemap URLs must load directly)`);
}
check(/<lastmod>/.test(smXml), `lastmod: ${smXml.match(/<lastmod>([^<]+)/)?.[1]}`, "no <lastmod>");
const imgs = [...smXml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].length;
if (imgs) ok(`${imgs} image entr${imgs === 1 ? "y" : "ies"}`);
else warn("no image entries");
// Next.js/CDN edge case: requests carrying React's navigation header must still get the XML.
const smRsc = await get(`${base}/sitemap.xml`, { headers: { "user-agent": "seo-check", RSC: "1" } });
const smRscType = smRsc.headers.get("content-type") ?? "";
check(
  smRsc.status === 200 && /xml/i.test(smRscType),
  "still XML when requested with the RSC header",
  `with the RSC header it returns ${smRsc.status} ${smRscType}`,
);

// ---------------------------------------------------------------- Host / redirects (production only)
if (/^https:\/\//.test(base) && !/localhost|127\.0\.0\.1/.test(base)) {
  console.log("\nHost & redirects");
  const host = new URL(base).host;
  const alt = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
  const r = await get(`https://${alt}/`, { redirect: "manual" });
  const loc = r.headers.get("location") ?? "";
  if (r.status === 0) warn(`https://${alt} does not resolve (fine if you don't use it)`);
  else if ([301, 308].includes(r.status) && loc.replace(/\/$/, "").startsWith(origin))
    ok(`https://${alt} → ${loc} (${r.status})`);
  else if (r.status === 200) fail(`https://${alt} serves a duplicate copy — redirect it to ${origin}`);
  else if ([302, 303, 307].includes(r.status))
    fail(`https://${alt} uses a temporary ${r.status} redirect — it should be a permanent 301`);
  else warn(`https://${alt} responds ${r.status} ${loc}`);
  const http = await get(`http://${host}/`, { redirect: "manual" });
  if ([301, 308].includes(http.status)) ok(`http:// redirects to ${http.headers.get("location")}`);
  else warn(`http:// responds ${http.status}`);
}

console.log(
  `\n${failures ? `${failures} failed` : "All checks passed"}${warnings ? `, ${warnings} warning(s)` : ""}.\n`,
);
process.exit(failures ? 1 : 0);
