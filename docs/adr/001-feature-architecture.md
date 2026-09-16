# ADR-001: Hybrid Feature-Oriented Architecture

- Status: Accepted
- Date: 2026-09-16
- Phase: 2 (Architecture Guards)

## Context

Search Lens is a read-only frontend for the Elasticsearch Search Platform.
It exposes five functional areas (search, autocomplete, filters, explain,
health) and a small number of top-level routes. There is no global state,
no authentication, and no write operations.

We need an architecture that:

- keeps each functional area self-contained and testable in isolation;
- makes shared utilities explicit and prevents accidental coupling;
- stays small enough that a full Feature-Sliced Design (FSD) or
  Domain-Driven folder tree would be over-engineering;
- is enforceable by tooling, not just by convention.

## Decision

We adopt a **hybrid feature-oriented architecture**. The folder layout is:

```
src/
  app/          providers, router, config, styles
  routes/       search/, health/, about/
  features/     search/, autocomplete/, filters/, explain/, health/
    <feature>/  api/, model/, lib/, ui/
  shared/       api/, ui/, lib/, hooks/, config/, types/
  test/         msw/, fixtures/, helpers/
```

Dependency direction is strictly one-way:

```
app -> routes -> features -> shared
```

Additional rules:

- `shared` must not import from `features`, `routes`, or `app`.
- A feature must not import another feature.
- `routes` must not import from `app`.
- Production code must not import from `src/test`.

These rules are enforced by:

1. `dependency-cruiser` (`.dependency-cruiser.cjs`)
2. `eslint` flat config (`no-restricted-imports` per layer)
3. A Vitest test that runs `pnpm arch` and fails on any violation

## Alternatives Considered

- **Feature-Sliced Design (FSD).** Stronger isolation (segments, slices,
  public APIs), but its six-level hierarchy and public API index files
  add ceremony that does not pay off at this project size.
- **Layered by type** (`components/`, `hooks/`, `services/`). Familiar
  but diffuses each feature across many top-level folders, making the
  impact of a change hard to see.
- **Single flat `src/`.** No structure to enforce; guarantees eventual
  coupling.

## Consequences

Positive:

- Each feature can be read, tested, and changed in one folder.
- Import boundaries are machine-checked; violations fail CI.
- New features follow an obvious template.

Negative:

- Cross-feature reuse must be lifted to `shared`, which is deliberate
  friction: it forces a conversation before two features share code.
- `shared` can become a dumping ground if reviewers are not careful.

## Notes

- The name "hybrid" reflects that we keep a single `routes/` folder at
  the top level rather than co-locating routes inside features. This
  keeps the router tree visible in one place, which matches how
  TanStack Router declares routes.
- This ADR is revisited if the number of features exceeds roughly ten,
  or if features begin to share more than two modules.
