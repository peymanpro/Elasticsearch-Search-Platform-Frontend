import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-fg-subtle)]">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
        The page you were looking for does not exist.
      </p>
      <div className="mt-6">
        <Link to="/search" className="text-sm text-[var(--color-accent)] underline">
          Back to search
        </Link>
      </div>
    </div>
  );
}
