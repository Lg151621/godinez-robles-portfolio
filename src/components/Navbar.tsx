'use client';
import { useRef } from 'react';
import { navigation, site } from '@/data/site';
import { Arrow } from './Arrow';

export function Navbar() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <header className="navbar">
      <a className="wordmark" href="#top" aria-label={`${site.name} — home`}>
        godinez<span className="ampersand">&</span>robles<span className="wordmark-dot">↗</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href="#contact">
        Start a project <Arrow diagonal />
      </a>
      <button
        className="menu-toggle"
        onClick={() => dialog.current?.showModal()}
        aria-label="Open navigation"
        aria-haspopup="dialog"
      >
        <span />
        <span />
      </button>
      <dialog className="mobile-menu" ref={dialog} aria-label="Navigation">
        <div className="mobile-menu-top">
          <span className="eyebrow">GODINEZ & ROBLES</span>
          <button className="text-button" autoFocus onClick={() => dialog.current?.close()}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[...navigation, { label: 'Contact', href: '#contact' }].map((link, index) => (
            <a key={link.href} href={link.href} onClick={() => dialog.current?.close()}>
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
