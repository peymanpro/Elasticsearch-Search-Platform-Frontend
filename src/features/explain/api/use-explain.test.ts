import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { useExplain } from '@/features/explain/api/use-explain';
import { renderHookWithProviders } from '@/test/helpers/render-with-providers';
import { server } from '@/test/msw/server';

const WAIT = { timeout: 5000 };

describe('useExplain', () => {
  it('is idle when params is null', () => {
    const { result } = renderHookWithProviders(() => useExplain(null));
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('fetches automatically when params are given', async () => {
    server.use(
      http.post('*/api/explain/', () =>
        HttpResponse.json({
          matched: true,
          explanation: { value: 1, description: 'leaf', details: [] },
        }),
      ),
    );

    const { result } = renderHookWithProviders(() =>
      useExplain({ query: 'headphones', documentId: 'SKU-1' }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, WAIT);
    expect(result.current.data?.matched).toBe(true);
    expect(result.current.data?.explanation?.value).toBe(1);
  });

  it('handles a not-matched response', async () => {
    server.use(
      http.post('*/api/explain/', () => HttpResponse.json({ matched: false, explanation: null })),
    );

    const { result } = renderHookWithProviders(() =>
      useExplain({ query: 'q', documentId: 'SKU-9' }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, WAIT);
    expect(result.current.data?.matched).toBe(false);
    expect(result.current.data?.explanation).toBeNull();
  });
});
