import { z } from 'zod';

/**
 * Wire shape of every error response the backend returns.
 *
 * Every endpoint uses the same envelope:
 *   { "error": { "code": "...", "message": "...", "details": {...}? } }
 *
 * `code` is validated as a plain string here rather than as an enum,
 * because the backend may add new codes in the future and the frontend
 * maps unknown codes to a generic "unknown_error" at the client layer.
 */
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;
