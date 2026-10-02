'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Navbar } from './Navbar';
import { Arrow } from './Arrow';

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const still = reducedMotion || paused;
  return (
    <section
      id="top"
      ref={section}
      className={`hero ${still ? 'is-still' : ''}`}
      aria-labelledby="hero-title"
    >
      <motion.div className="hero-image" style={{ y: still ? 0 : y }}>
        <Image
          src="/images/dawn-sky.png"
          alt=""
          fill
          sizes="100vw"
          priority
          quality={85}
          className="sky-image"
        />
      </motion.div>
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
          <span className="hero-line">BUILT WITH</span>
          <span className="hero-serif">purpose.</span>
        </h1>
        <span className="hero-side-note eyebrow">
          THOUGHTFULLY DESIGNED.
          <br />
          CAREFULLY BUILT.
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
