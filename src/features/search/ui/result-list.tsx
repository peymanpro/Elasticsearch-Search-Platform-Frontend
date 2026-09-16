import type { SearchHit } from '@/shared/api/schemas/search';
import { Skeleton } from '@/shared/ui/skeleton';

import { mapSearchHit } from '../lib/map-search-hit';
import { ResultCard } from './result-card';

interface ResultListProps {
  hits: SearchHit[];
  loading?: boolean;
  onExplain: (documentId: string) => void;
}

function ResultSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="20px" />
          <Skeleton width="40%" height="12px" />
        </div>
        <Skeleton width="80px" height="24px" />
      </div>
      <Skeleton width="100%" height="12px" />
      <Skeleton width="80%" height="12px" />
      <div className="flex justify-between pt-3">
        <Skeleton width="80px" height="12px" />
        <Skeleton width="120px" height="28px" />
      </div>
    </div>
  );
}

export function ResultList({ hits, loading = false, onExplain }: ResultListProps) {
  if (loading && hits.length === 0) {
    return (
      <ul className="flex flex-col gap-3" aria-busy="true" aria-label="Loading results">
        {[0, 1, 2].map((i) => (
          <li key={i}>
            <ResultSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className="flex flex-col gap-3"
      aria-busy={loading || undefined}
      aria-label="Search results"
    >
      {hits.map((hit) => (
        <li key={hit.id}>
          <ResultCard hit={mapSearchHit(hit)} onExplain={onExplain} />
        </li>
      ))}
    </ul>
  );
}
