import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { DEFAULT_SUGGEST_LIMIT, MIN_QUERY_LENGTH } from '@/shared/config/search-constants';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import type { SuggestResponse } from '@/shared/api/schemas/suggest';

import { fetchSuggestions } from './suggest-api';
import { suggestKeys } from './query-keys';

interface UseSuggestOptions {
  limit?: number | undefined;
  debounceMs?: number;
}

/**
 * Fetch autocomplete suggestions for a prefix, with debouncing and
 * request cancellation.
 *
 * - The prefix is debounced before it triggers a request.
 * - TanStack Query passes an AbortSignal to the fetcher and aborts the
 *   previous request when the key changes, so a slow response for an
 *   old prefix cannot overwrite a fresh one.
 * - When `prefix` is shorter than MIN_QUERY_LENGTH or empty after
 *   trimming, the query is disabled.
 */
export function useSuggest(
  prefix: string,
  options: UseSuggestOptions = {},
): UseQueryResult<SuggestResponse, Error> {
  const { limit = DEFAULT_SUGGEST_LIMIT, debounceMs = 150 } = options;
  const trimmed = prefix.trim();
  const debounced = useDebouncedValue(trimmed, debounceMs);
  const enabled = debounced.length >= MIN_QUERY_LENGTH;

  return useQuery({
    queryKey: suggestKeys.byPrefix(debounced, limit),
    queryFn: ({ signal }) => fetchSuggestions(debounced, limit, signal),
    enabled,
  });
}
