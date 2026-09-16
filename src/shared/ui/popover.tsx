import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
}

/**
 * A small anchored panel that closes on outside click or Escape.
 *
 * The trigger is rendered inline; the panel is absolutely positioned
 * below the trigger. For complex positioning, this should be replaced
 * by a dedicated library, but for the cases in this app (sort menu,
 * help text) a simple anchored panel is enough.
 */
export function Popover({ open, onClose, trigger, children }: PopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger}
      {open ? (
        <div
          role="dialog"
          className={cn(
            'absolute right-0 top-full z-50 mt-2 min-w-[12rem]',
            'rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]',
            'p-2 shadow-[var(--shadow-md)]',
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
