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
