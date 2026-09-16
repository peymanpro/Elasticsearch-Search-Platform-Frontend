import { Link } from '@tanstack/react-router';

import { useHealth } from '@/features/health/api/use-health';
import { Badge } from '@/shared/ui/badge';

type Tone = 'neutral' | 'success' | 'warning' | 'danger';

function toneFor(status: string | undefined): Tone {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'unhealthy':
      return 'danger';
    default:
      return 'neutral';
  }
}

function labelFor(status: string | undefined): string {
  if (!status) return 'unknown';
  return status;
}

export function HealthBadge() {
  const { data, isLoading, isError } = useHealth();

  const status = isError ? 'unreachable' : data?.status;
  const tone: Tone = isError ? 'danger' : toneFor(status);

  return (
    <Link
      to="/health"
      className="inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)]"
      aria-label="Service health"
    >
      <span className="text-xs">Health</span>
      <Badge tone={tone}>{isLoading ? '…' : labelFor(status)}</Badge>
    </Link>
  );
}
