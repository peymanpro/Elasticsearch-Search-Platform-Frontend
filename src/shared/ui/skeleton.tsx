import { cn } from '@/shared/lib/cn';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ width, height, rounded = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block animate-pulse bg-[var(--color-surface-muted)]',
        rounded ? 'rounded-full' : 'rounded-[var(--radius-sm)]',
      )}
      style={{ width, height }}
    />
  );
}
