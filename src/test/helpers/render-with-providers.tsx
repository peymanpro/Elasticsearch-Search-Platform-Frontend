import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, type RenderHookResult } from '@testing-library/react';
import type { ReactNode } from 'react';

/**
 * A QueryClient tuned for tests: no retries (a failing request must
 * surface immediately), no cache persistence between tests.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });
}

interface WrapperOptions {
  client?: QueryClient;
}

/**
 * Render a hook inside a QueryClientProvider. Returns the render
 * result together with the client so a test can inspect the cache.
 */
export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  options: WrapperOptions = {},
): RenderHookResult<Result, Props> & { client: QueryClient } {
  const client = options.client ?? createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const result = renderHook<Result, Props>(hook, { wrapper });
  return { ...result, client };
}
