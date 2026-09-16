import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { useHealth } from '@/features/health/api/use-health';
import { renderHookWithProviders } from '@/test/helpers/render-with-providers';
import { server } from '@/test/msw/server';

describe('useHealth', () => {
  it('returns a healthy response', async () => {
    server.use(
      http.get('*/api/health/', () =>
        HttpResponse.json({
          status: 'healthy',
          cluster: { name: 'esp', status: 'green', number_of_nodes: 1 },
          index: { alias: 'products', points_at: 'products-v2', document_count: 42 },
        }),
      ),
    );

    const { result } = renderHookWithProviders(() => useHealth());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.status).toBe('healthy');
    expect(result.current.data?.index.document_count).toBe(42);
  });

  it('handles a degraded response with null points_at', async () => {
    server.use(
      http.get('*/api/health/', () =>
        HttpResponse.json({
          status: 'degraded',
          cluster: { name: 'esp', status: 'green', number_of_nodes: 1 },
          index: { alias: 'products', points_at: null, document_count: 0 },
        }),
      ),
    );

    const { result } = renderHookWithProviders(() => useHealth());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.status).toBe('degraded');
    expect(result.current.data?.index.points_at).toBeNull();
  });
});
