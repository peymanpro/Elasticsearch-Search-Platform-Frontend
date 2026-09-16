/**
 * Canonical error shape for every failure that reaches the UI.
 *
 * The backend returns one shape for every error:
 *
 *   { "error": { "code": "...", "message": "...", "details": {...}? } }
 *
 * The frontend maps that shape (plus transport failures that never
 * reached the backend: network errors, non-JSON bodies, etc.) into a
 * single class so UI code branches on `code` rather than on the
 * details of how the request failed.
 */

export type ApiErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'backend_unavailable'
  | 'backend_timeout'
  | 'internal_error'
  | 'network_error'
  | 'unknown_error';

export interface ApiErrorOptions {
  code: ApiErrorCode;
  message: string;
  status: number;
  details?: Record<string, unknown> | undefined;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details: Record<string, unknown> | undefined;

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }
}
