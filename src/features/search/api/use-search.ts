import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SearchResponse } from '@/shared/api/schemas/search';
import type { SearchParams } from '@/shared/lib/search-params';

import { searchKeys } from './query-keys';
import { searchProducts } from './search-api';
import { toSearchRequest } from '../lib/to-search-request';

/**
 * Fetch a page of search results for the given URL parameters.
 *
 * Passing `null` disables the query (used when the URL is present but
 * does not describe a valid search).
 *
 * `placeholderData: keepPreviousData` keeps the previous page visible
 * while the next page is loading. Page navigation does not flash an
 * empty state.
 */
export function useSearch(params: SearchParams | null): UseQueryResult<SearchResponse, Error> {
  return useQuery({
    queryKey: params ? searchKeys.byParams(params) : searchKeys.all,
    queryFn: ({ signal }) => {
      if (params === null) {
        throw new Error('useSearch called without params');
      }
      return searchProducts(toSearchRequest(params), signal);
    },
    enabled: params !== null,
    placeholderData: keepPreviousData,
  });
}
