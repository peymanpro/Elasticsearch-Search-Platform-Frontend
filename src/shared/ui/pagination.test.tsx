import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders the current page number', () => {
    render(<Pagination page={3} hasMore onPageChange={() => {}} hasPrevious />);
    expect(screen.getByText('Page 3')).toBeInTheDocument();
  });

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} hasMore onPageChange={() => {}} hasPrevious={false} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('disables Next when there are no more pages', () => {
    render(<Pagination page={1} hasMore={false} onPageChange={() => {}} hasPrevious={false} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('calls onPageChange with page+1 when Next is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} hasMore onPageChange={onPageChange} hasPrevious />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with page-1 when Previous is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} hasMore onPageChange={onPageChange} hasPrevious />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
