import { z } from 'zod';

import {
  AVAILABILITY_VALUES,
  DEFAULT_PAGE_SIZE,
  MAX_OFFSET_WINDOW,
  MAX_PAGE_SIZE,
  MAX_QUERY_LENGTH,
  MAX_RATING,
  MIN_PAGE,
  MIN_PAGE_SIZE,
  MIN_QUERY_LENGTH,
  MIN_RATING,
  SORT_DIRECTIONS,
  SORT_FIELDS,
} from '@/shared/config/search-constants';

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export const SearchFiltersSchema = z
  .object({
    category: z.string().min(1).optional(),
    brand: z.string().min(1).optional(),
    availability: z.enum(AVAILABILITY_VALUES).optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().min(0).optional(),
    rating_min: z.number().min(MIN_RATING).max(MAX_RATING).optional(),
    rating_max: z.number().min(MIN_RATING).max(MAX_RATING).optional(),
  })
  .refine(
    (v) => v.price_min === undefined || v.price_max === undefined || v.price_min <= v.price_max,
    { message: 'price_min must not exceed price_max', path: ['price_min'] },
  )
  .refine(
    (v) => v.rating_min === undefined || v.rating_max === undefined || v.rating_min <= v.rating_max,
    { message: 'rating_min must not exceed rating_max', path: ['rating_min'] },
  );

export const SearchSortSchema = z.object({
  field: z.enum(SORT_FIELDS).optional(),
  direction: z.enum(SORT_DIRECTIONS).optional(),
});

/**
 * Cursor is an opaque, non-empty array of JSON values produced by the
 * backend. Its internal structure is not part of the contract.
 */
export const CursorSchema = z.array(z.unknown()).min(1);

export const SearchRequestSchema = z
  .object({
    query: z.string().min(MIN_QUERY_LENGTH).max(MAX_QUERY_LENGTH),
    page: z.number().int().min(MIN_PAGE).optional(),
    page_size: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).optional(),
    cursor: CursorSchema.optional(),
    filters: SearchFiltersSchema.optional(),
    sort: SearchSortSchema.optional(),
    include_facets: z.boolean().optional(),
  })
  .refine((v) => !(v.page !== undefined && v.cursor !== undefined), {
    message: 'cursor and page are mutually exclusive',
    path: ['cursor'],
  })
  .refine(
    (v) => {
      if (v.cursor !== undefined) return true;
      const page = v.page ?? 1;
      const pageSize = v.page_size ?? DEFAULT_PAGE_SIZE;
      return page * pageSize <= MAX_OFFSET_WINDOW;
    },
    {
      message: `page * page_size exceeds max_result_window (${MAX_OFFSET_WINDOW}); use cursor pagination`,
      path: ['page'],
    },
  );

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

// ---------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------

export const FacetBucketSchema = z.object({
  value: z.string(),
  count: z.number().int(),
});

export const FacetsSchema = z.object({
  categories: z.array(FacetBucketSchema),
  brands: z.array(FacetBucketSchema),
  availability: z.array(FacetBucketSchema),
  price_ranges: z.array(FacetBucketSchema),
});

export const HighlightMapSchema = z.record(z.string(), z.array(z.string()));

export const HitSchema = z.object({
  id: z.string(),
  score: z.number(),
  source: z.record(z.string(), z.unknown()),
  highlights: HighlightMapSchema,
});

export const SearchResponseSchema = z.object({
  query: z.string(),
  total: z.number().int(),
  page: z.number().int().nullable(),
  page_size: z.number().int(),
  returned: z.number().int(),
  has_more: z.boolean(),
  next_cursor: z.array(z.unknown()).nullable(),
  hits: z.array(HitSchema),
  facets: FacetsSchema.nullable().optional(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type SearchHit = z.infer<typeof HitSchema>;
export type FacetBucket = z.infer<typeof FacetBucketSchema>;
export type Facets = z.infer<typeof FacetsSchema>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type SearchSort = z.infer<typeof SearchSortSchema>;
