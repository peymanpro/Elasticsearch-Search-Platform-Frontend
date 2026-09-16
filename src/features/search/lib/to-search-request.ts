import type { SearchRequest } from '@/shared/api/schemas/search';
import { DEFAULT_PAGE_SIZE } from '@/shared/config/search-constants';
import type { SearchParams } from '@/shared/lib/search-params';

type Filters = NonNullable<SearchRequest['filters']>;

/**
 * Map the URL-level SearchParams to a request body the API accepts.
 *
 * Rules:
 * - `include_facets` is always true. The UI always wants facets.
 * - `page_size` is the shared default; it is not URL state.
 * - Empty filters are omitted entirely rather than sent as an empty object.
 */
export function toSearchRequest(params: SearchParams): SearchRequest {
  const filters: Filters = {};
  if (params.category !== undefined) filters.category = params.category;
  if (params.brand !== undefined) filters.brand = params.brand;
  if (params.availability !== undefined) filters.availability = params.availability;
  if (params.price_min !== undefined) filters.price_min = params.price_min;
  if (params.price_max !== undefined) filters.price_max = params.price_max;
  if (params.rating_min !== undefined) filters.rating_min = params.rating_min;
  if (params.rating_max !== undefined) filters.rating_max = params.rating_max;

  const request: SearchRequest = {
    query: params.q,
    page: params.page,
    page_size: DEFAULT_PAGE_SIZE,
    include_facets: true,
  };

  if (Object.keys(filters).length > 0) {
    request.filters = filters;
  }
  if (params.sort !== undefined) {
    request.sort = params.sort;
  }
  return request;
}
