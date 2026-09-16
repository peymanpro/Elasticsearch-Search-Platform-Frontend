# Search Lens

A frontend for the [Elasticsearch Search Platform](https://github.com/peymanpro/Elasticsearch-Search-Platform).
Search Lens is a read-only client that exposes the platform's search,
autocomplete, scoring explanation, and health endpoints through a small,
accessible, and fully typed UI.

## Status

**Phase 1 — Repository Foundation** is complete.

Implemented so far:

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (no config file, `@tailwindcss/vite` plugin)
- ESLint (flat config) + Prettier
- Vitest 5 + Testing Library + jsdom
- Path alias `@/*` → `src/*`
- Vite dev proxy `/api` → `http://localhost:8000`

Planned (see roadmap below):

- TanStack Router
- TanStack Query v5
- Zod runtime validation
- MSW + Playwright

## The Backend

The frontend is **read-only** against the backend API and never modifies it.

- Repo: https://github.com/peymanpro/Elasticsearch-Search-Platform
- Stack: Python 3.12, Django 5.x, DRF, Elasticsearch 8.15.3
- Architecture: Clean Architecture

### Endpoints consumed

| Method | Path            | Purpose                                       |
| ------ | --------------- | --------------------------------------------- |
| GET    | `/`             | Service root                                  |
| POST   | `/api/search/`  | Search with filters, sort, facets, pagination |
| GET    | `/api/suggest/` | Autocomplete                                  |
| POST   | `/api/explain/` | Scoring explanation                           |
| GET    | `/api/health/`  | Cluster and index health                      |
| GET    | `/api/schema/`  | OpenAPI 3 schema                              |
| GET    | `/api/docs/`    | Swagger UI                                    |

The API schema is served as YAML by default; append `?format=json` for JSON.

## Development

Requires Node 20.19+ and pnpm 10+.

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # tsc -b
pnpm lint         # eslint .
pnpm format:check # prettier --check .
pnpm test         # vitest run
pnpm build        # tsc -b && vite build
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`, so the
backend must be running locally for full functionality. Set
`VITE_API_BASE_URL` in a `.env.local` file to point at a different origin.

## Roadmap

The full phase plan is tracked in the project's prompt. High level:

1. Repository foundation (done)
2. Architecture guards (dependency-cruiser + ESLint boundaries)
3. API contract layer (OpenAPI types + Zod + HTTP client)
4. URL state model
5. Data hooks (TanStack Query)
6. Design system primitives
7. Layout and routing (TanStack Router)
8. Search experience
9. Explain feature
10. Secondary pages
11. Testing strategy (MSW + Playwright)
12. Documentation
13. Quality and polish (a11y, performance, CI)
14. GitHub release
