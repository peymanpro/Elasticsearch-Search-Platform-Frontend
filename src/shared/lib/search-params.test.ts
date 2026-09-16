import { describe, expect, it } from 'vitest';

import {
  parseSearchParams,
  serializeSearchParams,
  type SearchParams,
} from '@/shared/lib/search-params';

describe('parseSearchParams', () => {
  it('parses the minimal valid input', () => {
    const p = parseSearchParams({ q: 'headphones' });
    expect(p).not.toBeNull();
    expect(p?.q).toBe('headphones');
    expect(p?.page).toBe(1);
  });

  it('returns null when q is missing', () => {
    expect(parseSearchParams({})).toBeNull();
  });

  it('returns null when q is empty string', () => {
    expect(parseSearchParams({ q: '' })).toBeNull();
  });

  it('coerces numeric strings', () => {
    const p = parseSearchParams({
      q: 'x',
      price_min: '100',
      price_max: '500',
      page: '2',
    });
    expect(p?.price_min).toBe(100);
    expect(p?.price_max).toBe(500);
    expect(p?.page).toBe(2);
  });

  it('parses a sort token with direction', () => {
    const p = parseSearchParams({ q: 'x', sort: 'price.asc' });
    expect(p?.sort).toEqual({ field: 'price', direction: 'asc' });
  });

  it('applies the default direction when only field is given', () => {
    const p = parseSearchParams({ q: 'x', sort: 'price' });
    expect(p?.sort).toEqual({ field: 'price', direction: 'asc' });
  });

  it('rejects an unknown sort field', () => {
    expect(parseSearchParams({ q: 'x', sort: 'unknown.asc' })).toBeNull();
  });

  it('rejects an unknown sort direction', () => {
    expect(parseSearchParams({ q: 'x', sort: 'price.sideways' })).toBeNull();
  });

  it('rejects an unknown availability value', () => {
    expect(parseSearchParams({ q: 'x', availability: 'maybe' })).toBeNull();
  });

  it('rejects price_min > price_max', () => {
    expect(parseSearchParams({ q: 'x', price_min: '500', price_max: '100' })).toBeNull();
  });

  it('rejects rating above 5', () => {
    expect(parseSearchParams({ q: 'x', rating_min: '5.5' })).toBeNull();
  });

  it('rejects page beyond max_offset_window', () => {
    expect(parseSearchParams({ q: 'x', page: '1000' })).toBeNull();
  });

  it('ignores empty-string filter values', () => {
    const p = parseSearchParams({ q: 'x', category: '', brand: '   ' });
    expect(p?.category).toBeUndefined();
    expect(p?.brand).toBeUndefined();
  });
});

describe('serializeSearchParams', () => {
  it('omits defaults: page=1 and score.desc sort are not written', () => {
    const params: SearchParams = {
      q: 'headphones',
      page: 1,
      sort: { field: 'score', direction: 'desc' },
    };
    const sp = serializeSearchParams(params);
    expect(sp.get('q')).toBe('headphones');
    expect(sp.get('page')).toBeNull();
    expect(sp.get('sort')).toBeNull();
  });

  it('writes page when it is not 1', () => {
    const sp = serializeSearchParams({ q: 'x', page: 3 });
    expect(sp.get('page')).toBe('3');
  });

  it('writes sort when it differs from the default', () => {
    const sp = serializeSearchParams({
      q: 'x',
      page: 1,
      sort: { field: 'price', direction: 'asc' },
    });
    expect(sp.get('sort')).toBe('price.asc');
  });

  it('produces a stable key order for equal inputs', () => {
    const a = serializeSearchParams({
      q: 'x',
      category: 'Electronics',
      brand: 'Sony',
      page: 2,
    }).toString();
    const b = serializeSearchParams({
      q: 'x',
      category: 'Electronics',
      brand: 'Sony',
      page: 2,
    }).toString();
    expect(a).toBe(b);
  });
});

describe('roundtrip: parse(serialize(p)) === p', () => {
  const cases: SearchParams[] = [
    { q: 'headphones', page: 1 },
    { q: 'headphones', page: 3 },
    { q: 'headphones', page: 1, category: 'Electronics' },
    { q: 'headphones', page: 1, brand: 'Sony', availability: 'in_stock' },
    { q: 'headphones', page: 2, price_min: 100, price_max: 500 },
    { q: 'headphones', page: 1, rating_min: 4, rating_max: 5 },
    { q: 'headphones', page: 1, sort: { field: 'price', direction: 'asc' } },
    { q: 'headphones', page: 1, sort: { field: 'rating', direction: 'desc' } },
    {
      q: 'headphones',
      page: 5,
      category: 'Electronics',
      brand: 'Sony',
      availability: 'in_stock',
      price_min: 100,
      price_max: 500,
      rating_min: 4,
      rating_max: 5,
      sort: { field: 'price', direction: 'asc' },
    },
  ];

  for (const original of cases) {
    it(`roundtrips: ${JSON.stringify(original)}`, () => {
      const sp = serializeSearchParams(original);
      const parsed = parseSearchParams(sp);
      expect(parsed).toEqual(original);
    });
  }
});
