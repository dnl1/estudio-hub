# EstudioHub marketing site

This repository contains only the root marketing website at `https://estudio-hub.com/`.
Application code and the MyBarber/BelaHub sites live elsewhere; do not edit sibling repositories.

## Stack and output

- Astro 7, native `.astro` components and small TypeScript browser scripts. Do not add React hydration.
- Use Node.js 24; Astro requires Node.js >=22.23.4.
- `npm run build` must produce a static `out/` directory for Azure Static Web Apps.
- `src/pages/index.astro` composes the landing page. Copy and prices live in `src/components/site-content.ts`.
- Keep the existing design, all section IDs and legacy anchors, WhatsApp demo links and application login URL.
- Keep fonts self-hosted in `public/fonts/`, screenshots in `public/produto/` and brand PNGs in `public/`.

## SEO and hosting

- Render all copy, prices, links and FAQ markup in static HTML; preserve mobile navigation without JavaScript.
- Keep one H1, production canonical/social URLs, descriptive image alts/dimensions and fact-only JSON-LD.
- Keep `public/robots.txt` and `public/sitemap.xml` aligned with public pages. Exclude the noindex 404 page.
- Keep security/cache headers in `public/staticwebapp.config.json` and `public/_headers` in sync.
- Do not loosen CSP with `unsafe-inline` or `unsafe-eval`. Keep scripts and styles external via `astro.config.mjs`.
- Only content-hashed `/_astro/` assets get immutable caching; mutable public assets must revalidate.
- The Playwright server reads the Azure config so browser tests exercise production security headers.

## Verification

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Preserve the existing browser coverage when changing components. Update focused SEO/runtime tests in
`e2e/seo.spec.ts` alongside metadata, hosting or script changes.

Design references under `docs/superpowers/` describe the earlier Next.js implementation. Their visual
and copy requirements still apply; use the Astro paths and commands above for implementation work.
