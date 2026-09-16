import type { ReactNode } from 'react';

import { ApiError } from '@/shared/api/api-error';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  action?: ReactNode;
}

function describeError(error: unknown): string {
  if (ApiError.isApiError(error)) {
    switch (error.code) {
      case 'backend_unavailable':
        return 'The search backend is not reachable right now.';
      case 'backend_timeout':
        return 'The search backend took too long to respond.';
      case 'invalid_request':
        return 'The search request was rejected by the backend.';
      case 'not_found':
        return 'The requested resource was not found.';
      case 'network_error':
        return 'Could not reach the server. Check your connection.';
      default:
        return error.message;
    }
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

export function ErrorState({ error, onRetry, action }: ErrorStateProps) {
  const message = describeError(error);
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
    >
      <h2 className="text-lg font-semibold text-[var(--color-fg)]">Something went wrong</h2>
      <p className="max-w-prose text-sm text-[var(--color-fg-muted)]">{message}</p>
      <div className="flex items-center gap-2 pt-2">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 text-sm font-medium text-[var(--color-accent-fg)] hover:opacity-90"
          >
            Try again
          </button>
        ) : null}
        {action}
      </div>
    </div>
  );
}
