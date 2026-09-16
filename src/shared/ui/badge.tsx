import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-fg-muted)]',
  success: 'bg-[var(--color-accent-muted)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-accent-muted)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-accent-muted)] text-[var(--color-danger)]',
  accent: 'bg-[var(--color-accent)] text-[var(--color-accent-fg)]',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
