'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const subscribe = () => () => {};
const subscribeReduced = (notify: () => void) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const getReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
type MotionSettings = {
  ready: boolean;
  reduced: boolean;
  lockScroll: (id: string, locked: boolean) => void;
};
const MotionContext = createContext<MotionSettings | null>(null);
export function useMotionSettings() {
  const settings = useContext(MotionContext);
  if (!settings) throw new Error('MotionProvider is required');
  return settings;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => true);
  const instance = useRef<Lenis | null>(null);
  const locks = useRef(new Set<string>());
  const lockScroll = useCallback((id: string, locked: boolean) => {
    if (locked) locks.current.add(id);
    else locks.current.delete(id);
    document.documentElement.classList.toggle('motion-dialog-open', locks.current.size > 0);
    if (locks.current.size) instance.current?.stop();
    else instance.current?.start();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const media = gsap.matchMedia();
    media.add(
      '(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const lenis = new Lenis({
          autoRaf: false,
          lerp: 0.12,
          syncTouch: false,
          anchors: true,
          stopInertiaOnNavigate: true,
          prevent: (node) => node.closest('dialog') !== null,
        });
        instance.current = lenis;
        if (locks.current.size) lenis.stop();
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        const resize = () => lenis.resize();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        ScrollTrigger.addEventListener('refresh', resize);
        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener('refresh', resize);
          lenis.off('scroll', ScrollTrigger.update);
          lenis.destroy();
          instance.current = null;
          gsap.ticker.lagSmoothing(500, 33);
        };
      },
    );
    // Fonts and image loading can move section boundaries. Coalesce refreshes;
    // never measure layout on every scroll frame.
    const refresh = gsap.delayedCall(0.12, () => ScrollTrigger.refresh()).pause();
    const scheduleRefresh = () => {
      refresh.restart(true);
    };
    let alive = true;
    void document.fonts.ready.then(() => {
      if (alive) scheduleRefresh();
    });
    document.addEventListener('load', scheduleRefresh, true);
    document.addEventListener('toggle', scheduleRefresh, true);
    window.addEventListener('pageshow', scheduleRefresh);
    scheduleRefresh();
    return () => {
      alive = false;
      refresh.kill();
      document.removeEventListener('load', scheduleRefresh, true);
      document.removeEventListener('toggle', scheduleRefresh, true);
      window.removeEventListener('pageshow', scheduleRefresh);
      media.revert();
      document.documentElement.classList.remove('motion-dialog-open');
    };
  }, [ready]);

  return (
    <MotionContext.Provider value={{ ready, reduced, lockScroll }}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}
