import { ApiError, type ApiErrorCode } from './api-error';

/**
 * Empty in development so that requests go through the Vite dev proxy
 * (`/api/*` -> `http://localhost:8000`). In production it is set from
 * the build environment to point at the public API origin.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST';
  path: string;
  body?: unknown;
  signal?: AbortSignal | undefined;
}

/**
 * Perform an HTTP request against the Search Lens API and return the
 * parsed JSON body typed as `T`.
 *
 * The caller is responsible for the `T`; runtime validation is done
 * one layer up (Zod schemas in each feature's `api/` folder).
 */
export async function httpRequest<T>(options: HttpRequestOptions): Promise<T> {
  const url = `${API_BASE_URL}${options.path}`;
  const hasBody = options.body !== undefined;

  const init: RequestInit = {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    },
  };

  if (hasBody) {
    init.body = JSON.stringify(options.body);
  }
  if (options.signal !== undefined) {
    init.signal = options.signal;
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    if (isAbortError(err)) {
      throw err;
    }
    throw new ApiError({
      code: 'network_error',
      message: 'Could not reach the server.',
      status: 0,
      cause: err,
    });
  }

  const raw = await response.text();
  const payload = parseJsonOrThrow(raw, response.status, options.path);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  return payload as T;
}

function parseJsonOrThrow(raw: string, status: number, path: string): unknown {
  if (raw.length === 0) {
    return undefined;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new ApiError({
      code: 'unknown_error',
      message: `Response from ${path} was not valid JSON.`,
      status,
      cause: err,
    });
  }
}

function toApiError(payload: unknown, status: number): ApiError {
  if (isApiErrorEnvelope(payload)) {
    return new ApiError({
      code: toApiErrorCode(payload.error.code),
      message: payload.error.message,
      status,
      details: payload.error.details,
    });
  }
  return new ApiError({
    code: fallbackCodeForStatus(status),
    message: `Request failed with status ${status}.`,
    status,
  });
}

interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | undefined;
  };
}

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const outer = value as { error?: unknown };
  if (typeof outer.error !== 'object' || outer.error === null) {
    return false;
  }
  const inner = outer.error as { code?: unknown; message?: unknown };
  return typeof inner.code === 'string' && typeof inner.message === 'string';
}

const KNOWN_CODES: readonly ApiErrorCode[] = [
  'invalid_request',
  'not_found',
  'backend_unavailable',
  'backend_timeout',
  'internal_error',
];

function toApiErrorCode(raw: string): ApiErrorCode {
  return (KNOWN_CODES as readonly string[]).includes(raw) ? (raw as ApiErrorCode) : 'unknown_error';
}

function fallbackCodeForStatus(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'invalid_request';
    case 404:
      return 'not_found';
    case 503:
      return 'backend_unavailable';
    case 504:
      return 'backend_timeout';
    case 500:
      return 'internal_error';
    default:
      return 'unknown_error';
  }
}

function isAbortError(value: unknown): boolean {
  return value instanceof DOMException && value.name === 'AbortError';
}
