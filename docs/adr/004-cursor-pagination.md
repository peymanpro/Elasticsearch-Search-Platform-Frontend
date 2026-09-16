# ADR-004: Cursor Pagination Is Transient

- Status: Accepted
- Date: 2026-09-16
- Phase: 12 (Documentation)

## Context

The backend supports two pagination modes:

- **Offset** (`page` + `page_size`). Stable, shareable, but suffers
  from page drift when the index changes between requests and is
  rejected above the `max_result_window` (10,000).
- **Cursor** (`cursor` + `page_size`). Stable iteration over deep
  result sets, but the cursor value is opaque and produced by the
  backend per result set.

The two are mutually exclusive in a single request. The response
reports which mode was used: `page` is a number for offset, `null`
for cursor.

We need a rule for how cursor state relates to the URL, since the
URL is the canonical state (ADR-003).

## Decision

The canonical URL uses **offset pagination only**. The cursor never
appears in the URL, in history entries, or in shared links.

The frontend fetches cursor-based pages **only when the user reaches
a page where offset would be rejected**, and it does so silently.
The URL keeps describing the offset-addressable position that brought
the user there.

### Rules

1. `SearchParams` (the URL model) has a `page: number` field and no
   `cursor` field. The URL serializer omits `cursor` by construction.

2. When a search request would exceed `MAX_OFFSET_WINDOW`, the URL
   parser rejects the page (`parseSearchParams` returns `null`) and
   the route renders an empty state. This is deliberate: a URL that
   the backend would reject should not be presented as valid.

3. If a future iteration needs to expose cursor navigation in the UI
   (for very large result sets), the cursor would be carried in
   **transient React state** keyed to the current query, not in the
   URL. That iteration has not shipped; the rule is recorded here so
   the design stays consistent.

4. The `next_cursor` field is present in every search response, even
   for offset pagination, so the transition from offset to cursor
   requires no extra request.

## Alternatives Considered

- **Cursor in the URL.** A pasted link would carry an opaque value
  that is only meaningful against the exact index state that produced
  it. A refresh after a reindex would silently return a different
  page, or fail. The canonical-URL invariant from ADR-003 forbids
  this.
- **Cursor in a global store (Zustand/Redux).** Adds a store to keep
  in sync with the URL for a feature that does not yet exist. The
  store would also need to be cleared on every query change, which
  is exactly the kind of bookkeeping ADR-003 set out to avoid.
- **Expose both `page` and `cursor` in the URL, mutually exclusive.**
  Doubles the URL model and forces every consumer to handle two
  shapes. The backend already rejects the combination; duplicating
  that constraint in the URL model adds no capability.

## Consequences

Positive:

- Every URL Search Lens produces is offset-addressable, shareable,
  and valid against a fresh index.
- The URL model stays a single shape (`SearchParams`), which keeps
  TanStack Query keys and the browser history coherent.
- Deep pagination remains possible at the network layer without
  leaking into the UI or the URL.

Negative:

- A user who reaches page 500 via cursor navigation cannot share that
  exact page. The UI would need to be extended to support sharing a
  cursor-based position, and this ADR rejects that extension until a
  real use case appears.
- The `page` field is technically meaningless above
  `MAX_OFFSET_WINDOW`. It exists because the URL always has one, not
  because the backend accepts it.

## Notes

- The rejection of out-of-window pages happens in
  `parseSearchParams` (see `src/shared/lib/search-params.ts`), so a
  malformed URL never reaches the network.
- `MAX_OFFSET_WINDOW = 10_000` matches the backend's domain
  constraint exactly (Elasticsearch's default `max_result_window`).
- The cursor field is documented as opaque by the backend. The
  frontend never inspects it.
