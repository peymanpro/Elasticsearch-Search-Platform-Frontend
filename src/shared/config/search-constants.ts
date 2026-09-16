/**
 * Numeric and enumerable limits shared by Zod schemas, the URL state
 * model, and UI components.
 *
 * These values mirror the backend domain constants exactly. If the
 * backend changes one of these, the frontend must change it in the
 * same release and record the change in the CHANGELOG.
 */

// Search query text.
export const MIN_QUERY_LENGTH = 1;
export const MAX_QUERY_LENGTH = 500;

// Offset pagination.
export const MIN_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 100;

// Elasticsearch default max_result_window. Requests whose
// page * page_size exceeds this are rejected by the backend.
export const MAX_OFFSET_WINDOW = 10_000;

// Rating range.
export const MIN_RATING = 0;
export const MAX_RATING = 5;

// Suggest.
export const MIN_SUGGEST_LIMIT = 1;
export const MAX_SUGGEST_LIMIT = 20;
export const DEFAULT_SUGGEST_LIMIT = 5;

// Sort values accepted by the backend domain.
export const SORT_FIELDS = ['score', 'price', 'rating', 'popularity', 'created_at'] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

// Availability values accepted by the backend domain. The backend HTTP
// layer does NOT enforce this set; the frontend does, to fail fast.
export const AVAILABILITY_VALUES = [
  'in_stock',
  'out_of_stock',
  'preorder',
  'discontinued',
] as const;
export type AvailabilityValue = (typeof AVAILABILITY_VALUES)[number];

// Default direction per sort field. Matches the backend's domain rule.
export const DEFAULT_SORT_DIRECTION: Record<SortField, SortDirection> = {
  score: 'desc',
  price: 'asc',
  rating: 'desc',
  popularity: 'desc',
  created_at: 'desc',
};
