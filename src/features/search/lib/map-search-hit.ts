import type { SearchHit } from '@/shared/api/schemas/search';

/**
 * View model of a search hit, derived from the opaque `source` field.
 *
 * The API treats `source` as opaque. Every field below is optional and
 * is read defensively: if the backend's document model changes, the
 * card still renders with what it can find.
 */
export interface SearchHitViewModel {
  id: string;
  score: number;
  name: string;
  brand: string | null;
  category: string | null;
  sku: string | null;
  description: string | null;
  tags: string[];
  price: number | null;
  currency: string | null;
  rating: number | null;
  availability: string | null;
  highlights: Record<string, string[]>;
}

function readString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readNumber(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

/**
 * Map a raw hit from the API into the shape the result card uses.
 *
 * `name` falls back to `sku` and then to the id, so a card always has
 * a headline to render even if the source is missing a product name.
 */
export function mapSearchHit(hit: SearchHit): SearchHitViewModel {
  const source = hit.source;
  const sku = readString(source, 'sku');
  const id = hit.id;
  const name = readString(source, 'name') ?? sku ?? id;

  return {
    id,
    score: hit.score,
    name,
    brand: readString(source, 'brand'),
    category: readString(source, 'category'),
    sku,
    description: readString(source, 'description'),
    tags: readStringArray(source, 'tags'),
    price: readNumber(source, 'price'),
    currency: readString(source, 'currency'),
    rating: readNumber(source, 'rating'),
    availability: readString(source, 'availability'),
    highlights: hit.highlights,
  };
}
