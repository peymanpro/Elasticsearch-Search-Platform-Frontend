import { httpRequest } from '@/shared/api/http-client';
import { HealthResponseSchema, type HealthResponse } from '@/shared/api/schemas/health';

/**
 * GET /api/health/
 *
 * The HTTP status is always 200. The JSON body carries the actual
 * status: healthy, degraded, or unhealthy.
 */
export async function fetchHealth(signal: AbortSignal | undefined): Promise<HealthResponse> {
  const raw = await httpRequest<unknown>({
    method: 'GET',
    path: '/api/health/',
    signal,
  });
  return HealthResponseSchema.parse(raw);
}
