/**
 * Fixture payloads for schema tests.
 *
 * These values mirror the shapes produced by the backend API contract.
 * They are used by tests only; production code never imports them.
 */

export const searchResponseValid = {
  query: 'wireless headphones',
  total: 47,
  page: 1,
  page_size: 20,
  returned: 2,
  has_more: true,
  next_cursor: [4.2, 'SKU-1001'],
  hits: [
    {
      id: 'SKU-1001',
      score: 12.5,
      source: {
        sku: 'SKU-1001',
        name: 'Sony WH-1000XM5',
        brand: 'Sony',
        category: 'Electronics',
        price: 399.0,
        currency: 'USD',
        rating: 4.6,
        availability: 'in_stock',
        tags: ['wireless', 'anc'],
      },
      highlights: {
        name: ['<em>wireless</em> headphones'],
        description: ['Noise-cancelling <em>wireless</em> headphones'],
      },
    },
    {
      id: 'SKU-1002',
      score: 9.1,
      source: {
        sku: 'SKU-1002',
        name: 'Bose QC45',
        brand: 'Bose',
        category: 'Electronics',
        price: 329.0,
        currency: 'USD',
        rating: 4.4,
        availability: 'in_stock',
        tags: ['wireless'],
      },
      highlights: {
        name: ['<em>wireless</em>'],
      },
    },
  ],
};

export const searchResponseCursorBased = {
  query: 'wireless',
  total: 88,
  page: null,
  page_size: 20,
  returned: 1,
  has_more: true,
  next_cursor: [3.9, 'SKU-1063'],
  hits: [
    {
      id: 'SKU-1063',
      score: 3.9,
      source: { sku: 'SKU-1063', name: 'Test', brand: 'Acme', category: 'Audio' },
      highlights: {},
    },
  ],
};

export const searchResponseWithFacets = {
  query: 'wireless',
  total: 88,
  page: 1,
  page_size: 20,
  returned: 1,
  has_more: true,
  next_cursor: [3.77, 'SKU-2042'],
  hits: [
    {
      id: 'SKU-2042',
      score: 3.77,
      source: { sku: 'SKU-2042', name: 'X', brand: 'Y', category: 'Z' },
      highlights: {},
    },
  ],
  facets: {
    categories: [
      { value: 'Electronics', count: 61 },
      { value: 'Accessories', count: 27 },
    ],
    brands: [
      { value: 'Acme', count: 33 },
      { value: 'Globex', count: 21 },
    ],
    availability: [
      { value: 'in_stock', count: 72 },
      { value: 'preorder', count: 16 },
    ],
    price_ranges: [
      { value: '0-50', count: 12 },
      { value: '50-100', count: 40 },
      { value: '100-250', count: 0 },
    ],
  },
};

export const suggestResponseValid = {
  prefix: 'headph',
  suggestions: ['Wireless Noise-Cancelling Headphones', 'Wired Studio Headphones'],
};

export const explainResponseMatched = {
  matched: true,
  explanation: {
    value: 12.5,
    description: 'sum of:',
    details: [
      {
        value: 7.5,
        description: 'weight(name:wireless in 12)',
        details: [],
      },
      {
        value: 5.0,
        description: 'weight(description:headphones in 4)',
        details: [
          {
            value: 2.5,
            description: 'nested leaf',
            details: [],
          },
        ],
      },
    ],
  },
};

export const explainResponseNotMatched = {
  matched: false,
  explanation: null,
};

export const healthResponseHealthy = {
  status: 'healthy',
  cluster: { name: 'esp-cluster', status: 'green', number_of_nodes: 1 },
  index: { alias: 'products', points_at: 'products-v2', document_count: 5000 },
};

export const healthResponseDegradedNullIndex = {
  status: 'degraded',
  cluster: { name: 'esp-cluster', status: 'green', number_of_nodes: 1 },
  index: { alias: 'products', points_at: null, document_count: 0 },
};

export const serviceRootResponseValid = {
  service: 'search-lens-api',
  status: 'healthy',
};

export const apiErrorResponseInvalidRequest = {
  error: {
    code: 'invalid_request',
    message: 'page must be >= 1, got 0',
    details: { field: 'page' },
  },
};

export const apiErrorResponseNoDetails = {
  error: {
    code: 'backend_unavailable',
    message: 'the search backend is not reachable',
  },
};
