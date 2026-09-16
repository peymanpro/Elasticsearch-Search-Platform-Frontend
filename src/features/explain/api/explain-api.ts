import { httpRequest } from '@/shared/api/http-client';
import {
  ExplainRequestSchema,
  ExplainResponseSchema,
  type ExplainRequest,
  type ExplainResponse,
} from '@/shared/api/schemas/explain';

/**
 * POST /api/explain/
 *
 * Returns the scoring breakdown for a (query, document_id) pair.
 * A non-matching document is not an error: the response is 200 with
 * `matched: false` and `explanation: null`.
 */
export async function explainScore(
  request: ExplainRequest,
  signal: AbortSignal | undefined,
): Promise<ExplainResponse> {
  const validated = ExplainRequestSchema.parse(request);
  const raw = await httpRequest<unknown>({
    method: 'POST',
    path: '/api/explain/',
    body: validated,
    signal,
  });
  return ExplainResponseSchema.parse(raw);
}
