import type { SortDirection, SortField } from '@/shared/config/search-constants';
import type { SortSelection } from '@/shared/lib/search-params';
import { Select } from '@/shared/ui/select';

interface SortSelectorProps {
  value: SortSelection | undefined;
  onChange: (value: SortSelection | undefined) => void;
}

interface SortOption {
  token: string;
  label: string;
}

/**
 * Sort options offered to the user.
 *
 * The default sort (relevance / score descending) is the first option
 * and maps to `undefined`, which the URL serializer omits. Every other
 * option is a concrete `field.direction` pair.
 */
const OPTIONS: SortOption[] = [
  { token: '', label: 'Relevance (default)' },
  { token: 'price.asc', label: 'Price: low to high' },
  { token: 'price.desc', label: 'Price: high to low' },
  { token: 'rating.desc', label: 'Rating: high to low' },
  { token: 'popularity.desc', label: 'Popularity' },
  { token: 'created_at.desc', label: 'Newest first' },
];

const TOKENS = new Map(OPTIONS.map((o) => [o.token, o.label]));

const VALID_FIELDS = new Set<SortField>(['score', 'price', 'rating', 'popularity', 'created_at']);
const VALID_DIRECTIONS = new Set<SortDirection>(['asc', 'desc']);

function selectionToToken(value: SortSelection | undefined): string {
  if (!value) return '';
  if (value.field === 'score' && value.direction === 'desc') return '';
  return `${value.field}.${value.direction}`;
}

function tokenToSelection(token: string): SortSelection | undefined {
  if (token === '') return undefined;
  const dot = token.indexOf('.');
  if (dot === -1) return undefined;
  const field = token.slice(0, dot);
  const direction = token.slice(dot + 1);
  if (!VALID_FIELDS.has(field as SortField)) return undefined;
  if (!VALID_DIRECTIONS.has(direction as SortDirection)) return undefined;
  return { field: field as SortField, direction: direction as SortDirection };
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const current = selectionToToken(value);

  const options = OPTIONS.map((o) => ({
    value: o.token,
    label: TOKENS.get(o.token) ?? o.label,
  }));

  return (
    <Select
      label="Sort by"
      options={options}
      value={current}
      onChange={(e) => onChange(tokenToSelection(e.target.value))}
    />
  );
}
