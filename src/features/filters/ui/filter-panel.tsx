import type { FacetBucket } from '@/shared/api/schemas/search';
import {
  AVAILABILITY_VALUES,
  MAX_RATING,
  MIN_RATING,
  type AvailabilityValue,
} from '@/shared/config/search-constants';
import type { SearchParams, SearchParamsPatch } from '@/shared/lib/search-params';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface FilterPanelProps {
  /** Current filters from the URL. */
  value: SearchParams;
  /** Facet counts returned by the backend for the current result set. */
  categories: FacetBucket[];
  brands: FacetBucket[];
  availability: FacetBucket[];
  /** Called with a partial patch. `undefined` means "remove this filter". */
  onChange: (patch: SearchParamsPatch) => void;
  onClearAll: () => void;
}

const AVAILABILITY_LABELS: Record<AvailabilityValue, string> = {
  in_stock: 'In stock',
  out_of_stock: 'Out of stock',
  preorder: 'Preorder',
  discontinued: 'Discontinued',
};

function parseNumberOrUndefined(raw: string): number | undefined {
  if (raw === '') return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export function FilterPanel({
  value,
  categories,
  brands,
  availability,
  onChange,
  onClearAll,
}: FilterPanelProps) {
  const activeCount = countActive(value);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
          Filters
        </h2>
        {activeCount > 0 ? (
          <Button size="sm" variant="ghost" onClick={onClearAll}>
            Clear all ({activeCount})
          </Button>
        ) : null}
      </header>

      <SingleSelectGroup
        title="Category"
        buckets={categories}
        current={value.category}
        onPick={(next) => onChange({ category: next })}
      />

      <SingleSelectGroup
        title="Brand"
        buckets={brands}
        current={value.brand}
        onPick={(next) => onChange({ brand: next })}
      />

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
          Availability
        </h3>
        <ul className="flex flex-col gap-1">
          {AVAILABILITY_VALUES.map((option) => {
            const bucket = availability.find((b) => b.value === option);
            const isCurrent = value.availability === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => onChange({ availability: isCurrent ? undefined : option })}
                  aria-pressed={isCurrent}
                  className={[
                    'flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm',
                    isCurrent
                      ? 'bg-[var(--color-accent-muted)] text-[var(--color-fg)]'
                      : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)]',
                  ].join(' ')}
                >
                  <span>{AVAILABILITY_LABELS[option]}</span>
                  {bucket ? (
                    <span className="text-xs text-[var(--color-fg-subtle)]">{bucket.count}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
          Price range
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Min"
            type="number"
            inputMode="decimal"
            min={0}
            value={value.price_min ?? ''}
            onChange={(e) => onChange({ price_min: parseNumberOrUndefined(e.target.value) })}
          />
          <Input
            label="Max"
            type="number"
            inputMode="decimal"
            min={0}
            value={value.price_max ?? ''}
            onChange={(e) => onChange({ price_max: parseNumberOrUndefined(e.target.value) })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
          Rating
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Min"
            type="number"
            inputMode="decimal"
            min={MIN_RATING}
            max={MAX_RATING}
            step={0.5}
            value={value.rating_min ?? ''}
            onChange={(e) => onChange({ rating_min: parseNumberOrUndefined(e.target.value) })}
          />
          <Input
            label="Max"
            type="number"
            inputMode="decimal"
            min={MIN_RATING}
            max={MAX_RATING}
            step={0.5}
            value={value.rating_max ?? ''}
            onChange={(e) => onChange({ rating_max: parseNumberOrUndefined(e.target.value) })}
          />
        </div>
      </section>
    </div>
  );
}

interface SingleSelectGroupProps {
  title: string;
  buckets: FacetBucket[];
  current: string | undefined;
  onPick: (value: string | undefined) => void;
}

function SingleSelectGroup({ title, buckets, current, onPick }: SingleSelectGroupProps) {
  if (buckets.length === 0) {
    return (
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--color-fg-subtle)]">No options</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
        {title}
      </h3>
      <ul className="flex flex-col gap-1">
        {buckets.map((bucket) => {
          const isCurrent = current === bucket.value;
          return (
            <li key={bucket.value}>
              <button
                type="button"
                onClick={() => onPick(isCurrent ? undefined : bucket.value)}
                aria-pressed={isCurrent}
                className={[
                  'flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm',
                  isCurrent
                    ? 'bg-[var(--color-accent-muted)] text-[var(--color-fg)]'
                    : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)]',
                ].join(' ')}
              >
                <span className="truncate">{bucket.value}</span>
                <span className="text-xs text-[var(--color-fg-subtle)]">{bucket.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function countActive(value: SearchParams): number {
  let n = 0;
  if (value.category !== undefined) n += 1;
  if (value.brand !== undefined) n += 1;
  if (value.availability !== undefined) n += 1;
  if (value.price_min !== undefined) n += 1;
  if (value.price_max !== undefined) n += 1;
  if (value.rating_min !== undefined) n += 1;
  if (value.rating_max !== undefined) n += 1;
  return n;
}
