import { Pagination } from '@/shared/ui/pagination';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  returned: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

function formatRange(page: number, pageSize: number, total: number, returned: number): string {
  if (total === 0 || returned === 0) return 'No results';
  const start = (page - 1) * pageSize + 1;
  const end = start + returned - 1;
  return `Showing ${start}–${end} of ${total}`;
}

export function PaginationControls({
  page,
  pageSize,
  total,
  returned,
  hasMore,
  onPageChange,
}: PaginationControlsProps) {
  const hasPrevious = page > 1;
  const range = formatRange(page, pageSize, total, returned);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-[var(--color-fg-muted)]">{range}</p>
      <Pagination
        page={page}
        hasMore={hasMore}
        hasPrevious={hasPrevious}
        onPageChange={onPageChange}
      />
    </div>
  );
}
