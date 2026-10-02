# Design system

## Direction

An independent creative partnership, with atmospheric photography and typography carrying the identity. The supplied screenshot informed scale, breathing room, warm light, and restrained interface treatment; no Air branding, copy, or layout was reproduced.

The first milestone was the project foundation, global styles, navigation, and hero. That viewport was visually reviewed at 1440×1000 and 390×844 before the remaining sections were implemented.

## Tokens

- Canvas: #151716
- Text: #f1eee5
- Secondary: #aaada6
- Hairline borders: translucent white
- Principles surface: #e7e5da
- Principles ink: #2b332c
- Gutters: 20–64px, responsive
- Section space: 88–170px
- Surface radius: 5–13px; circles only for compact motion/arrow controls

## Typography

- DM Sans: navigation, body, metadata, and interface
- Barlow Condensed 600: dominant uppercase statements
- Instrument Serif italic: a limited expressive accent

Fonts are self-hosted. The UI does not depend on a third-party font request.

## Motion and accessibility

The original colors, fonts, images, content, and spacing tokens are preserved. The hero has a staged entrance: navigation, background settle, masked headline lines, supporting copy, then CTA. GSAP adds a small desktop background shift and a slower headline exit.

Selected Work preserves both existing project compositions and metadata. Each presentation that fits the desktop viewport holds for at most 220px of scroll, while its image settles from 1.025× to 1×. The experience has no snap or forced navigation. Small screens, touch devices, short viewports, and reduced motion use normal document flow.

Principles stays unpinned. Its bold words and italic qualifiers enter with a 120ms stagger, 10px travel, and a small opacity change. Reusable Framer reveals share one easing curve. Images use a shallow clipping reveal and a 1.035× hover only with a fine pointer. Native menu and inquiry dialogs enter in 250ms. No new progress overlay or cursor effect competes with the composition. The hero includes a pause control. All animation and smooth scrolling respect prefers-reduced-motion. Native dialogs provide modal focus behavior and Escape handling; native details provide keyboard-operable service and project disclosures. Content remains visible without animation.

## Content honesty

The founder names were supplied by the user. Individual specialties, client records, real projects, contact details, and portraits were not supplied. The work examples are explicitly labeled concept studies; contact drafts are not transmitted without a real destination. No fictional people, client relationships, awards, metrics, or testimonials were added.
