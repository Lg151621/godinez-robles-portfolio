'use client';
import { useRef, type ReactNode } from 'react';
import { useProjectSequence } from '@/hooks/useProjectSequence';

export function ProjectSequence({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useProjectSequence(scope);
  return (
    <div className="project-list" ref={scope}>
      {children}
    </div>
  );
}
