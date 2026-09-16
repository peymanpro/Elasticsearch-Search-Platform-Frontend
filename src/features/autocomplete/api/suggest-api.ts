import { httpRequest } from '@/shared/api/http-client';
import { SuggestResponseSchema, type SuggestResponse } from '@/shared/api/schemas/suggest';

/**
 * GET /api/suggest/?q=...&limit=...
 *
 * `limit` is optional; when omitted the backend applies its default (5).
 */
export async function fetchSuggestions(
  prefix: string,
  limit: number | undefined,
  signal: AbortSignal | undefined,
): Promise<SuggestResponse> {
  const sp = new URLSearchParams({ q: prefix });
  if (limit !== undefined) sp.set('limit', String(limit));
  const raw = await httpRequest<unknown>({
    method: 'GET',
    path: `/api/suggest/?${sp.toString()}`,
    signal,
  });
  return SuggestResponseSchema.parse(raw);
}
