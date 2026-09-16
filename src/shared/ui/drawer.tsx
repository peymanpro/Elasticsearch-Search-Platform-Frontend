import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type DrawerSide = 'left' | 'right' | 'bottom';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title: string;
  children: ReactNode;
}

const SIDE_CLASSES: Record<DrawerSide, string> = {
  right: 'ml-auto h-full w-full max-w-md',
  left: 'mr-auto h-full w-full max-w-md',
  bottom: 'mt-auto w-full max-h-[85vh]',
};

/**
 * A modal panel that slides in from one side.
 *
 * Built on the native <dialog> element: focus trapping, Escape
 * handling, and inert background are provided by the browser, so the
 * component only wires the open/close lifecycle and layout.
 */
export function Drawer({ open, onClose, side = 'right', title, children }: DrawerProps) {
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
        'fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0',
        'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
        'open:flex open:items-stretch',
      )}
    >
      <div
        className={cn(
          'flex flex-col bg-[var(--color-surface)] text-[var(--color-fg)] shadow-[var(--shadow-lg)]',
          SIDE_CLASSES[side],
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
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </dialog>
  );
}
