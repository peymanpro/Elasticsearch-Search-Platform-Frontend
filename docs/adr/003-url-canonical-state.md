# ADR-003: URL as Canonical State

- Status: Accepted
- Date: 2026-09-16
- Phase: 4 (URL State Model)

## Context

The search page has several independent pieces of state: the query
text, the active filters, the sort order, and the current page. Some
of it must be shareable (a reviewer can paste a URL and see the same
result), some of it must survive a page refresh, and some of it is
purely transient (which dropdown is open, what the user is currently
typing).

We need a rule for what belongs in the URL, what belongs in the
query cache, and what belongs in local component state.

## Decision

State is distributed across three places, and only three:

### URL (shareable, durable)

- `q` — submitted query text (not the draft).
- `category`, `brand`, `availability` — active filters.
- `price_min`, `price_max`, `rating_min`, `rating_max` — numeric filters.
- `sort` — as a single token `field.direction` (e.g. `price.asc`).
- `page` — 1-based page number.

### TanStack Query (server cache, not shareable)

- Search results keyed by the URL-derived SearchParams.
- Suggest results keyed by prefix + limit.
- Explain results keyed by query + document_id.
- Health results keyed by nothing (single global poll).

### Local React state (transient, never in URL)

- Draft query text in the search bar.
- Which suggestion is focused in the autocomplete dropdown.
- Explain drawer open/close and expanded nodes.
- Mobile filter sheet open/close.

## Rules

### 1. Canonical URL — defaults are omitted

The URL must contain only values that differ from the default.
Specifically:

- `page=1` is never written.
- The default sort (`score.desc`) is never written.
- Empty filter values are never written.
- The submitted query is written; the draft is not.

This makes two URLs that describe the same search string-equal, which
makes sharing deterministic and makes browser history coherent.

### 2. Cursor is never in the URL

Cursor-based pagination is a transient optimization for deep scrolling.
The canonical URL uses offset pagination only (`page`). When the user
reaches a deep page where the backend would reject the offset, the UI
uses cursor internally without changing the URL. This keeps pasted
URLs portable across sessions and machines.

### 3. `include_facets` is never in the URL

The API supports `include_facets: false` for cost-sensitive callers,
but Search Lens always requests facets. The flag is hardcoded to true
in the search adapter. It is not a user-facing setting and therefore
not URL state.

### 4. Parsing is lenient; serialization is strict

`parseSearchParams` accepts an invalid URL and returns `null`. The
route then renders an empty state instead of crashing. Serialization
is strict: it produces one canonical URL for each SearchParams value.

### 5. Invalid values are dropped, not preserved

An unknown `sort` value, an out-of-range `rating_min`, an unknown
`availability` value — all cause the parse to fail (return null).
The UI never renders a filter that the backend would reject.

## Alternatives Considered

- **Everything in the URL.** Cursor values are opaque, unbounded, and
  backend-state-dependent. Putting them in the URL makes pasted links
  brittle and breaks the canonical-URL invariant.
- **Everything in component state, nothing in the URL.** Sharing a
  search result becomes impossible; browser back/forward stops working;
  a refresh loses the search. Unacceptable for a search product.
- **Zustand or Redux for search state.** Adds a store to keep in sync
  with the URL, which is the actual source of truth. The URL is already
  a serializable store; duplicating it in memory is bookkeeping with
  no benefit.

## Consequences

Positive:

- A search is fully described by its URL. Copy, paste, share, bookmark
  all work as expected.
- Browser back/forward naturally navigates between searches.
- Refresh preserves the search.
- The query cache key is derived from the URL, so identical URLs share
  a cache entry with no extra work.

Negative:

- Draft query text needs an explicit commit step (submit or Enter)
  before it enters the URL. This is a deliberate UX choice, not a
  limitation.
- Cursor-based pagination is invisible to the URL. A user who reaches
  page 500 via cursor cannot share that exact page; they can share the
  offset page up to the `max_result_window` limit.

## Notes

- `parseSearchParams` and `serializeSearchParams` live in
  `src/shared/lib/search-params.ts` and are covered by a roundtrip test
  (`parse(serialize(p)) === p` for a representative set of inputs).
- The canonical form is tested by asserting that defaults are absent
  from the serialized `URLSearchParams`.
- `MAX_OFFSET_WINDOW` (10,000) is enforced at parse time; URLs that
  would exceed it are rejected as invalid.
