import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">About UI coming in Phase 10.</p>
    </div>
  );
}
