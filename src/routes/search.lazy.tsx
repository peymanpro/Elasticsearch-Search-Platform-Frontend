import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/search')({
  component: SearchPage,
});

function SearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Search</h1>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">Search UI coming in Phase 8.</p>
    </div>
  );
}
