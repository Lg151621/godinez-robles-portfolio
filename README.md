# VitaNova Creations

An independent portfolio for Leonardo Godinez and Sevastian Robles. Created from scratch, with no Base44 code, services, account requirements, or platform-specific components.

## Run locally

Requires Node.js 22 LTS or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. To serve a production build, run `npm run build` and then `npm start`.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS 4, Framer Motion, GSAP/ScrollTrigger, and Lenis. Exact resolved versions live in `package-lock.json`. Fonts are bundled locally through `@fontsource` and `next/font/local`; browsing the site makes no requests to Google Fonts. Images are stored in this repository and optimized by Next.js. No database, authentication, analytics, or external API is needed.

## Structure

```text
src/
  app/                 Root layout, home page, global styles, favicon
  components/          Navbar, Hero, ProjectShowcase, About, Principles,
                       Services, Contact, Footer, Reveal, Arrow
    motion/            Shared motion provider, image/text reveals, project sequence
  hooks/               Responsive project pin lifecycle
  lib/motion.ts        Shared timing, easing, and desktop eligibility
  data/
    site.ts            Name, founders, navigation, contact email
    projects.ts        Typed portfolio content and optional live URLs
public/images/         Original generated sky and architecture images
tests/                Playwright browser and accessibility checks
docs/                 Art direction, asset provenance, verification notes
```

The site has one route (`/`) with anchor navigation. Server components render static sections. Client components are limited to motion, the mobile menu, and the project inquiry dialog. `globals.css` holds the shared tokens, editorial component styles, and responsive rules; tokens also work as Tailwind utility names.

## Content that needs your input

- Brand identity: **VitaNova Creations**.
- Set `site.email` in `src/data/site.ts` to a verified contact address.
- Replace the two clearly labeled concept studies in `src/data/projects.ts` with actual projects. Set `liveUrl` to expose a real live-site link. The concept studies do not imply client work.
- Add approved founder portraits, personal bios, and specialties when available. No stock or generated people are presented as the founders.
- Set real site metadata and enable indexing in `src/app/layout.tsx` when ready to launch. Indexing is currently disabled because this is a content draft.

Both Start a project CTAs open the shared inquiry dialog. The form posts validated project details to `/api/inquiries`. Configure the server-only `INQUIRY_WEBHOOK_URL` (and optional `INQUIRY_WEBHOOK_TOKEN`) to enable delivery. Until configured, the form reports that nothing was sent and preserves the entered details. See [delivery setup](docs/project-inquiry.md).

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium  # once, if needed
npm run test:e2e
```

The browser suite covers desktop (1440px), laptop (1280px), tablet (768px), and mobile (390px); valid navigation targets; no horizontal overflow; menu keyboard behavior; service disclosure; inline inquiry validation; sending, success and error states; dialog focus and scroll locking; reduced motion; and automated WCAG A/AA checks. Full-page screenshots and failure traces are saved under the ignored `test-results/` directory. Motion-stage screenshots are currently saved in `/tmp/portfolio-motion/`.

## Motion architecture

- `MotionProvider` owns the single Lenis instance. Lenis has `autoRaf: false` and advances on the GSAP ticker; scroll updates feed ScrollTrigger. Touch devices, small screens, and reduced-motion users use native scrolling.
- Framer Motion handles the hero entrance, reusable text/image/section reveals, image hover, and native dialog entrances. Separate DOM layers prevent UI transforms from competing with GSAP scroll transforms.
- GSAP handles subtle hero parallax and Selected Work. Each fitting desktop project holds for `min(220px, 22vh)` of scrolling, without snapping. Presentations taller than the viewport minus 80px are left in normal flow. At 1280×800 this means the larger Solace presentation remains unpinned; Daybreak receives the short hold.
- Principles uses a small sequential type entrance with no pin. No cursor follower, progress overlay, or Three.js was added.
- Live reduced-motion changes remove smoothing, parallax, pins, and hover transforms. Fonts, image loading, disclosure toggles, and viewport changes refresh scroll geometry. Every custom listener, ticker callback, animation context, and delayed refresh has cleanup.
- Native dialogs retain Escape handling and focus return. Opening a dialog stops background scrolling; closing it restores scrolling.

To run tests against a separately running local build:

```sh
PORTFOLIO_TEST_URL=http://127.0.0.1:3002 npm run test:e2e
```

## Portability

This is a conventional Next.js project. It can run on any compatible Node.js host. No deployment has been performed. All generated assets are included locally. See `docs/design.md` and `docs/assets.md` for the visual system and source details.
