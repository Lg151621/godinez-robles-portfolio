'use client';
import Image from 'next/image';
import { useRef, useState, type FormEvent } from 'react';
import { site } from '@/data/site';
import { Arrow } from './Arrow';

export function Contact() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState('');
  function prepareBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const brief = `PROJECT INQUIRY\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nInterested in: ${data.get('service')}\n\nThe idea\n${data.get('idea')}\n`;
    if (site.email) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry from ${data.get('name')}`)}&body=${encodeURIComponent(brief)}`;
      setStatus('Your email app will open with your draft. Review it there before sending.');
    } else {
      const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'project-brief.txt';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Your project brief has been downloaded. Nothing has been sent.');
    }
  }
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
      <div className="contact-bottom">
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
        <button
          className="contact-button"
          onClick={() => {
            setStatus('');
            dialog.current?.showModal();
          }}
        >
          Start a project <Arrow diagonal />
        </button>
      </div>
      <dialog ref={dialog} className="inquiry-dialog" aria-labelledby="inquiry-title">
        <div className="mobile-menu-top">
          <span className="eyebrow">A FIRST CONVERSATION</span>
          <button
            type="button"
            className="text-button"
            onClick={() => dialog.current?.close()}
            aria-label="Close project inquiry"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <h3 id="inquiry-title">
          What are you
          <br />
          <em>thinking?</em>
        </h3>
        <p className="inquiry-intro">
          {site.email
            ? 'A few details to get the conversation started.'
            : 'Our contact details are being finalized. Create a brief you can save and share when you are ready.'}
        </p>
        <form onSubmit={prepareBrief}>
          <div className="form-pair">
            <label>
              Your name
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required maxLength={254} />
            </label>
          </div>
          <label>
            What can we help with?
            <select name="service" defaultValue="Website design">
              <option>Website design</option>
              <option>Web development</option>
              <option>Website redesign</option>
              <option>Care & maintenance</option>
              <option>Let&apos;s figure it out</option>
            </select>
          </label>
          <label>
            A little about your idea
            <textarea
              name="idea"
              rows={4}
              required
              maxLength={3000}
              placeholder="What are you building, and what should it help you achieve?"
            />
          </label>
          <button className="submit-brief" type="submit">
            {site.email ? 'Open email draft' : 'Download project brief'}
            <Arrow />
          </button>
          <p className="form-status" role="status">
            {status}
          </p>
        </form>
      </dialog>
    </section>
  );
}
