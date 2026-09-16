import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">About Search Lens</h1>
      <p className="text-sm text-[var(--color-fg-muted)]">
        A read-only frontend for the Elasticsearch Search Platform.
      </p>

      <section className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        <div>
          <h2 className="mb-2 text-base font-semibold text-[var(--color-fg)]">What it does</h2>
          <p>
            Search Lens exposes the platform&apos;s search, autocomplete, scoring explanation, and
            health endpoints through a small, accessible, and fully typed UI. It supports filtering,
            business sorting, faceted navigation, offset pagination, and safe rendering of
            Elasticsearch highlight fragments.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-[var(--color-fg)]">
            What it does not do
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>The frontend never writes to the backend. Every request is a read.</li>
            <li>It has no authentication. The backend is open by design.</li>
            <li>It exposes no index management. Reindexing is a backend command.</li>
            <li>It does not offer a search-mode selector. The backend exposes one ranking path.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-[var(--color-fg)]">The dataset</h2>
          <p>
            The dataset shipped with this demo is a product catalog. Nothing in the pipeline - the
            URL state, the HTTP adapter, the Zod validation layer, the view model, or the UI - knows
            what kind of document it is carrying. Swapping the dataset for another entity type
            requires four local changes: the backend domain type, the Elasticsearch mapping, the
            filter set, and the single frontend mapper that reads the opaque{' '}
            <code className="rounded bg-[var(--color-surface-muted)] px-1 font-mono text-xs">
              source
            </code>{' '}
            field. The API contract, the URL model, the HTTP client, and the validation layer do not
            change.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-[var(--color-fg)]">Architecture</h2>
          <p>
            The project follows a hybrid feature-oriented structure with one-way dependencies from{' '}
            <code className="rounded bg-[var(--color-surface-muted)] px-1 font-mono text-xs">
              app
            </code>{' '}
            to{' '}
            <code className="rounded bg-[var(--color-surface-muted)] px-1 font-mono text-xs">
              routes
            </code>{' '}
            to{' '}
            <code className="rounded bg-[var(--color-surface-muted)] px-1 font-mono text-xs">
              features
            </code>{' '}
            to{' '}
            <code className="rounded bg-[var(--color-surface-muted)] px-1 font-mono text-xs">
              shared
            </code>
            . The boundaries are enforced by dependency-cruiser and an ESLint rule set, not by
            convention.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-[var(--color-fg)]">The backend</h2>
          <p>
            The API is documented at{' '}
            <a
              href="http://localhost:8000/api/docs/"
              className="text-[var(--color-accent)] underline"
              target="_blank"
              rel="noreferrer"
            >
              /api/docs/
            </a>{' '}
            (Swagger UI) and at{' '}
            <a
              href="http://localhost:8000/api/schema/"
              className="text-[var(--color-accent)] underline"
              target="_blank"
              rel="noreferrer"
            >
              /api/schema/
            </a>{' '}
            (OpenAPI schema).
          </p>
        </div>
      </section>

      <div className="mt-8">
        <Link to="/search" className="text-sm text-[var(--color-accent)] underline">
          Back to search
        </Link>
      </div>
    </div>
  );
}
