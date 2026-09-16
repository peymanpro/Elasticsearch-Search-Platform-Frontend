# v0.1.0 - Search Lens

First public release.

## What this is

Search Lens is a read-only frontend for the
[Elasticsearch Search Platform](https://github.com/peymanpro/Elasticsearch-Search-Platform).
It exposes the backend's search, autocomplete, scoring explanation, and
health endpoints through a small, accessible, and fully typed UI.

## Highlights

- Full-text search with field-boosted relevance ranking.
- Faceted navigation: category, brand, availability, price range.
- Business sorting: relevance, price (both directions), rating,
  popularity, newest.
- Offset pagination with a clear range summary.
- Scoring explanation for any result, shown in a side drawer with a
  recursive tree.
- Live service health in the header and on a dedicated page.
- Dark and light themes from day one, persisted across reloads.
- The URL is the canonical state: every search is shareable and
  bookmarkable. Defaults are omitted. Cursor values never enter the URL.

## Stack

- Vite 8, React 19, TypeScript 6 (strict)
- TanStack Router (file-based), TanStack Query v5
- Zod 4 at the network boundary
- Tailwind CSS v4 (CSS-first)
- Vitest 5 + Testing Library + MSW for unit and integration tests
- Playwright for end-to-end journeys
- dependency-cruiser + ESLint for architecture enforcement

## Tests

- 245 unit and integration tests.
- 10 end-to-end journeys.
- One architecture test that runs dependency-cruiser inside Vitest.

## Architecture

Hybrid feature-oriented structure with one-way dependencies:

    app -> routes -> features -> shared

Boundaries are enforced by tooling, not convention. See
`docs/architecture.md` and the ADRs in `docs/adr/`.

## What it does not do

- The frontend never writes to the backend.
- There is no authentication (the backend is open by design).
- There is no index management UI. Reindexing is a backend command.
- There is no search-mode selector. The backend exposes one ranking
  path.

## Getting started

    pnpm install
    pnpm routes:generate
    pnpm dev

Requires Node 20.19+ and pnpm 10+. The dev server proxies `/api/*` to
`http://localhost:8000`; start the backend for full functionality.
