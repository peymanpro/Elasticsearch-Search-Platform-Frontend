import type { Page } from '@playwright/test';

/**
 * Mock every API call the search page makes, so E2E runs do not need a
 * live backend. Tests can override an individual route after calling
 * this helper to build a specific scenario.
 */
export async function mockApiDefaults(page: Page): Promise<void> {
  await page.route('**/api/search/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        query: 'wireless',
        total: 0,
        page: 1,
        page_size: 20,
        returned: 0,
        has_more: false,
        next_cursor: null,
        hits: [],
        facets: null,
      }),
    });
  });

  await page.route('**/api/suggest/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ prefix: '', suggestions: [] }),
    });
  });

  await page.route('**/api/explain/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ matched: false, explanation: null }),
    });
  });

  await page.route('**/api/health/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'healthy',
        cluster: { name: 'test', status: 'green', number_of_nodes: 1 },
        index: { alias: 'products', points_at: 'products-v1', document_count: 5 },
      }),
    });
  });
}

/** A single-result search response for tests that need to see a card. */
export function searchResponseWithOneHit() {
  return {
    query: 'wireless',
    total: 1,
    page: 1,
    page_size: 20,
    returned: 1,
    has_more: false,
    next_cursor: null,
    hits: [
      {
        id: 'GEN-000003',
        score: 17.95,
        source: {
          sku: 'GEN-000003',
          name: 'Wireless Noise-Cancelling Headphones',
          brand: 'Sony',
          category: 'Electronics',
          description: 'Over-ear wireless headphones.',
          price: 356.42,
          currency: 'USD',
          rating: 4.2,
          availability: 'in_stock',
          tags: ['wireless', 'bluetooth'],
        },
        highlights: {
          name: ['<em>Wireless</em> Noise-Cancelling Headphones'],
        },
      },
    ],
    facets: {
      categories: [{ value: 'Electronics', count: 1 }],
      brands: [{ value: 'Sony', count: 1 }],
      availability: [{ value: 'in_stock', count: 1 }],
      price_ranges: [{ value: '250-500', count: 1 }],
    },
  };
}
