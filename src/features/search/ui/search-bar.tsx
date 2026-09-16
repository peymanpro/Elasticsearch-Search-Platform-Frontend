import { useEffect, useState, type FormEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import { SearchIcon } from '@/shared/ui/icons';

interface SearchBarProps {
  /**
   * The submitted query (typically from the URL). Used as the initial
   * value of the draft and re-synced whenever it changes.
   */
  query: string;
  /** Called with the trimmed query on submit, only if it differs. */
  onSubmit: (query: string) => void;
  autoFocus?: boolean;
}

/**
 * The main search input.
 *
 * Holds a local draft that the user edits freely. Only on submit does
 * the trimmed value leave the component. This keeps the URL (the
 * canonical state) untouched while the user is still typing.
 *
 * The effect below is the documented React pattern for syncing an
 * external prop (the URL query) into local draft state when it changes
 * from outside the component - for example, browser back/forward or a
 * pasted share link. The draft is the source of truth while the user
 * types; the prop is the source of truth after navigation.
 */
export function SearchBar({ query, onSubmit, autoFocus = false }: SearchBarProps) {
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(query);
  }, [query]);

  const trimmed = draft.trim();
  const canSubmit = trimmed.length > 0 && trimmed !== query;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-strong)]',
        'bg-[var(--color-surface)] px-3 py-2',
        'focus-within:border-[var(--color-accent)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-accent)]',
      )}
    >
      <SearchIcon className="shrink-0 text-[var(--color-fg-muted)]" />
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        autoFocus={autoFocus}
        className={cn(
          'flex-1 bg-transparent text-sm text-[var(--color-fg)] outline-none',
          'placeholder:text-[var(--color-fg-subtle)]',
        )}
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          'inline-flex h-8 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium',
          'bg-[var(--color-accent)] text-[var(--color-accent-fg)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        Search
      </button>
    </form>
  );
}
