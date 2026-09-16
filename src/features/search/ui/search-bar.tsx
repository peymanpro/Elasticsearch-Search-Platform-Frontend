import { useEffect, useId, useState, type FormEvent } from 'react';

import { AutoSuggest } from '@/shared/ui/auto-suggest';
import { cn } from '@/shared/lib/cn';
import { SearchIcon } from '@/shared/ui/icons';

interface SearchBarProps {
  /** The submitted query (typically from the URL). */
  query: string;
  /** Autocomplete suggestions for the current draft, if any. */
  suggestions?: string[];
  /** True while the suggestions request is in flight. */
  suggestionsLoading?: boolean;
  /** Called with the trimmed query on submit, only if it differs. */
  onSubmit: (query: string) => void;
  /** Called when the user picks a suggestion from the dropdown. */
  onSelectSuggestion?: (value: string) => void;
  /** Called with every change to the draft, so the parent can fetch suggestions. */
  onDraftChange?: (value: string) => void;
  autoFocus?: boolean;
}

/**
 * The main search input with an optional autocomplete dropdown.
 *
 * The component is presentational with respect to suggestions: the
 * caller fetches them (via useSuggest) and passes them in. The route
 * page composes this SearchBar with the autocomplete feature's hook.
 */
export function SearchBar({
  query,
  suggestions = [],
  suggestionsLoading = false,
  onSubmit,
  onSelectSuggestion,
  onDraftChange,
  autoFocus = false,
}: SearchBarProps) {
  const listboxId = useId();
  const [draft, setDraft] = useState(query);
  const [openSuggest, setOpenSuggest] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(query);
    onDraftChange?.(query);
    // onDraftChange is intentionally not a dependency: including it
    // would re-fire the sync whenever the parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const trimmed = draft.trim();
  const canSubmit = trimmed.length > 0 && trimmed !== query;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setOpenSuggest(false);
    onSubmit(trimmed);
  }

  function handleSuggestion(value: string) {
    setDraft(value);
    setOpenSuggest(false);
    onSelectSuggestion?.(value);
  }

  function handleDraftChange(next: string) {
    setDraft(next);
    onDraftChange?.(next);
  }

  const showDropdown = openSuggest && trimmed.length > 0;

  return (
    <div className="relative">
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
          onChange={(e) => {
            handleDraftChange(e.target.value);
            setOpenSuggest(true);
          }}
          onFocus={() => setOpenSuggest(true)}
          onBlur={() => {
            window.setTimeout(() => setOpenSuggest(false), 100);
          }}
          placeholder="Search products..."
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showDropdown}
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
      {showDropdown ? (
        <AutoSuggest
          suggestions={suggestions}
          loading={suggestionsLoading}
          onSelect={handleSuggestion}
          onDismiss={() => setOpenSuggest(false)}
        />
      ) : null}
    </div>
  );
}
