'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { hover, useAnimate, useInView } from 'framer-motion';
import { ease, timing } from '@/lib/motion';
import { useMotionSettings } from './MotionProvider';

export function RevealImage({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { once: true, amount: 0.15 });
  const { ready, reduced } = useMotionSettings();
  const played = useRef(false);
  useEffect(() => {
    if (!ready || reduced || !inView || played.current) return;
    played.current = true;
    const animation = animate(
      scope.current,
      {
        clipPath: ['inset(0 0 12% 0)', 'inset(0 0 0% 0)'],
      },
      { duration: timing.image, ease },
    );
    return () => animation.complete();
  }, [ready, reduced, inView, animate, scope]);

  useEffect(() => {
    if (!ready || reduced) return;
    const art = scope.current.closest<HTMLElement>('.project-art');
    const layer = scope.current.querySelector<HTMLElement>('.image-hover-layer');
    if (!art || !layer) return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    let animation: ReturnType<typeof animate> | undefined;
    const reset = () => {
      animation?.stop();
      layer.style.removeProperty('transform');
    };
    const cleanup = hover(art, () => {
      if (!media.matches) return;
      animation = animate(layer, { scale: 1.035 }, { duration: timing.image, ease });
      return () => {
        animation?.stop();
        animation = animate(layer, { scale: 1 }, { duration: timing.reveal, ease });
      };
    });
    media.addEventListener('change', reset);
    return () => {
      cleanup();
      media.removeEventListener('change', reset);
      reset();
    };
  }, [ready, reduced, animate, scope]);
  return (
    <div className="image-reveal" ref={scope}>
      <div className="image-hover-layer">{children}</div>
    </div>
  );
}
