import { z } from 'zod';

import {
  AVAILABILITY_VALUES,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  MAX_OFFSET_WINDOW,
  MAX_QUERY_LENGTH,
  MAX_RATING,
  MIN_PAGE,
  MIN_QUERY_LENGTH,
  MIN_RATING,
  SORT_DIRECTIONS,
  SORT_FIELDS,
  type AvailabilityValue,
  type SortDirection,
  type SortField,
} from '@/shared/config/search-constants';

/**
 * URL state model for the search page.
 *
 * The URL is the single source of truth for query, filters, sort, and
 * page. Draft query text and transient UI state live elsewhere.
 *
 * Rules (see ADR-003):
 * - `q` is required. `/search` without a query is an empty state, not
 *   a parsed SearchParams.
 * - Defaults are omitted from the serialized URL: `page=1` and the
 *   default sort (score.desc) do not appear.
 * - Cursor and `include_facets` are never part of the URL.
 */
export interface SortSelection {
  field: SortField;
  direction: SortDirection;
}

export interface SearchParams {
  q: string;
  category?: string;
  brand?: string;
  availability?: AvailabilityValue;
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  rating_max?: number;
  sort?: SortSelection;
  page: number;
}

const RawSearchParamsSchema = z.object({
  q: z.string().min(MIN_QUERY_LENGTH).max(MAX_QUERY_LENGTH),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  availability: z.enum(AVAILABILITY_VALUES).optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  rating_min: z.coerce.number().min(MIN_RATING).max(MAX_RATING).optional(),
  rating_max: z.coerce.number().min(MIN_RATING).max(MAX_RATING).optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(MIN_PAGE).optional(),
});

type RawSearchParams = z.infer<typeof RawSearchParamsSchema>;

/**
 * Parse URL search parameters into a validated SearchParams, or return
 * null when the URL does not describe a valid search.
 *
 * Returns null (rather than throwing) so a malformed URL renders as an
 * empty state instead of crashing the route.
 */
export function parseSearchParams(
  input: URLSearchParams | Record<string, string | undefined>,
): SearchParams | null {
  const cleaned = cleanInput(input);
  const parsed = RawSearchParamsSchema.safeParse(cleaned);
  if (!parsed.success) return null;

  const data: RawSearchParams = parsed.data;

  let sort: SortSelection | undefined;
  if (data.sort !== undefined) {
    const parsedSort = parseSortToken(data.sort);
    if (parsedSort === null) return null;
    sort = parsedSort;
  }

  if (
    data.price_min !== undefined &&
    data.price_max !== undefined &&
    data.price_min > data.price_max
  ) {
    return null;
  }
  if (
    data.rating_min !== undefined &&
    data.rating_max !== undefined &&
    data.rating_min > data.rating_max
  ) {
    return null;
  }

  const page = data.page ?? 1;
  if (page * DEFAULT_PAGE_SIZE > MAX_OFFSET_WINDOW) return null;

  const result: SearchParams = { q: data.q, page };
  if (data.category !== undefined) result.category = data.category;
  if (data.brand !== undefined) result.brand = data.brand;
  if (data.availability !== undefined) result.availability = data.availability;
  if (data.price_min !== undefined) result.price_min = data.price_min;
  if (data.price_max !== undefined) result.price_max = data.price_max;
  if (data.rating_min !== undefined) result.rating_min = data.rating_min;
  if (data.rating_max !== undefined) result.rating_max = data.rating_max;
  if (sort !== undefined) result.sort = sort;
  return result;
}

/**
 * Serialize SearchParams into a canonical URLSearchParams.
 *
 * Defaults (page=1, default sort) are omitted. Key order is stable so
 * that equal SearchParams always produce the same URL string.
 */
export function serializeSearchParams(params: SearchParams): URLSearchParams {
  const out = new URLSearchParams();
  out.set('q', params.q);
  if (params.category !== undefined) out.set('category', params.category);
  if (params.brand !== undefined) out.set('brand', params.brand);
  if (params.availability !== undefined) out.set('availability', params.availability);
  if (params.price_min !== undefined) out.set('price_min', String(params.price_min));
  if (params.price_max !== undefined) out.set('price_max', String(params.price_max));
  if (params.rating_min !== undefined) out.set('rating_min', String(params.rating_min));
  if (params.rating_max !== undefined) out.set('rating_max', String(params.rating_max));
  if (params.sort !== undefined && !isDefaultSort(params.sort)) {
    out.set('sort', params.sort.field + '.' + params.sort.direction);
  }
  if (params.page !== 1) {
    out.set('page', String(params.page));
  }
  return out;
}

function isDefaultSort(sort: SortSelection): boolean {
  return sort.field === 'score' && sort.direction === 'desc';
}

function parseSortToken(token: string): SortSelection | null {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) {
    const field = matchField(token);
    if (field === null) return null;
    return { field, direction: DEFAULT_SORT_DIRECTION[field] };
  }
  const field = matchField(token.slice(0, dotIndex));
  const direction = matchDirection(token.slice(dotIndex + 1));
  if (field === null || direction === null) return null;
  return { field, direction };
}

function matchField(raw: string): SortField | null {
  return (SORT_FIELDS as readonly string[]).includes(raw) ? (raw as SortField) : null;
}

function matchDirection(raw: string): SortDirection | null {
  return (SORT_DIRECTIONS as readonly string[]).includes(raw) ? (raw as SortDirection) : null;
}

function cleanInput(
  input: URLSearchParams | Record<string, string | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  const entries =
    input instanceof URLSearchParams ? Array.from(input.entries()) : Object.entries(input);
  for (const [key, value] of entries) {
    if (value === undefined) continue;
    const trimmed = value.trim();
    if (trimmed.length > 0) out[key] = trimmed;
  }
  return out;
}
