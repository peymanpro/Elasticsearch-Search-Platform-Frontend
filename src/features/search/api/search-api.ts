import { httpRequest } from '@/shared/api/http-client';
import {
  SearchRequestSchema,
  SearchResponseSchema,
  type SearchRequest,
  type SearchResponse,
} from '@/shared/api/schemas/search';

/**
 * POST /api/search/
 *
 * The request is validated through Zod on the way out (to catch
 * programming errors in the mapper) and the response on the way in
 * (to catch drift between the backend and the frontend contract).
 */
export async function searchProducts(
  request: SearchRequest,
  signal: AbortSignal | undefined,
): Promise<SearchResponse> {
  const validated = SearchRequestSchema.parse(request);
  const raw = await httpRequest<unknown>({
    method: 'POST',
    path: '/api/search/',
    body: validated,
    signal,
  });
  return SearchResponseSchema.parse(raw);
}
