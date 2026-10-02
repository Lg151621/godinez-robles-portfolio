'use client';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useAnimate } from 'framer-motion';
import { useMotionSettings } from './motion/MotionProvider';
import { ease, timing } from '@/lib/motion';
import { ProjectInquiryForm } from './ProjectInquiryForm';

const InquiryContext = createContext<((trigger: HTMLElement) => void) | null>(null);
export function useProjectInquiry() {
  const open = useContext(InquiryContext);
  if (!open) throw new Error('ProjectInquiryProvider is required');
  return open;
}
export function ProjectInquiryProvider({ children }: { children: ReactNode }) {
  const [dialog, animate] = useAnimate<HTMLDialogElement>();
  const { lockScroll, reduced } = useMotionSettings();
  const trigger = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const pagePosition = useRef(0);
  // The page's existing asynchronous layout refreshes can restore a different
  // scroll offset even while Lenis is stopped. Hold the captured position only
  // for this dialog; internal form scrolling remains native.
  const holdPagePosition = useCallback(() => {
    if (window.scrollY !== pagePosition.current) {
      window.scrollTo({ top: pagePosition.current, behavior: 'instant' });
    }
  }, []);
  useEffect(
    () => () => {
      window.removeEventListener('scroll', holdPagePosition);
      lockScroll('inquiry', false);
    },
    [lockScroll, holdPagePosition],
  );
  useEffect(() => {
    if (reduced && dialog.current?.open)
      animate(dialog.current, { opacity: 1, y: 0 }, { duration: 0 });
  }, [reduced, animate, dialog]);
  const open = useCallback(
    (element: HTMLElement) => {
      if (!dialog.current || dialog.current.open) return;
      trigger.current = element;
      closing.current = false;
      pagePosition.current = window.scrollY;
      lockScroll('inquiry', true);
      window.addEventListener('scroll', holdPagePosition, { passive: true });
      dialog.current.showModal();
      dialog.current.scrollTo({ top: 0, behavior: 'instant' });
      animate(
        dialog.current,
        { opacity: [0, 1], y: reduced ? [0, 0] : [10, 0] },
        { duration: reduced ? 0 : timing.quick, ease },
      );
    },
    [dialog, animate, reduced, lockScroll, holdPagePosition],
  );
  const close = async () => {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    await animate(
      dialog.current,
      { opacity: 0, y: reduced ? 0 : 6 },
      { duration: reduced ? 0 : 0.2, ease },
    );
    dialog.current?.close();
  };
  return (
    <InquiryContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="inquiry-dialog"
        aria-labelledby="inquiry-title"
        data-lenis-prevent
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          void close();
        }}
        onClose={() => {
          closing.current = false;
          window.removeEventListener('scroll', holdPagePosition);
          window.scrollTo({ top: pagePosition.current, behavior: 'instant' });
          lockScroll('inquiry', false);
          trigger.current?.focus({ preventScroll: true });
        }}
      >
        <div className="mobile-menu-top">
          <span className="eyebrow">VITANOVA CREATIONS / START A PROJECT</span>
          <button
            type="button"
            autoFocus
            className="text-button"
            onClick={() => void close()}
            aria-label="Close project inquiry"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <ProjectInquiryForm close={() => void close()} />
      </dialog>
    </InquiryContext.Provider>
  );
}
