# Contributing

Search Lens is a read-only frontend for the Elasticsearch Search
Platform. This document describes how to work on it and what a
reviewer should expect from a change.

## Ground Rules

- The frontend is **read-only** against the backend API. It never
  issues a write. Every request is a GET or a POST that produces a
  result, never a side effect.
- The backend is **not modified** for the frontend. If a change in
  the frontend requires a change in the backend, that is a finding to
  discuss, not a permission to edit.
- **English only** in the repository: code, comments, documentation,
  commit messages, README, error messages, test names. Chat with the
  maintainer may be in another language; files are always English.

## Before You Start

```
pnpm install
pnpm routes:generate   # generate src/routeTree.gen.ts
```

Node 20.19+ and pnpm 10+ are required.

## The Gates

Every commit must pass all of these. If a gate fails, the commit does
not happen. Fix the code, not the gate.

```
pnpm typecheck    # tsc -b, strict mode
pnpm lint         # eslint .
pnpm test         # vitest run
pnpm arch         # dependency-cruiser layer rules
```

`pnpm e2e` (Playwright) is not required for every commit but must
pass before a push to `main`.

### What each gate protects

- **typecheck** catches shape drift between the frontend and the
  OpenAPI schema. It runs with `strict`, `noUncheckedIndexedAccess`,
  and `exactOptionalPropertyTypes`.
- **lint** catches unused code, inconsistent imports, and (through
  `no-restricted-imports`) boundary violations before they reach
  dependency-cruiser.
- **test** catches behavior. Every hook, primitive, and route has at
  least one test.
- **arch** catches layer violations: `shared` importing from
  `features`, a feature importing another feature, a route importing
  from `app`.

## Commit Policy

- One logical change per commit.
- Commit messages follow `type: description (Phase X.Y)`:
  - `feat:` for a new capability
  - `fix:` for a bug fix
  - `test:` for test-only changes
  - `docs:` for documentation
  - `chore:` for tooling and configuration
  - `perf:` for performance work
  - `ci:` for CI
- Push after each phase completes, not after every commit.

## Backend Changes That Affect the Frontend

This is the most important rule in this document.

If a change in the backend affects **any claim** in this repository -
the README, a Zod schema, an ADR, a test fixture, a TypeScript type -
the frontend must reflect that change **in the same release**. The
change is a finding that requires a frontend update, not a silent
backend update.

Concretely:

1. The backend publishes an OpenAPI schema. Regenerate the snapshot
   and types with `pnpm fetch:schema` and `pnpm generate:api-types`.
2. Review the diff. A change in `openapi.d.ts` without a matching
   change in the corresponding Zod schema is a signal that the
   frontend and the backend have drifted.
3. If the change adds a new enum, a new filter, or a new response
   field, update:
   - `src/shared/config/search-constants.ts` (if it is a constant)
   - the relevant `src/shared/api/schemas/*.ts`
   - the URL model (`src/shared/lib/search-params.ts`) if the field
     is part of the canonical state
   - the fixtures in `src/test/fixtures/`
   - the README, if a user-facing claim changed
4. Record the reasoning in an ADR if the change is architectural, or
   in the commit message if it is mechanical.

## How the Code Is Organized

The project follows a hybrid feature-oriented architecture (ADR-001).

```
src/
  app/          providers, router, app shell, theme
  routes/       search, health, about (file-based)
  features/     search, autocomplete, filters, explain, health
    <feature>/  api/, model/, lib/, ui/
  shared/       api/, ui/, lib/, hooks/, config/, types/
  test/         msw/, fixtures/, helpers/
```

The dependency direction is one-way: `app -> routes -> features -> shared`.

## Adding a Feature

1. Create the folder under `src/features/<name>/` with `api/`, `ui/`,
   and (if needed) `model/` and `lib/`.
2. Put the HTTP adapter in `api/`. It calls `httpRequest` from
   `src/shared/api/http-client.ts` and validates the response with a
   Zod schema from `src/shared/api/schemas/`.
3. Put the TanStack Query hook in `api/` next to the adapter.
4. Put the UI in `ui/`. UI components receive data as props; they do
   not fetch.
5. If the feature needs a primitive that does not exist, add it to
   `src/shared/ui/` first.
6. Tests: adapter and hook tests with MSW; UI tests with Testing Library.
7. If the feature needs a new shared constant, add it to
   `src/shared/config/` and mirror it exactly from the backend domain.

## What Not to Add

- No `dangerouslySetInnerHTML`. Highlight fragments are parsed by the
  limited parser in `src/shared/ui/highlight.tsx`.
- No global state library. URL + TanStack Query + local React state
  is the whole state model (ADR-003).
- No `any`. If a shape is genuinely unknown, use `unknown` and a Zod
  schema at the boundary.
- No fetch outside `src/shared/api/http-client.ts`.
- No React Router. The router is TanStack Router (ADR-001).

## Pull Request Checklist

- [ ] All four gates pass locally (`typecheck`, `lint`, `test`, `arch`).
- [ ] `pnpm e2e` passes if a user-visible behavior changed.
- [ ] New code has tests.
- [ ] Commit messages follow `type: description (Phase X.Y)`.
- [ ] If the OpenAPI schema changed, `openapi.json` and
      `generated/openapi.d.ts` are updated together with the Zod
      schemas and the constants file.
- [ ] If a user-facing claim changed, the README is updated in the
      same commit or PR.
- [ ] No Persian in any file. English only.
