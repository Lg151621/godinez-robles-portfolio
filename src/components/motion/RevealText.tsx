'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { useAnimate, useInView } from 'framer-motion';
import { ease, timing } from '@/lib/motion';
import { useMotionSettings } from './MotionProvider';

export function RevealText({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const inView = useInView(scope, { once: true, amount: 0.5 });
  const { ready, reduced } = useMotionSettings();
  const played = useRef(false);
  useEffect(() => {
    if (!ready || reduced || !inView || played.current) return;
    played.current = true;
    const animation = animate(
      scope.current,
      { y: [10, 0], opacity: [0.72, 1] },
      {
        duration: timing.reveal,
        delay,
        ease,
      },
    );
    return () => animation.complete();
  }, [ready, reduced, inView, delay, animate, scope]);
  // Visible in server-rendered HTML and when JavaScript/motion is unavailable.
  return (
    <span className="text-reveal" ref={scope}>
      {children}
    </span>
  );
}
