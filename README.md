# Search Lens

A read-only frontend for the
[Elasticsearch Search Platform](https://github.com/peymanpro/Elasticsearch-Search-Platform).

Search Lens exposes the platform's search, autocomplete, scoring
explanation, and health endpoints through a small, accessible, and
fully typed UI. It supports filtering, business sorting, faceted
navigation, offset pagination, and safe rendering of Elasticsearch
highlight fragments.

## Status

All planned phases are implemented. The project is at `v0.1.0`.

- 245 unit and integration tests (Vitest + Testing Library + MSW)
- 10 end-to-end journeys (Playwright)
- TypeScript strict mode (`noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`)
- Architecture enforced by dependency-cruiser, ESLint, and a Vitest
  architecture test
- Dark and light themes from day one
- WCAG 2.2 AA oriented (keyboard navigation, ARIA roles, visible focus)

## What It Does

- Full-text search across the product catalog.
- Autocomplete suggestions for a typed prefix.
- Faceted navigation: category, brand, availability, price range.
- Business sorting: relevance, price (both directions), rating,
  popularity, newest.
- Offset pagination with a clear range summary.
- Scoring explanation for any result, shown in a side drawer.
- Live service health with a header badge and a dedicated page.

## What It Does Not Do

- The frontend **never writes** to the backend. Every request is a read.
- There is no authentication. The backend is open by design.
- There is no index management UI. Reindexing is a backend command.
- There is no search-mode selector. The backend exposes one ranking path.
- Cursor values are never placed in the URL (see ADR-004).

## Search Task Coverage

This project implements a full-stack search application over a
document dataset. The requirements and where each is addressed:

| Requirement                                  | Where it lives                                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Backend: keyword search                      | `POST /api/search/` with BM25 relevance and field boosts                                     |
| Backend: at least 2 filters                  | 7 filters: category, brand, availability, price_min/max, rating_min/max                      |
| Backend: Elasticsearch (or simple DB search) | Elasticsearch 8.15.3 with custom mappings and analyzers                                      |
| Frontend: search input                       | `SearchBar` with draft state and autocomplete dropdown                                       |
| Frontend: at least 2 filters                 | `FilterPanel` (desktop sidebar, mobile drawer) with server-side facet counts                 |
| Frontend: result list                        | `ResultList` with highlighted fields and safe HTML parsing                                   |
| Data: storage design                         | JSONL dataset bulk-indexed into a physical index behind an alias                             |
| Data: index or search preparation            | Custom analyzer for stemming; `keyword` fields for filters; `text` fields for relevance      |
| Deliverable: README                          | This file plus `CONTRIBUTING.md`, `docs/architecture.md`, `docs/api-pipeline.md`, and 4 ADRs |

### About the Dataset

The dataset used in this repository is a product catalog. The choice
of dataset is orthogonal to the architecture: nothing in the pipeline
(URL state, HTTP adapter, Zod validation, view model, UI) knows what
kind of document it is carrying. The dataset is a stand-in for any
collection of entities with a text-searchable field and a handful of
filterable dimensions.

The architecture is designed to be reused with a different document
type without changes to the API contract, the URL state model, the
HTTP client, or the Zod validation layer. Four changes, all local to
the data layer, are enough:

1. **Backend domain**: replace the product document with the target
   entity type (whichever fields the new dataset carries).
2. **Elasticsearch mapping**: declare `keyword` fields for whatever
   the new filters need, and `text` fields for whatever should
   participate in relevance.
3. **Backend filters**: swap the filter set for the new dimensions.
   The filter DSL, the request shape, and the response shape do not
   change.
4. **Frontend view model**: replace the single mapper that reads the
   opaque `source` field with one that knows the new shape. The rest
   of the pipeline (search hook, result list, filter panel,
   pagination, explain drawer) is dataset-agnostic.

## Stack

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| Build tool          | Vite 8                                      |
| UI                  | React 19                                    |
| Language            | TypeScript 6 (strict)                       |
| Routing             | TanStack Router (file-based)                |
| Data                | TanStack Query v5                           |
| Validation          | Zod 4                                       |
| Styling             | Tailwind CSS v4 (CSS-first, no config file) |
| HTTP                | native `fetch` with `AbortSignal`           |
| Unit tests          | Vitest 5 + Testing Library + MSW            |
| E2E tests           | Playwright (Chromium)                       |
| Architecture guards | dependency-cruiser + ESLint flat config     |
| Package manager     | pnpm 10                                     |

## Getting Started

Requires Node 20.19+ and pnpm 10+.

```sh
pnpm install
pnpm routes:generate   # generates src/routeTree.gen.ts
pnpm dev               # http://localhost:5173
```

In development the Vite dev server proxies `/api/*` to
`http://localhost:8000`. Start the backend (the
[Elasticsearch Search Platform](https://github.com/peymanpro/Elasticsearch-Search-Platform))
so the proxy has a target. Set `VITE_API_BASE_URL` in a `.env.local`
file to point at a different origin.

## The Backend API

The frontend consumes these endpoints:

| Method | Path            | Purpose                                       |
| ------ | --------------- | --------------------------------------------- |
| `GET`  | `/`             | Service identity and coarse status            |
| `POST` | `/api/search/`  | Search with filters, sort, facets, pagination |
| `GET`  | `/api/suggest/` | Autocomplete for a prefix                     |
| `POST` | `/api/explain/` | Scoring explanation for (query, document)     |
| `GET`  | `/api/health/`  | Cluster and index health                      |

The OpenAPI schema is served by the backend at `/api/schema/`
(YAML by default; add `?format=json` for JSON). The frontend keeps a
JSON snapshot at `src/shared/api/openapi.json` and generates
TypeScript types from it.

## Commands

```sh
pnpm dev               # start the dev server
pnpm build             # type-check and build for production
pnpm preview           # preview the production build

pnpm typecheck         # tsc -b
pnpm lint              # eslint .
pnpm test              # vitest run
pnpm e2e               # playwright test
pnpm arch              # dependency-cruiser

pnpm format            # prettier --write .
pnpm format:check      # prettier --check .

pnpm routes:generate   # regenerate src/routeTree.gen.ts
pnpm fetch:schema      # refresh the OpenAPI snapshot from a running backend
pnpm generate:api-types # regenerate the TypeScript types from the snapshot
```

All four gates (`typecheck`, `lint`, `test`, `arch`) must pass before
a commit. See `CONTRIBUTING.md`.

## Architecture

The project follows a **hybrid feature-oriented** structure with one-way
dependencies:

```
app  ->  routes  ->  features  ->  shared
```

- `app/` - providers, router, app shell, theme toggle
- `routes/` - file-based route definitions (search, health, about)
- `features/` - search, autocomplete, filters, explain, health
- `shared/` - api, ui primitives, lib helpers, hooks, config, types

The boundaries are enforced by dependency-cruiser and ESLint. A route
cannot import from `app`; a feature cannot import another feature;
`shared` cannot import from `features`, `routes`, or `app`.

A full description, including a sequence diagram of a search request
and the state model, is in [`docs/architecture.md`](docs/architecture.md).

The API integration pipeline is documented in
[`docs/api-pipeline.md`](docs/api-pipeline.md).

## Testing

- **Unit and integration**: `pnpm test` (Vitest + Testing Library +
  MSW). Covers Zod schemas, the URL model, every hook, every UI
  primitive, and the architecture rule set.
- **End-to-end**: `pnpm e2e` (Playwright). Runs five user journeys
  against a Chromium browser with the API mocked at the network
  boundary, so no backend is required.

The Vitest suite contains an architecture test that runs
`pnpm arch` inside the test runner. A layer violation fails the
same command as a behavior regression.

## Documentation

- [`CONTRIBUTING.md`](CONTRIBUTING.md) - how to work on the project,
  the gate list, and the rule for backend changes that affect the
  frontend.
- [`docs/architecture.md`](docs/architecture.md) - layers, data flow,
  state model, testing strategy.
- [`docs/api-pipeline.md`](docs/api-pipeline.md) - the pipeline a
  request takes from a component to the backend and back.
- [`docs/adr/`](docs/adr/) - Architecture Decision Records:
  - [ADR-001](docs/adr/001-feature-architecture.md): hybrid
    feature-oriented architecture.
  - [ADR-002](docs/adr/002-api-typing-strategy.md): OpenAPI + Zod.
  - [ADR-003](docs/adr/003-url-canonical-state.md): URL as canonical
    state.
  - [ADR-004](docs/adr/004-cursor-pagination.md): cursor pagination
    is transient.
