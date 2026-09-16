import { createFileRoute } from '@tanstack/react-router';

/**
 * Search parameters are read from the URL as raw strings. Any value
 * that is not a string (arrays, numbers from programmatic navigation)
 * is coerced or dropped by the lazy component's parser.
 */
export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(search)) {
      if (typeof value === 'string') {
        out[key] = value;
      } else if (typeof value === 'number') {
        out[key] = String(value);
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        out[key] = value[0];
      }
    }
    return out;
  },
});
