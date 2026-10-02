// Shared timing for UI motion. GSAP scroll timelines use scrubbed progress.
export const ease = [0.22, 1, 0.36, 1] as const;
export const timing = { quick: 0.25, reveal: 0.8, image: 1.15, stagger: 0.12 };
export const desktopMotion =
  '(min-width: 1024px) and (min-height: 650px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
