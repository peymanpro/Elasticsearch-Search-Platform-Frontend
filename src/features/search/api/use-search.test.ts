import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { useSearch } from '@/features/search/api/use-search';
import type { SearchParams } from '@/shared/lib/search-params';
import { renderHookWithProviders } from '@/test/helpers/render-with-providers';
import { server } from '@/test/msw/server';

const SAMPLE_RESPONSE = {
  query: 'headphones',
  total: 2,
  page: 1,
  page_size: 20,
  returned: 2,
  has_more: false,
  next_cursor: null,
  hits: [
    { id: 'SKU-1', score: 1.5, source: { sku: 'SKU-1', name: 'A' }, highlights: {} },
    { id: 'SKU-2', score: 1.2, source: { sku: 'SKU-2', name: 'B' }, highlights: {} },
  ],
};

const params: SearchParams = { q: 'headphones', page: 1 };

describe('useSearch', () => {
  it('returns the parsed response on success', async () => {
    server.use(http.post('*/api/search/', () => HttpResponse.json(SAMPLE_RESPONSE)));

    const { result } = renderHookWithProviders(() => useSearch(params));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.total).toBe(2);
    expect(result.current.data?.hits).toHaveLength(2);
  });

  it('sends the correct request body', async () => {
    let received: unknown = null;
    server.use(
      http.post('*/api/search/', async ({ request }) => {
        received = await request.json();
        return HttpResponse.json(SAMPLE_RESPONSE);
      }),
    );

    const { result } = renderHookWithProviders(() =>
      useSearch({
        q: 'monitor',
        page: 2,
        category: 'Electronics',
        price_min: 100,
        sort: { field: 'price', direction: 'asc' },
      }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(received).toEqual({
      query: 'monitor',
      page: 2,
      page_size: 20,
      include_facets: true,
      filters: { category: 'Electronics', price_min: 100 },
      sort: { field: 'price', direction: 'asc' },
    });
  });

  it('is disabled when params is null', () => {
    const { result } = renderHookWithProviders(() => useSearch(null));
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('surfaces ApiError on 400', async () => {
    server.use(
      http.post('*/api/search/', () =>
        HttpResponse.json(
          { error: { code: 'invalid_request', message: 'bad input' } },
          { status: 400 },
        ),
      ),
    );

    const { result } = renderHookWithProviders(() => useSearch(params));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('bad input');
  });
});
