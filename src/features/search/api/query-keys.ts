import { serializeSearchParams, type SearchParams } from '@/shared/lib/search-params';

/**
 * Query-key factory for the search feature.
 *
 * The search key is derived from the canonical serialized URL, so two
 * URLs that describe the same search share a cache entry. This is the
 * same canonical form the browser address bar uses, which keeps the
 * cache and the URL in agreement by construction.
 */
export const searchKeys = {
  all: ['search'] as const,
  byParams: (params: SearchParams) => ['search', serializeSearchParams(params).toString()] as const,
};
