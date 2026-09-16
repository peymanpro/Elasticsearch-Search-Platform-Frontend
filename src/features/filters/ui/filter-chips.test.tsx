import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SearchParams } from '@/shared/lib/search-params';

import { FilterChips } from './filter-chips';

const BASE: SearchParams = { q: 'x', page: 1 };

describe('FilterChips', () => {
  it('renders nothing when there are no active filters', () => {
    const { container } = render(<FilterChips value={BASE} onChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a chip per active filter', () => {
    const value: SearchParams = {
      ...BASE,
      category: 'Electronics',
      brand: 'Sony',
      availability: 'in_stock',
    };
    render(<FilterChips value={value} onChange={() => {}} />);
    expect(screen.getByText('Category: Electronics')).toBeInTheDocument();
    expect(screen.getByText('Brand: Sony')).toBeInTheDocument();
    expect(screen.getByText('Availability: in_stock')).toBeInTheDocument();
  });

  it('renders numeric chips for price and rating', () => {
    const value: SearchParams = {
      ...BASE,
      price_min: 100,
      price_max: 500,
      rating_min: 4,
    };
    render(<FilterChips value={value} onChange={() => {}} />);
    expect(screen.getByText('Min price: 100')).toBeInTheDocument();
    expect(screen.getByText('Max price: 500')).toBeInTheDocument();
    expect(screen.getByText('Min rating: 4')).toBeInTheDocument();
  });

  it('calls onChange with the key removed when a chip is clicked', async () => {
    const onChange = vi.fn();
    render(<FilterChips value={{ ...BASE, category: 'Electronics' }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove category filter' }));
    expect(onChange).toHaveBeenCalledWith({ category: undefined });
  });

  it('emits a different remove label per filter key', () => {
    render(
      <FilterChips
        value={{ ...BASE, category: 'Electronics', brand: 'Sony' }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Remove category filter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove brand filter' })).toBeInTheDocument();
  });
});
