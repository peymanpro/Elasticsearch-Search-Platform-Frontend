import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { HealthResponse } from '@/shared/api/schemas/health';

import { fetchHealth } from './health-api';
import { healthKeys } from './query-keys';

const HEALTH_REFETCH_INTERVAL_MS = 60_000;

/**
 * Poll the backend health endpoint every 60 seconds.
 *
 * The result is shared across the app (header badge, health page),
 * so only one poll runs at a time regardless of how many components
 * subscribe.
 */
export function useHealth(): UseQueryResult<HealthResponse, Error> {
  return useQuery({
    queryKey: healthKeys.all,
    queryFn: ({ signal }) => fetchHealth(signal),
    refetchInterval: HEALTH_REFETCH_INTERVAL_MS,
  });
}
