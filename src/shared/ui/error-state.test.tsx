import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('has role=alert', () => {
    render(<ErrorState error={new Error('boom')} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the message from a generic Error', () => {
    render(<ErrorState error={new Error('boom')} />);
    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  it('renders a specific message for a known ApiError code', () => {
    const err = new ApiError({
      code: 'backend_unavailable',
      message: 'raw message',
      status: 503,
    });
    render(<ErrorState error={err} />);
    expect(screen.getByText('The search backend is not reachable right now.')).toBeInTheDocument();
  });

  it('renders the retry button when onRetry is provided', () => {
    render(<ErrorState error={new Error('x')} onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState error={new Error('x')} onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('does not render a retry button by default', () => {
    render(<ErrorState error={new Error('x')} />);
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });
});
