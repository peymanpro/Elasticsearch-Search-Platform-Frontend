import { useEffect, useId, useState } from 'react';

import { cn } from '@/shared/lib/cn';

interface AutoSuggestProps {
  /** The suggestions to render. Empty means the dropdown is hidden. */
  suggestions: string[];
  /** True while the request is in flight. */
  loading?: boolean;
  /** Called when the user picks a suggestion. */
  onSelect: (value: string) => void;
  /** Called when the user presses Escape or dismisses the list. */
  onDismiss?: () => void;
}

const MAX_VISIBLE = 8;

/**
 * Presentational suggestions dropdown.
 *
 * Receives the suggestions it should render. Keyboard navigation is
 * captured at the document level while open because the input keeps
 * focus. Enter selects, Escape dismisses, Arrow keys move the focused
 * option.
 */
export function AutoSuggest({
  suggestions,
  loading = false,
  onSelect,
  onDismiss,
}: AutoSuggestProps) {
  const listboxId = useId();
  const visible = suggestions.slice(0, MAX_VISIBLE);
  const [rawFocused, setRawFocused] = useState(-1);
  const focusedIndex = rawFocused >= visible.length ? -1 : rawFocused;

  useEffect(() => {
    if (visible.length === 0) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setRawFocused((i) => (i + 1 >= visible.length ? 0 : i + 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setRawFocused((i) => (i - 1 < 0 ? visible.length - 1 : i - 1));
      } else if (event.key === 'Enter') {
        setRawFocused((current) => {
          const clamped = current >= visible.length ? -1 : current;
          const value = visible[clamped];
          if (clamped >= 0 && value !== undefined) {
            event.preventDefault();
            onSelect(value);
          }
          return current;
        });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onSelect, onDismiss]);

  if (visible.length === 0) {
    return loading ? (
      <div className="px-3 py-2 text-xs text-[var(--color-fg-subtle)]">…</div>
    ) : null;
  }

  return (
    <ul
      id={listboxId}
      role="listbox"
      aria-label="Search suggestions"
      className={cn(
        'absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto',
        'rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]',
        'shadow-[var(--shadow-md)]',
      )}
    >
      {visible.map((suggestion, index) => (
        <li
          key={suggestion}
          role="option"
          aria-selected={index === focusedIndex}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(suggestion);
          }}
          onMouseEnter={() => setRawFocused(index)}
          className={cn(
            'cursor-pointer px-3 py-2 text-sm text-[var(--color-fg)]',
            index === focusedIndex && 'bg-[var(--color-surface-muted)]',
          )}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
}
