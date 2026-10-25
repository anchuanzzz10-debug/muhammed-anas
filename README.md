# Muhammed Anas — Portfolio

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion

## Scripts

```bash
npm run dev     # local development
npm run lint    # ESLint
npx tsc --noEmit
npm run build   # production build
```

## Adding content

All content lives in `src/content/site.ts`. Sections render only the fields you fill in:

| Export          | Used by                         |
| --------------- | ------------------------------- |
| `site`          | SEO metadata, navbar, footer    |
| `hero`          | Hero eyebrow + tagline          |
| `services`      | Services, Skills, About, Contact select, Work filters |
| `skills`        | Skills tabs (`tools` per service) |
| `projects`      | Work grid (`category` = a service id) |
| `about`         | About text, image, stats        |
| `processSteps`  | Process timeline                |
| `testimonials`  | Testimonials carousel           |
| `faqs`          | FAQ accordion                   |
| `contact`       | Email + optional form endpoint  |
| `socials`       | Footer / contact social links   |

Set `NEXT_PUBLIC_SITE_URL` so canonical URLs, sitemap and Open Graph tags use your domain.
Project and avatar images go in `public/` (reference them as `/your-image.jpg`).

## SEO & Google Search Console

Local SEO targets **Kanhangad** and **Kasaragod** (Kerala). Location details live in `location` in
`src/content/site.ts`; the SEO title/description and the separate link-preview text live in `site`.

### Verify the site in Google Search Console

1. Open <https://search.google.com/search-console> → **Add property**.
2. Recommended: choose **Domain** → enter `mohdanaskc.in` → add the TXT record Google shows at your
   domain registrar's DNS settings → **Verify**. This covers `www`, non-`www`, `http` and `https`.
3. Alternative: choose **URL prefix** → `https://mohdanaskc.in` → **HTML tag** method → copy only the
   `content="…"` value and either paste it into `googleSiteVerification` in `src/content/site.ts`
   or set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on your host. Redeploy, then click **Verify**.

### Submit the sitemap and request indexing

1. Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**. (It's also listed in `robots.txt`.)
2. **URL Inspection** → `https://mohdanaskc.in/` → **Request indexing**.
3. Check back in a few days under **Pages** (indexing) and **Performance** (searches).

### Check the live site

```bash
npm run seo:check                     # https://mohdanaskc.in
npm run seo:check -- http://localhost:3000 --origin https://mohdanaskc.in
```

It checks status codes, noindex, canonical, title/description, local keywords, structured data,
robots.txt, sitemap.xml, the share image, the verification tag and www/http redirects.
