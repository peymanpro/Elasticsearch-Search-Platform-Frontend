import { QueryClient } from '@tanstack/react-query';

/**
 * The single QueryClient instance for the application.
 *
 * Defaults are chosen to match the policy documented in the project's
 * prompt:
 *   - staleTime: 30s. Search results stay fresh for 30 seconds; a
 *     re-mount within that window does not trigger a network request.
 *   - gcTime: 5m. Results are kept in the cache for five minutes after
 *     the last subscriber unmounts, so going back to a previous search
 *     is instant.
 *   - retry: 1. One retry on transient failure. More would slow down
 *     recovery from a genuinely down backend.
 *   - refetchOnWindowFocus: false. Search results should not silently
 *     change while the user is reading them.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
