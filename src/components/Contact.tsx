'use client';
import Image from 'next/image';
import { site } from '@/data/site';
import { Reveal } from './Reveal';
import { Arrow } from './Arrow';
import { useProjectInquiry } from './ProjectInquiry';

export function Contact() {
  const openInquiry = useProjectInquiry();
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <Image src="/images/dawn-sky.png" alt="" fill sizes="100vw" className="contact-image" />
      <div className="contact-shade" />
      <div className="section-topline">
        <span className="eyebrow">05 / SOMETHING GOOD STARTS HERE</span>
        <span className="eyebrow">LET&apos;S MAKE IT REAL</span>
      </div>
      <h2 id="contact-title">
        HAVE SOMETHING
        <br />
        <span>
          WORTH <em>building?</em>
        </span>
      </h2>
      <Reveal className="contact-bottom">
        <div>
          <p>
            Tell us what you have in mind.
            <br />
            We&apos;ll take it from there.
          </p>
          {site.email ? (
            <a className="email-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          ) : (
            <span className="contact-pending">
              Contact details coming soon. Start by shaping your idea.
            </span>
          )}
        </div>
        <button className="contact-button" onClick={(event) => openInquiry(event.currentTarget)}>
          Start a project <Arrow diagonal />
        </button>
      </Reveal>
    </section>
  );
}
