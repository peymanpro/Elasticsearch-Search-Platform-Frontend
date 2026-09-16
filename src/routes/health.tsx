import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/health')({
  component: HealthPage,
});

function HealthPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Health</h1>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">Health UI coming in Phase 10.</p>
    </div>
  );
}
