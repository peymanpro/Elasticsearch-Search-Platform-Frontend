import { ErrorState } from '@/shared/ui/error-state';

interface RouteErrorProps {
  error: unknown;
  reset?: () => void;
}

/**
 * Default error component for every route.
 *
 * Wired through `createRouter({ defaultErrorComponent })`. When a
 * route's render throws, TanStack Router shows this instead of
 * unmounting the shell.
 */
export function RouteError({ error, reset }: RouteErrorProps) {
  return (
    <div className="p-6">
      <ErrorState error={error} onRetry={reset} />
    </div>
  );
}
