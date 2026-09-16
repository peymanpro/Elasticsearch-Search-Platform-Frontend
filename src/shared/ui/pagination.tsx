import { cn } from '@/shared/lib/cn';

interface PaginationProps {
  page: number;
  hasMore: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, hasMore, hasPrevious, onPageChange }: PaginationProps) {
  const buttonClass =
    'inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-50';
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-2">
      <button
        type="button"
        className={cn(buttonClass)}
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
      >
        Previous
      </button>
      <span className="text-sm text-[var(--color-fg-muted)]">Page {page}</span>
      <button
        type="button"
        className={cn(buttonClass)}
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore}
      >
        Next
      </button>
    </nav>
  );
}
