'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { useProjectInquiry } from './ProjectInquiry';
import { navigation, site } from '@/data/site';
import { Arrow } from './Arrow';
import { useAnimate } from 'framer-motion';
import { ease, timing } from '@/lib/motion';
import { useMotionSettings } from './motion/MotionProvider';

export function Navbar() {
  const openInquiry = useProjectInquiry();
  const [dialog, animateDialog] = useAnimate<HTMLDialogElement>();
  const { lockScroll, reduced } = useMotionSettings();
  useEffect(() => {
    if (reduced && dialog.current) {
      animateDialog(dialog.current, { opacity: 1, y: 0 }, { duration: 0 });
    }
  }, [reduced, animateDialog, dialog]);
  useEffect(() => () => lockScroll('navigation', false), [lockScroll]);
  const closeDialog = () => {
    dialog.current?.close();
    lockScroll('navigation', false);
  };
  return (
    <header className="navbar">
      <a className="wordmark" href="#top" aria-label={`${site.name} — home`}>
        <Image
          src="/brand/vitanova-logo.svg"
          alt={site.name}
          width={270}
          height={32}
          unoptimized
          className="brand-logo"
        />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <button className="nav-cta" onClick={(event) => openInquiry(event.currentTarget)}>
        Start a project <Arrow diagonal />
      </button>
      <button
        className="menu-toggle"
        onClick={() => {
          dialog.current?.showModal();
          if (!reduced && dialog.current) {
            animateDialog(
              dialog.current,
              { opacity: [0.7, 1], y: [8, 0] },
              { duration: timing.quick, ease },
            );
          }
          lockScroll('navigation', true);
        }}
        aria-label="Open navigation"
        aria-haspopup="dialog"
      >
        <span />
        <span />
      </button>
      <dialog
        data-lenis-prevent
        onClose={() => lockScroll('navigation', false)}
        className="mobile-menu"
        ref={dialog}
        aria-label="Navigation"
      >
        <div className="mobile-menu-top">
          <span className="eyebrow">VITANOVA CREATIONS</span>
          <button className="text-button" autoFocus onClick={closeDialog}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[...navigation, { label: 'Contact', href: '#contact' }].map((link, index) => (
            <a key={link.href} href={link.href} onClick={closeDialog}>
              <span className="eyebrow">0{index + 1}</span>
              {link.label}
              <Arrow diagonal />
            </a>
          ))}
        </nav>
        <p>Two perspectives. One shared purpose.</p>
      </dialog>
    </header>
  );
}
