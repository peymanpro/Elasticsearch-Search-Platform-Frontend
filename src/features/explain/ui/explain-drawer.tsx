import { useExplain } from '@/features/explain/api/use-explain';
import { ExplanationTree } from '@/features/explain/ui/explanation-tree';
import { Button } from '@/shared/ui/button';
import { Drawer } from '@/shared/ui/drawer';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Spinner } from '@/shared/ui/spinner';

interface ExplainDrawerProps {
  open: boolean;
  onClose: () => void;
  query: string;
  documentId: string | null;
}

/**
 * Right-side drawer showing the scoring explanation for a
 * (query, document) pair. Mounted by the search page whenever the user
 * clicks "Why this result?" on a hit.
 *
 * The query is disabled when `documentId` is null, so the hook is idle
 * until a document is selected.
 */
export function ExplainDrawer({ open, onClose, query, documentId }: ExplainDrawerProps) {
  const explain = useExplain(documentId !== null ? { query, documentId } : null);

  return (
    <Drawer open={open} onClose={onClose} side="right" title="Why this result?">
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1 text-xs text-[var(--color-fg-muted)]">
          <p>
            <span className="font-medium text-[var(--color-fg-subtle)]">Document: </span>
            <span className="font-mono">{documentId ?? '—'}</span>
          </p>
          <p>
            <span className="font-medium text-[var(--color-fg-subtle)]">Query: </span>
            <span className="font-mono">{query}</span>
          </p>
        </header>

        {explain.isPending ? (
          <div className="flex items-center justify-center py-8">
            <Spinner label="Loading explanation" />
          </div>
        ) : explain.isError ? (
          <ErrorState error={explain.error} onRetry={() => explain.refetch()} />
        ) : explain.data ? (
          explain.data.matched && explain.data.explanation ? (
            <ExplanationTree root={explain.data.explanation} />
          ) : (
            <EmptyState
              title="No match"
              description="This document does not match the query. It appeared in a different sort order or from a filter, not from a text match."
              action={
                <Button size="sm" variant="secondary" onClick={onClose}>
                  Close
                </Button>
              }
            />
          )
        ) : null}
      </div>
    </Drawer>
  );
}
