import { describe, expect, it } from 'vitest';

import { ApiErrorSchema } from '@/shared/api/schemas/api-error';
import { ExplainResponseSchema } from '@/shared/api/schemas/explain';
import { HealthResponseSchema } from '@/shared/api/schemas/health';
import { ServiceRootResponseSchema } from '@/shared/api/schemas/root';
import { SearchRequestSchema, SearchResponseSchema } from '@/shared/api/schemas/search';
import { SuggestResponseSchema } from '@/shared/api/schemas/suggest';
import {
  apiErrorResponseInvalidRequest,
  apiErrorResponseNoDetails,
  explainResponseMatched,
  explainResponseNotMatched,
  healthResponseDegradedNullIndex,
  healthResponseHealthy,
  searchResponseCursorBased,
  searchResponseValid,
  searchResponseWithFacets,
  serviceRootResponseValid,
  suggestResponseValid,
} from '@/test/fixtures/api-responses';

describe('SearchRequestSchema', () => {
  it('accepts the minimal valid request', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x' }).success).toBe(true);
  });

  it('rejects empty query', () => {
    expect(SearchRequestSchema.safeParse({ query: '' }).success).toBe(false);
  });

  it('rejects missing query', () => {
    expect(SearchRequestSchema.safeParse({}).success).toBe(false);
  });

  it('rejects query longer than 500 characters', () => {
    const q = 'a'.repeat(501);
    expect(SearchRequestSchema.safeParse({ query: q }).success).toBe(false);
  });

  it('accepts page=1', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x', page: 1 }).success).toBe(true);
  });

  it('rejects page=0', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x', page: 0 }).success).toBe(false);
  });

  it('rejects page_size above 100', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x', page_size: 101 }).success).toBe(false);
  });

  it('rejects page and cursor together', () => {
    const r = SearchRequestSchema.safeParse({
      query: 'x',
      page: 1,
      cursor: [1.0, 'id'],
    });
    expect(r.success).toBe(false);
  });

  it('accepts cursor without page', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x', cursor: [4.2, 'SKU-1001'] }).success).toBe(
      true,
    );
  });

  it('rejects empty cursor', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x', cursor: [] }).success).toBe(false);
  });

  it('rejects invalid sort field', () => {
    expect(SearchRequestSchema.safeParse({ query: 'x', sort: { field: 'unknown' } }).success).toBe(
      false,
    );
  });

  it('rejects invalid sort direction', () => {
    expect(
      SearchRequestSchema.safeParse({ query: 'x', sort: { direction: 'sideways' } }).success,
    ).toBe(false);
  });

  it('rejects invalid availability', () => {
    const r = SearchRequestSchema.safeParse({
      query: 'x',
      filters: { availability: 'maybe' },
    });
    expect(r.success).toBe(false);
  });

  it('rejects price_min > price_max', () => {
    const r = SearchRequestSchema.safeParse({
      query: 'x',
      filters: { price_min: 100, price_max: 10 },
    });
    expect(r.success).toBe(false);
  });

  it('rejects rating above 5', () => {
    const r = SearchRequestSchema.safeParse({
      query: 'x',
      filters: { rating_min: 5.5 },
    });
    expect(r.success).toBe(false);
  });

  it('rejects negative price', () => {
    const r = SearchRequestSchema.safeParse({
      query: 'x',
      filters: { price_min: -1 },
    });
    expect(r.success).toBe(false);
  });

  it('rejects page*page_size above 10000', () => {
    const r = SearchRequestSchema.safeParse({ query: 'x', page: 101, page_size: 100 });
    expect(r.success).toBe(false);
  });
});

describe('SearchResponseSchema', () => {
  it('accepts a valid offset-paginated response', () => {
    expect(SearchResponseSchema.safeParse(searchResponseValid).success).toBe(true);
  });

  it('accepts a cursor-based response with page=null', () => {
    expect(SearchResponseSchema.safeParse(searchResponseCursorBased).success).toBe(true);
  });

  it('accepts a response with facets', () => {
    expect(SearchResponseSchema.safeParse(searchResponseWithFacets).success).toBe(true);
  });

  it('rejects a response missing hits', () => {
    const { hits: _hits, ...rest } = searchResponseValid;
    expect(SearchResponseSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects a hit with non-numeric score', () => {
    const broken = {
      ...searchResponseValid,
      hits: [{ ...searchResponseValid.hits[0], score: 'high' }],
    };
    expect(SearchResponseSchema.safeParse(broken).success).toBe(false);
  });
});

describe('SuggestResponseSchema', () => {
  it('accepts a valid response', () => {
    expect(SuggestResponseSchema.safeParse(suggestResponseValid).success).toBe(true);
  });

  it('rejects suggestions that are not strings', () => {
    expect(SuggestResponseSchema.safeParse({ prefix: 'x', suggestions: [1, 2] }).success).toBe(
      false,
    );
  });
});

describe('ExplainResponseSchema', () => {
  it('accepts a matched response with nested details', () => {
    expect(ExplainResponseSchema.safeParse(explainResponseMatched).success).toBe(true);
  });

  it('accepts a not-matched response with null explanation', () => {
    expect(ExplainResponseSchema.safeParse(explainResponseNotMatched).success).toBe(true);
  });

  it('rejects an explanation node missing description', () => {
    const broken = {
      matched: true,
      explanation: { value: 1, details: [] },
    };
    expect(ExplainResponseSchema.safeParse(broken).success).toBe(false);
  });
});

describe('HealthResponseSchema', () => {
  it('accepts a healthy response', () => {
    expect(HealthResponseSchema.safeParse(healthResponseHealthy).success).toBe(true);
  });

  it('accepts a degraded response with null points_at', () => {
    expect(HealthResponseSchema.safeParse(healthResponseDegradedNullIndex).success).toBe(true);
  });

  it('rejects an unknown status', () => {
    const broken = { ...healthResponseHealthy, status: 'catastrophic' };
    expect(HealthResponseSchema.safeParse(broken).success).toBe(false);
  });
});

describe('ServiceRootResponseSchema', () => {
  it('accepts a valid response', () => {
    expect(ServiceRootResponseSchema.safeParse(serviceRootResponseValid).success).toBe(true);
  });

  it('rejects unhealthy status (not part of the contract)', () => {
    expect(ServiceRootResponseSchema.safeParse({ service: 'x', status: 'unhealthy' }).success).toBe(
      false,
    );
  });
});

describe('ApiErrorSchema', () => {
  it('accepts an error with details', () => {
    expect(ApiErrorSchema.safeParse(apiErrorResponseInvalidRequest).success).toBe(true);
  });

  it('accepts an error without details', () => {
    expect(ApiErrorSchema.safeParse(apiErrorResponseNoDetails).success).toBe(true);
  });

  it('rejects an error missing message', () => {
    expect(ApiErrorSchema.safeParse({ error: { code: 'x' } }).success).toBe(false);
  });
});
