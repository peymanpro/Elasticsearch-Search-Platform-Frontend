import { ApiError, type ApiErrorCode } from './api-error';

/**
 * Codes that will never succeed on retry. Retrying them wastes time
 * and delays the error message the user needs to see.
 */
const NON_RETRYABLE: ReadonlySet<ApiErrorCode> = new Set(['invalid_request', 'not_found']);

/**
 * Codes where a single retry is likely to help: a transient backend
 * failure or a dropped connection.
 */
const RETRYABLE: ReadonlySet<ApiErrorCode> = new Set([
  'backend_unavailable',
  'backend_timeout',
  'network_error',
  'internal_error',
  'unknown_error',
]);

/**
 * Default retry decision for a failed query.
 *
 * - AbortError is never retried (the caller cancelled on purpose).
 * - Known non-retryable codes are not retried.
 * - Known retryable codes are retried once.
 * - Anything else is not retried: unknown failure modes are surfaced
 *   rather than masked by retries.
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 1) return false;
  if (isAbortError(error)) return false;
  if (ApiError.isApiError(error)) {
    if (NON_RETRYABLE.has(error.code)) return false;
    if (RETRYABLE.has(error.code)) return true;
  }
  return false;
}

function isAbortError(value: unknown): boolean {
  return value instanceof DOMException && value.name === 'AbortError';
}
