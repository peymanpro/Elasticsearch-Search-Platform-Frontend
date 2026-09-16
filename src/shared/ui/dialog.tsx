import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * A centered modal dialog.
 *
 * Built on the native <dialog> element so focus trapping, Escape, and
 * background inerting are handled by the browser.
 */
export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label={title}
      className={cn(
        'fixed inset-0 m-auto h-fit w-full max-w-md bg-transparent p-0',
        'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
      )}
    >
      <div
        className={cn(
          'flex flex-col rounded-[var(--radius-lg)] bg-[var(--color-surface)] text-[var(--color-fg)]',
          'shadow-[var(--shadow-lg)]',
        )}
      >
        <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-full',
              'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-fg)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
            )}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="px-4 py-3">{children}</div>
        {footer ? (
          <footer className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-4 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
