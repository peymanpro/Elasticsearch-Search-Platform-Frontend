import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { ExplainResponse } from '@/shared/api/schemas/explain';

import { explainScore } from './explain-api';
import { explainKeys } from './query-keys';

interface UseExplainParams {
  query: string;
  documentId: string;
}

/**
 * Fetch the scoring explanation for a (query, document) pair.
 *
 * The query is disabled by default. The explain drawer calls
 * `refetch()` when the user opens it for a specific hit, so the
 * request only fires on demand, not whenever a hit appears.
 *
 * Pass `null` when no document is selected.
 */
export function useExplain(
  params: UseExplainParams | null,
): UseQueryResult<ExplainResponse, Error> {
  return useQuery({
    queryKey:
      params !== null
        ? explainKeys.byQueryAndDoc(params.query, params.documentId)
        : explainKeys.all,
    queryFn: ({ signal }) => {
      if (params === null) {
        throw new Error('useExplain called without params');
      }
      return explainScore({ query: params.query, document_id: params.documentId }, signal);
    },
    enabled: false,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
}
