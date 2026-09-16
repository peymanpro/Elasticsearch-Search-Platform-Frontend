import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from './query-client';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application-wide providers. Kept in one place so that `main.tsx`
 * remains a trivial bootstrap and tests can mount a component with
 * the same provider stack the app uses.
 *
 * The QueryClient is created once per Providers instance via useState,
 * so a hot reload does not throw away the cache.
 */
export function Providers({ children }: ProvidersProps) {
  const [client] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
