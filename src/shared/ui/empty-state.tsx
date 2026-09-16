import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {icon ? (
        <div aria-hidden="true" className="text-[var(--color-fg-subtle)]">
          {icon}
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-[var(--color-fg)]">{title}</h2>
      {description ? (
        <p className="max-w-prose text-sm text-[var(--color-fg-muted)]">{description}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
