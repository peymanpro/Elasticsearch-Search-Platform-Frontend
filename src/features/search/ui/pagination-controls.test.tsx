import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PaginationControls } from './pagination-controls';

const BASE = {
  page: 2,
  pageSize: 20,
  total: 100,
  returned: 20,
  hasMore: true,
};

describe('PaginationControls', () => {
  it('renders the range label for the middle page', () => {
    render(<PaginationControls {...BASE} onPageChange={() => {}} />);
    expect(screen.getByText('Showing 21–40 of 100')).toBeInTheDocument();
  });

  it('renders the range label for the first page', () => {
    render(<PaginationControls {...BASE} page={1} onPageChange={() => {}} />);
    expect(screen.getByText('Showing 1–20 of 100')).toBeInTheDocument();
  });

  it('shows "No results" when total is zero', () => {
    render(
      <PaginationControls
        {...BASE}
        total={0}
        returned={0}
        hasMore={false}
        page={1}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('calls onPageChange with the next page', async () => {
    const onPageChange = vi.fn();
    render(<PaginationControls {...BASE} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with the previous page', async () => {
    const onPageChange = vi.fn();
    render(<PaginationControls {...BASE} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables Previous on the first page', () => {
    render(<PaginationControls {...BASE} page={1} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('disables Next when hasMore is false', () => {
    render(<PaginationControls {...BASE} hasMore={false} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
