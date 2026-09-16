import { createFileRoute } from '@tanstack/react-router';

import { useHealth } from '@/features/health/api/use-health';
import { Badge } from '@/shared/ui/badge';
import { ErrorState } from '@/shared/ui/error-state';
import { Spinner } from '@/shared/ui/spinner';
import { TechnicalDetails } from '@/shared/ui/technical-details';

export const Route = createFileRoute('/health')({
  component: HealthPage,
});

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  healthy: 'success',
  degraded: 'warning',
  unhealthy: 'danger',
};

const STATUS_DESCRIPTION: Record<string, string> = {
  healthy: 'The cluster is reachable, the alias resolves, and the index holds documents.',
  degraded:
    'The cluster is reachable, but a check failed: the alias is missing, the index is empty, or the cluster status is not green.',
  unhealthy: 'The cluster is not reachable. Search requests will fail.',
};

function HealthPage() {
  const health = useHealth();

  if (health.isPending) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-16">
        <Spinner label="Loading health" />
      </div>
    );
  }

  if (health.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-semibold">Health</h1>
        <ErrorState error={health.error} onRetry={() => health.refetch()} />
      </div>
    );
  }

  const data = health.data;
  const tone = STATUS_TONE[data.status] ?? 'neutral';
  const description = STATUS_DESCRIPTION[data.status] ?? '';

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Health</h1>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-3">
          <Badge tone={tone}>{data.status}</Badge>
          <p className="text-sm text-[var(--color-fg-muted)]">{description}</p>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
            Cluster
          </h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-[var(--color-fg-subtle)]">Name</dt>
            <dd className="font-mono">{data.cluster.name}</dd>
            <dt className="text-[var(--color-fg-subtle)]">Status</dt>
            <dd className="font-mono">{data.cluster.status}</dd>
            <dt className="text-[var(--color-fg-subtle)]">Nodes</dt>
            <dd className="font-mono">{data.cluster.number_of_nodes}</dd>
          </dl>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
            Index
          </h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-[var(--color-fg-subtle)]">Alias</dt>
            <dd className="font-mono">{data.index.alias}</dd>
            <dt className="text-[var(--color-fg-subtle)]">Points at</dt>
            <dd className="font-mono">
              {data.index.points_at ?? <span className="text-[var(--color-fg-subtle)]">—</span>}
            </dd>
            <dt className="text-[var(--color-fg-subtle)]">Documents</dt>
            <dd className="font-mono">{data.index.document_count}</dd>
          </dl>
        </div>
      </section>

      <section className="mt-4">
        <TechnicalDetails
          entries={[
            { label: 'Cluster status', value: data.cluster.status },
            { label: 'Nodes', value: String(data.cluster.number_of_nodes) },
            { label: 'Alias', value: data.index.alias },
            { label: 'Physical index', value: data.index.points_at ?? '(none)' },
            { label: 'Document count', value: String(data.index.document_count) },
          ]}
        />
      </section>
    </div>
  );
}
