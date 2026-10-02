'use client';
import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { desktopMotion } from '@/lib/motion';
import { useMotionSettings } from '@/components/motion/MotionProvider';

export function useProjectSequence(scope: RefObject<HTMLDivElement | null>) {
  const { ready, reduced } = useMotionSettings();
  useEffect(() => {
    if (!ready || reduced || !scope.current) return;
    const root = scope.current;
    const media = gsap.matchMedia();
    media.add(desktopMotion, (matchContext) => {
      let context: gsap.Context | undefined;
      let alive = true;
      const images = Array.from(root.querySelectorAll<HTMLElement>('.project-scroll-image'));
      const originalStyles = images.map((image) => image.getAttribute('style'));
      const restore = () => {
        context?.revert();
        // Keep rebuilds idempotent, including preference changes during a scrub.
        images.forEach((image, index) => {
          const style = originalStyles[index];
          if (style === null) image.removeAttribute('style');
          else image.setAttribute('style', style);
        });
      };
      const build = () => {
        restore();
        context = gsap.context(() => {
          const presentations = gsap.utils.toArray<HTMLElement>('.project-presentation', root);
          // Read all sizes before setting up pins. Never measure during scrolling.
          const fits = presentations.map((node) => node.offsetHeight <= innerHeight - 80);
          presentations.forEach((presentation, index) => {
            if (!fits[index]) return;
            const image = presentation.querySelector('.project-scroll-image');
            if (!image) return;
            gsap.fromTo(
              image,
              { scale: 1.025 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  id: `project-${index + 1}`,
                  trigger: presentation,
                  start: 'top 40px',
                  end: () => `+=${Math.min(220, innerHeight * 0.22)}`,
                  pin: presentation,
                  pinSpacing: true,
                  scrub: 0.35,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        }, root);
        ScrollTrigger.refresh();
      };
      matchContext.ignore(build);
      const resize = gsap.delayedCall(0.2, () => matchContext.ignore(build)).pause();
      const schedule = () => {
        resize.restart(true);
      };
      window.addEventListener('resize', schedule);
      void document.fonts.ready.then(() => {
        if (alive) schedule();
      });
      return () => {
        alive = false;
        window.removeEventListener('resize', schedule);
        resize.kill();
        restore();
      };
    });
    return () => media.revert();
  }, [ready, reduced, scope]);
}
