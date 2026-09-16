import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

export function Chip({ children, onRemove, removeLabel }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs',
        'border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-fg)]',
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? 'Remove filter'}
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded-full',
            'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-fg)]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
          )}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </span>
  );
}
