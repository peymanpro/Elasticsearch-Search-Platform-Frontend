import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { useSuggest } from '@/features/autocomplete/api/use-suggest';
import { renderHookWithProviders } from '@/test/helpers/render-with-providers';
import { server } from '@/test/msw/server';

describe('useSuggest', () => {
  it('returns suggestions for a prefix', async () => {
    server.use(
      http.get('*/api/suggest/', ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get('q') ?? '';
        return HttpResponse.json({
          prefix: q,
          suggestions: ['Wireless Headphones', 'Wired Headphones'],
        });
      }),
    );

    const { result } = renderHookWithProviders(() => useSuggest('headph', { debounceMs: 0 }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.suggestions).toHaveLength(2);
  });

  it('is disabled for an empty prefix', () => {
    const { result } = renderHookWithProviders(() => useSuggest(''));
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('is disabled for a whitespace-only prefix', () => {
    const { result } = renderHookWithProviders(() => useSuggest('   '));
    expect(result.current.fetchStatus).toBe('idle');
  });
});
