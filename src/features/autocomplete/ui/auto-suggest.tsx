import { useEffect, useId, useMemo, useState } from 'react';

import { useSuggest } from '@/features/autocomplete/api/use-suggest';
import { cn } from '@/shared/lib/cn';

interface AutoSuggestProps {
  /** The current draft query in the parent input. */
  query: string;
  /** Called when the user picks a suggestion. */
  onSelect: (value: string) => void;
  /** Called when the user presses Escape. */
  onDismiss?: () => void;
}

const MAX_VISIBLE = 8;

/**
 * Suggestions dropdown for the search input.
 *
 * The search input keeps focus while the dropdown is open, so keyboard
 * events are captured at the document level for the lifetime of the
 * open dropdown. ArrowDown/ArrowUp move the focused option, Enter
 * selects, Escape dismisses.
 *
 * The focused index is clamped on read rather than reset through an
 * effect: if a fresh result set is shorter than the previous one, the
 * old index is treated as -1 without an extra render pass.
 */
export function AutoSuggest({ query, onSelect, onDismiss }: AutoSuggestProps) {
  const listboxId = useId();
  const { data, isFetching } = useSuggest(query);
  const suggestions = useMemo(
    () => (data?.suggestions ?? []).slice(0, MAX_VISIBLE),
    [data?.suggestions],
  );
  const [rawFocused, setRawFocused] = useState(-1);
  const focusedIndex = rawFocused >= suggestions.length ? -1 : rawFocused;

  useEffect(() => {
    if (suggestions.length === 0) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setRawFocused((i) => (i + 1 >= suggestions.length ? 0 : i + 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setRawFocused((i) => (i - 1 < 0 ? suggestions.length - 1 : i - 1));
      } else if (event.key === 'Enter') {
        setRawFocused((current) => {
          const clamped = current >= suggestions.length ? -1 : current;
          const value = suggestions[clamped];
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
  }, [suggestions, onSelect, onDismiss]);

  if (suggestions.length === 0) {
    return isFetching ? (
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
      {suggestions.map((suggestion, index) => (
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
