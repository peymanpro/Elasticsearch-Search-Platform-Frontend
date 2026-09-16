# ADR-002: API Typing Strategy

- Status: Accepted
- Date: 2026-09-16
- Phase: 3 (API Contract Layer)

## Context

The frontend consumes five HTTP endpoints exposed by the backend
(the Elasticsearch Search Platform). The backend publishes an
OpenAPI 3 schema at `/api/schema/` (YAML by default, JSON with
`?format=json`).

We need a typing strategy that:

- catches drift between the frontend and the backend at compile
  time where possible, and at runtime at the network boundary
  otherwise;
- does not require hand-maintaining duplicate type definitions;
- is honest about what the OpenAPI schema actually describes: it
  declares field types, but not the closed sets the backend
  enforces in its domain layer (`sort.field`, `sort.direction`,
  `filters.availability`).

## Decision

We use two complementary layers, generated at different times:

### 1. Compile-time types from the OpenAPI schema

`openapi-typescript` generates `src/shared/api/generated/openapi.d.ts`
from a snapshot of the schema stored at `src/shared/api/openapi.json`.

The snapshot is refreshed with:

```
pnpm fetch:schema           # from a running backend
pnpm generate:api-types     # regenerate the .d.ts
```

Both files are committed to the repository. A reviewer can inspect
the generated types without running the backend; a build works offline.

The generated file is the source of truth for **wire shape**: which
fields exist, which are required, which are nullable.

### 2. Runtime validation with Zod

`src/shared/api/schemas/*.ts` declares one Zod schema per endpoint.
Each schema:

- reproduces the wire shape;
- tightens the enums the OpenAPI schema does not declare
  (`sort.field`, `sort.direction`, `filters.availability`);
- encodes cross-field rules the backend enforces in its domain
  (`page` and `cursor` are mutually exclusive, `price_min <= price_max`,
  `page * page_size <= 10_000`, `rating` within `[0, 5]`);
- is applied by the feature's API adapter, once, at the network
  boundary, before the payload reaches the UI.

The two layers intentionally overlap. The generated `.d.ts` tells the
compiler what shape to expect; the Zod schema tells the runtime what
the contract permits. Where they disagree, the Zod schema wins, and
the discrepancy is a signal that the backend and the published schema
have drifted.

### 3. Constants shared with the URL model

`src/shared/config/search-constants.ts` declares every numeric and
enumerable value that appears in more than one place: page size bounds,
`MAX_OFFSET_WINDOW`, rating range, sort fields, directions, and
availability values. This module is imported by Zod schemas, by the
URL state model, and by UI components.

## Alternatives Considered

- **Hand-written types only.** No drift detection at compile time;
  every backend change becomes a manual diff.
- **`openapi-typescript` only, no Zod.** The OpenAPI schema does not
  declare the enums or cross-field rules the backend enforces at the
  domain layer. A response with `sort.field: "unknown"` would type-check
  and fail at runtime. Zod closes that gap explicitly.
- **`openapi-zod-client` or similar generators.** Produces Zod from
  OpenAPI, but inherits the same blind spots: no enums, no cross-field
  rules. We would still hand-write the parts that matter.

## Consequences

Positive:

- The compile-time layer catches missing fields and shape changes.
- The runtime layer catches invalid values the schema does not describe.
- A stale `openapi.d.ts` shows up as a test failure, not as a bug report.
- Constants live in one place; changing `MAX_PAGE_SIZE` is a one-line
  change.

Negative:

- Two files to keep in sync when the backend changes: `openapi.json`
  and the relevant Zod schema. This is the cost of the extra strictness.
- The generated file produces noisy diffs when the backend schema
  changes; the diff is intentional review material, not noise.

## Notes

- The rule for backend changes that affect the frontend is documented
  in CONTRIBUTING.md: a backend change that affects a claim in the
  frontend README or in a Zod schema must be reflected in the same
  release, with the same reasoning recorded.
- `/api/schema/` returns YAML by default. The `fetch:schema` script
  uses `?format=json` so the snapshot is directly consumable by
  `openapi-typescript` without an intermediate YAML-to-JSON step.
