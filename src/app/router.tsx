import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

import { RouteError } from './route-error';

/**
 * Search-parameter (de)serializers.
 *
 * TanStack Router's defaults JSON-encode each value, so a page number
 * becomes `page="2"` in the URL. That is valid but ugly and hard to
 * share. We use URLSearchParams directly so every value is written the
 * way a human would type it: `page=2`.
 */
function parseSearch(searchStr: string): Record<string, string> {
  const params = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr);
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function stringifySearch(search: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  const str = params.toString();
  return str.length > 0 ? `?${str}` : '';
}

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultErrorComponent: RouteError,
  parseSearch,
  stringifySearch,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
