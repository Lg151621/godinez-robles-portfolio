'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimate } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from './motion/MotionProvider';
import { ease, desktopMotion } from '@/lib/motion';
import { Navbar } from './Navbar';
import { Arrow } from './Arrow';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const [section, animate] = useAnimate<HTMLElement>();
  const entrance = useRef<ReturnType<typeof animate> | null>(null);
  const { ready, reduced: reducedMotion } = useMotionSettings();
  const played = useRef(false);
  const [paused, setPaused] = useState(false);
  const still = reducedMotion || paused;
  const finishEntrance = useCallback(() => {
    const controls = entrance.current;
    if (!controls) return;
    entrance.current = null;
    controls.complete();
    section.current?.removeAttribute('data-hero-entering');
  }, [section]);
  useEffect(() => {
    if (!ready || reducedMotion || played.current || window.scrollY > 40) return;
    played.current = true;
    section.current.setAttribute('data-hero-entering', '');
    const controls = animate(
      [
        ['.navbar', { opacity: [0, 1], y: [-5, 0] }, { duration: 0.6, at: 0 }],
        ['.hero-background-reveal', { opacity: [0.7, 1] }, { duration: 1.5, at: 0 }],
        ['.hero-line-content', { y: ['110%', '0%'] }, { duration: 0.95, at: 0.12 }],
        ['.hero-serif-content', { y: ['110%', '0%'] }, { duration: 1.05, at: 0.25 }],
        [
          '.hero-intro > .eyebrow, .hero-side-note-content, .hero-bottom p, .hero-baseline',
          { opacity: [0, 1] },
          { duration: 0.7, at: 0.55 },
        ],
        ['.hero-work-link', { opacity: [0, 1], y: [6, 0] }, { duration: 0.65, at: 0.85 }],
      ],
      { defaultTransition: { ease } },
    );
    entrance.current = controls;
    // The entrance is time-based; scrolling takes over only after it is composed.
    // This one-shot listener also covers native touch/keyboard scrolling.
    window.addEventListener('scroll', finishEntrance, { once: true, passive: true });
    void controls.then(() => {
      finishEntrance();
      window.removeEventListener('scroll', finishEntrance);
    });
    return () => {
      window.removeEventListener('scroll', finishEntrance);
      finishEntrance();
    };
  }, [ready, reducedMotion, animate, section, finishEntrance]);

  useEffect(() => {
    if (!ready || still) return;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add(desktopMotion, () => {
        gsap
          .timeline({
            defaults: { duration: 1, ease: 'none' },
            scrollTrigger: {
              id: 'hero-scroll',
              trigger: section.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (trigger) => {
                if (trigger.progress > 0) finishEntrance();
              },
            },
          })
          .to('.hero-image', { yPercent: 2, scale: 1.025 }, 0)
          .to('.hero-type', { y: -20, opacity: 0.85 }, 0)
          .to('.hero-intro, .hero-side-note, .hero-bottom', { opacity: 0.35 }, 0);
      });
      return () => media.revert();
    }, section);
    return () => context.revert();
  }, [ready, still, section, finishEntrance]);
  return (
    <section
      id="top"
      ref={section}
      className={`hero ${still ? 'is-still' : ''}`}
      aria-labelledby="hero-title"
    >
      <div className="hero-image">
        <div className="hero-background-reveal">
          <Image
            src="/images/dawn-sky.png"
            alt=""
            fill
            sizes="100vw"
            priority
            quality={85}
            className="sky-image"
          />
        </div>
      </div>
      <div className="hero-shade" />
      <Navbar />
      <div className="hero-intro">
        <span className="eyebrow">
          <span className="tiny-cross">+</span> INDEPENDENT DESIGN & DEVELOPMENT
        </span>
        <span className="hero-edition eyebrow">TWO MINDS. SHARED VISION.</span>
      </div>
      <div className="hero-type">
        <h1 id="hero-title">
          <span className="hero-line">
            <span className="hero-line-content">BUILT WITH</span>
          </span>
          <span className="hero-serif">
            <span className="hero-serif-content">purpose.</span>
          </span>
        </h1>
        <span className="hero-side-note eyebrow">
          <span className="hero-side-note-content">
            THOUGHTFULLY DESIGNED.
            <br />
            CAREFULLY BUILT.
          </span>
        </span>
      </div>
      <div className="hero-bottom">
        <p>
          We turn good ideas into websites
          <br className="desktop-break" /> that mean something.
        </p>
        <a className="hero-work-link" href="#work">
          Explore our work{' '}
          <span className="circle-arrow">
            <Arrow />
          </span>
        </a>
      </div>
      <div className="hero-baseline">
        <span className="eyebrow">LEONARDO GODINEZ & SEVASTIAN ROBLES</span>
        <button
          className="motion-toggle"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? 'Resume ambient motion' : 'Pause ambient motion'}
          aria-pressed={paused}
          disabled={!!reducedMotion}
        >
          {paused || reducedMotion ? (
            <span aria-hidden="true">▷</span>
          ) : (
            <span aria-hidden="true">Ⅱ</span>
          )}
        </button>
      </div>
    </section>
  );
}
