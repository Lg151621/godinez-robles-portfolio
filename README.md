# Godinez & Robles

An independent portfolio for Leonardo Godinez and Sevastian Robles. Created from scratch, with no Base44 code, services, account requirements, or platform-specific components.

## Run locally

Requires Node.js 22 LTS or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. To serve a production build, run `npm run build` and then `npm start`.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS 4, Framer Motion. Exact resolved versions live in `package-lock.json`. Fonts are bundled locally through `@fontsource` and `next/font/local`; browsing the site makes no requests to Google Fonts. Images are stored in this repository and optimized by Next.js. No database, authentication, analytics, or external API is needed.

## Structure

```text
src/
  app/                 Root layout, home page, global styles, favicon
  components/          Navbar, Hero, ProjectShowcase, About, Principles,
                       Services, Contact, Footer, Reveal, Arrow
  data/
    site.ts            Name, founders, navigation, contact email
    projects.ts        Typed portfolio content and optional live URLs
public/images/         Original generated sky and architecture images
tests/                Playwright browser and accessibility checks
docs/                 Art direction, asset provenance, verification notes
```

The site has one route (`/`) with anchor navigation. Server components render static sections. Client components are limited to motion, the mobile menu, and the project inquiry dialog. `globals.css` holds the shared tokens, editorial component styles, and responsive rules; tokens also work as Tailwind utility names.

## Content that needs your input

- Confirm the provisional name **Godinez & Robles**.
- Set `site.email` in `src/data/site.ts` to a verified contact address.
- Replace the two clearly labeled concept studies in `src/data/projects.ts` with actual projects. Set `liveUrl` to expose a real live-site link. The concept studies do not imply client work.
- Add approved founder portraits, personal bios, and specialties when available. No stock or generated people are presented as the founders.
- Set real site metadata and enable indexing in `src/app/layout.tsx` when ready to launch. Indexing is currently disabled because this is a content draft.

Without a contact email the inquiry form downloads a text brief and explicitly says nothing was sent. With an email configured, it opens the visitor's mail application with a draft for review. It does not silently send or store inquiries. For server delivery later, add an actual email provider and abuse protection.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium  # once, if needed
npm run test:e2e
```

The browser suite covers desktop, tablet, and mobile; valid navigation targets; no horizontal overflow; menu keyboard behavior; service disclosure; native form validation; brief download; reduced motion; and automated WCAG A/AA checks. Screenshots are saved under the ignored `test-results/` directory.

## Portability

This is a conventional Next.js project. It can run on any compatible Node.js host. No deployment has been performed. All generated assets are included locally. See `docs/design.md` and `docs/assets.md` for the visual system and source details.
