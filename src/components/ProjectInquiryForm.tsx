'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Arrow } from './Arrow';
import {
  budgets,
  timelines,
  projectTypes,
  parseInquiry,
  type InquiryErrors,
  type ProjectInquiry,
} from '@/lib/inquiry';

export function ProjectInquiryForm({ close }: { close: () => void }) {
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  const success = useRef<HTMLHeadingElement | null>(null);
  const deliveryError = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (error) deliveryError.current?.focus();
  }, [error]);
  useEffect(() => {
    if (status === 'success') success.current?.focus();
  }, [status]);
  function focusError(form: HTMLFormElement, fields: InquiryErrors) {
    const key = Object.keys(fields)[0];
    form.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const { inquiry, errors: validation } = parseInquiry({
      ...Object.fromEntries(data),
      projectTypes: data.getAll('projectTypes'),
    });
    setErrors(validation);
    setError('');
    if (Object.keys(validation).length) {
      focusError(form, validation);
      return;
    }
    setStatus('sending');
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (result.errors) {
          setErrors(result.errors);
          focusError(form, result.errors);
        }
        throw new Error(result.error || 'Please check the highlighted fields and try again.');
      }
      setStatus('success');
    } catch (failure) {
      setStatus('idle');
      setError(
        failure instanceof Error && failure.name !== 'AbortError'
          ? failure.message
          : 'We could not confirm delivery. Please try again. Your details are still here.',
      );
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
    }
  }
  const description = (name: keyof ProjectInquiry) => (errors[name] ? `${name}-error` : undefined);
  const message = (name: keyof ProjectInquiry) =>
    errors[name] ? (
      <span className="inquiry-field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  if (status === 'success')
    return (
      <div className="inquiry-success" role="status">
        <span className="eyebrow">A GOOD BEGINNING</span>
        <h3 ref={success} tabIndex={-1} id="inquiry-title">
          Inquiry <em>received.</em>
        </h3>
        <p>
          Thanks for reaching out to VitaNova Creations. We&apos;ll review your project details and
          get back to you soon.
        </p>
        <button className="submit-brief" onClick={close}>
          Return to the site <Arrow />
        </button>
        <button
          className="text-button"
          onClick={() => {
            setStatus('idle');
            setErrors({});
            setError('');
          }}
        >
          Start another inquiry
        </button>
      </div>
    );
  return (
    <>
      <h3 id="inquiry-title">
        Tell us what
        <br />
        you&apos;re <em>building.</em>
      </h3>
      <p className="inquiry-intro">
        We&apos;d love to hear about your idea and what you hope to create. Give us a little context
        and we&apos;ll take it from there.
      </p>
      <form
        noValidate
        onSubmit={submit}
        aria-busy={status === 'sending'}
        onChange={(event) => {
          const target = event.target;
          if (!(
            target instanceof HTMLInputElement ||
            target instanceof HTMLSelectElement ||
            target instanceof HTMLTextAreaElement
          ))
            return;
          const name = target.name as keyof ProjectInquiry;
          if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }));
        }}
      >
        <fieldset className="inquiry-fields" disabled={status === 'sending'}>
          <label>
            Your name <span className="sr-only">(required)</span>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Leonardo Godinez"
              aria-invalid={!!errors.name}
              aria-describedby={description('name')}
            />
            {message('name')}
          </label>
          <label>
            Email <span className="sr-only">(required)</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={description('email')}
            />
            {message('email')}
          </label>
          <label>
            Business or organization <span className="inquiry-optional">Optional</span>
            <input
              name="business"
              autoComplete="organization"
              maxLength={150}
              placeholder="VitaNova Creations"
              aria-invalid={!!errors.business}
              aria-describedby={description('business')}
            />
            {message('business')}
          </label>
          <label>
            Current website or social <span className="inquiry-optional">Optional</span>
            <input
              name="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              maxLength={500}
              placeholder="Your website or social profile"
              aria-invalid={!!errors.website}
              aria-describedby={description('website')}
            />
            {message('website')}
          </label>
          <fieldset className="inquiry-types" aria-describedby={description('projectTypes')}>
            <legend>
              Project type <span className="inquiry-optional">Choose one or more</span>
            </legend>
            <div className="inquiry-options">
              {projectTypes.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    name="projectTypes"
                    value={type}
                    aria-invalid={!!errors.projectTypes}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            {message('projectTypes')}
          </fieldset>
          <label>
            What are you hoping to build? <span className="sr-only">(required)</span>
            <textarea
              name="goal"
              required
              rows={5}
              maxLength={5000}
              placeholder="Tell us what you want to build and what you want the website to accomplish."
              aria-invalid={!!errors.goal}
              aria-describedby={description('goal')}
            />
            {message('goal')}
          </label>
          <label>
            Estimated budget <span className="sr-only">(required)</span>
            <select
              name="budget"
              required
              defaultValue=""
              aria-invalid={!!errors.budget}
              aria-describedby={description('budget')}
            >
              <option value="" disabled>
                Select a range
              </option>
              {budgets.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            {message('budget')}
          </label>
          <label>
            Ideal timeline <span className="sr-only">(required)</span>
            <select
              name="timeline"
              required
              defaultValue=""
              aria-invalid={!!errors.timeline}
              aria-describedby={description('timeline')}
            >
              <option value="" disabled>
                Select a timeline
              </option>
              {timelines.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            {message('timeline')}
          </label>
          <label>
            Anything else we should know? <span className="inquiry-optional">Optional</span>
            <textarea
              name="details"
              rows={3}
              maxLength={5000}
              placeholder="Features, inspiration, deadlines, or anything else that matters."
              aria-invalid={!!errors.details}
              aria-describedby={description('details')}
            />
            {message('details')}
          </label>
        </fieldset>
        <p className="inquiry-note">
          Your details are used only to respond to your project inquiry.
        </p>
        <button className="submit-brief" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending your inquiry…' : 'Send Project Inquiry'}
          <Arrow />
        </button>
        {status === 'sending' && (
          <p className="form-status" role="status">
            Sending your project details. Please wait.
          </p>
        )}
        {error && (
          <p
            ref={deliveryError}
            tabIndex={-1}
            className="form-status inquiry-field-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </form>
    </>
  );
}
