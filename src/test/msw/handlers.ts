import { http, HttpResponse } from 'msw';

// Wildcard patterns so the handlers match the relative URLs the HTTP
// client produces in tests, where VITE_API_BASE_URL is unset.
export const handlers = [
  http.post('*/api/search/', () =>
    HttpResponse.json({
      query: 'test',
      total: 0,
      page: 1,
      page_size: 20,
      returned: 0,
      has_more: false,
      next_cursor: null,
      hits: [],
    }),
  ),
  http.get('*/api/suggest/', ({ request }) => {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('q') ?? '';
    return HttpResponse.json({ prefix, suggestions: [] });
  }),
  http.post('*/api/explain/', () => HttpResponse.json({ matched: false, explanation: null })),
  http.get('*/api/health/', () =>
    HttpResponse.json({
      status: 'healthy',
      cluster: { name: 'test-cluster', status: 'green', number_of_nodes: 1 },
      index: { alias: 'products', points_at: 'products-v1', document_count: 0 },
    }),
  ),
];
