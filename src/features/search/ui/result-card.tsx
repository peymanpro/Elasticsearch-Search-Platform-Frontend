import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Highlight } from '@/shared/ui/highlight';

import type { SearchHitViewModel } from '../lib/map-search-hit';

interface ResultCardProps {
  hit: SearchHitViewModel;
  onExplain: (documentId: string) => void;
}

function formatPrice(price: number | null, currency: string | null): string | null {
  if (price === null) return null;
  const cur = currency ?? 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price} ${cur}`;
  }
}

const AVAILABILITY_TONE: Record<string, 'neutral' | 'success' | 'warning' | 'danger' | 'accent'> = {
  in_stock: 'success',
  preorder: 'warning',
  out_of_stock: 'danger',
  discontinued: 'neutral',
};

export function ResultCard({ hit, onExplain }: ResultCardProps) {
  const priceText = formatPrice(hit.price, hit.currency);
  const availabilityTone = hit.availability
    ? (AVAILABILITY_TONE[hit.availability] ?? 'neutral')
    : 'neutral';

  const nameHighlights = hit.highlights['name'];
  const descriptionHighlights = hit.highlights['description'];

  return (
    <article className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-[var(--color-fg)]">
            {nameHighlights && nameHighlights.length > 0 ? (
              <Highlight value={nameHighlights.join(' ')} />
            ) : (
              hit.name
            )}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-muted)]">
            {hit.brand ? <span>{hit.brand}</span> : null}
            {hit.category ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{hit.category}</span>
              </>
            ) : null}
            {hit.sku ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{hit.sku}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {priceText ? (
            <span
              data-testid="result-price"
              className="text-base font-semibold text-[var(--color-fg)]"
            >
              {priceText}
            </span>
          ) : null}
          <div className="flex items-center gap-2">
            {hit.availability ? <Badge tone={availabilityTone}>{hit.availability}</Badge> : null}
            {hit.rating !== null ? (
              <span className="text-xs text-[var(--color-fg-muted)]" aria-label="Rating">
                ★ {hit.rating.toFixed(1)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {descriptionHighlights && descriptionHighlights.length > 0 ? (
        <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
          <Highlight value={descriptionHighlights.join(' … ')} />
        </p>
      ) : hit.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {hit.description}
        </p>
      ) : null}

      {hit.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {hit.tags.slice(0, 6).map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <footer className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
          score {hit.score.toFixed(2)}
        </span>
        <Button size="sm" variant="secondary" onClick={() => onExplain(hit.id)}>
          Why this result?
        </Button>
      </footer>
    </article>
  );
}
