import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  renderHook,
  type RenderHookResult,
  type RenderResult,
} from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

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

function makeWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
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
  const result = renderHook<Result, Props>(hook, { wrapper: makeWrapper(client) });
  return { ...result, client };
}

/**
 * Render a React element inside a QueryClientProvider. Returns the
 * render result together with the client so a test can inspect the
 * cache.
 */
export function renderWithProviders(
  ui: ReactElement,
  options: WrapperOptions = {},
): RenderResult & { client: QueryClient } {
  const client = options.client ?? createTestQueryClient();
  const result = render(ui, { wrapper: makeWrapper(client) });
  return { ...result, client };
}
