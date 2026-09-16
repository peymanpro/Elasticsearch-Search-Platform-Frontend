import { ChevronRightIcon } from '@/shared/ui/icons';

interface TechnicalDetailsProps {
  /** Key/value pairs shown inside the disclosure. */
  entries: Array<{ label: string; value: string }>;
}

/**
 * A small disclosure that reveals raw technical metadata for a result.
 *
 * Native <details>/<summary> is used so keyboard support and the
 * open/closed state come from the browser.
 */
export function TechnicalDetails({ entries }: TechnicalDetailsProps) {
  if (entries.length === 0) return null;

  return (
    <details className="group rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs">
      <summary className="flex cursor-pointer items-center gap-1 text-[var(--color-fg-muted)] [&::-webkit-details-marker]:hidden">
        <span className="transition-transform group-open:rotate-90">
          <ChevronRightIcon width={12} height={12} />
        </span>
        Technical details
      </summary>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {entries.map((entry) => (
          <div key={entry.label} className="contents">
            <dt className="font-medium text-[var(--color-fg-subtle)]">{entry.label}</dt>
            <dd className="truncate font-mono text-[var(--color-fg-muted)]">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
