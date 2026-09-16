import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SearchParams } from '@/shared/lib/search-params';

import { FilterPanel } from './filter-panel';

const EMPTY: SearchParams = { q: 'headphones', page: 1 };

const CATEGORIES = [
  { value: 'Electronics', count: 30 },
  { value: 'Accessories', count: 12 },
];
const BRANDS = [
  { value: 'Sony', count: 8 },
  { value: 'Bose', count: 5 },
];
const AVAILABILITY = [
  { value: 'in_stock', count: 40 },
  { value: 'preorder', count: 3 },
];

function renderPanel(value: SearchParams, onChange = vi.fn(), onClearAll = vi.fn()) {
  const utils = render(
    <FilterPanel
      value={value}
      categories={CATEGORIES}
      brands={BRANDS}
      availability={AVAILABILITY}
      onChange={onChange}
      onClearAll={onClearAll}
    />,
  );
  return { ...utils, onChange, onClearAll };
}

describe('FilterPanel', () => {
  it('renders the sections', () => {
    renderPanel(EMPTY);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Price range')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
  });

  it('renders category buckets with counts', () => {
    renderPanel(EMPTY);
    expect(screen.getByRole('button', { name: /Electronics/ })).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('calls onChange with the selected category', async () => {
    const { onChange } = renderPanel(EMPTY);
    await userEvent.click(screen.getByRole('button', { name: /Electronics/ }));
    expect(onChange).toHaveBeenCalledWith({ category: 'Electronics' });
  });

  it('deselects a category when its active button is clicked again', async () => {
    const value: SearchParams = { ...EMPTY, category: 'Electronics' };
    const { onChange } = renderPanel(value);
    await userEvent.click(screen.getByRole('button', { name: /Electronics/ }));
    expect(onChange).toHaveBeenCalledWith({ category: undefined });
  });

  it('calls onChange with the selected brand', async () => {
    const { onChange } = renderPanel(EMPTY);
    await userEvent.click(screen.getByRole('button', { name: /Sony/ }));
    expect(onChange).toHaveBeenCalledWith({ brand: 'Sony' });
  });

  it('calls onChange with the selected availability', async () => {
    const { onChange } = renderPanel(EMPTY);
    await userEvent.click(screen.getByRole('button', { name: /In stock/ }));
    expect(onChange).toHaveBeenCalledWith({ availability: 'in_stock' });
  });

  it('calls onChange with a numeric price_min when a value is entered', async () => {
    const { onChange } = renderPanel(EMPTY);
    const priceMin = screen.getAllByLabelText('Min')[0];
    if (!priceMin) throw new Error('Min input missing');
    await userEvent.type(priceMin, '1');
    expect(onChange).toHaveBeenCalled();
    // The first call carries the parsed numeric value.
    const firstCall = onChange.mock.calls[0];
    expect(firstCall?.[0]).toEqual({ price_min: 1 });
  });

  it('shows the Clear all button only when filters are active', () => {
    const { rerender } = render(
      <FilterPanel
        value={EMPTY}
        categories={CATEGORIES}
        brands={BRANDS}
        availability={AVAILABILITY}
        onChange={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: /Clear all/ })).not.toBeInTheDocument();

    rerender(
      <FilterPanel
        value={{ ...EMPTY, category: 'Electronics' }}
        categories={CATEGORIES}
        brands={BRANDS}
        availability={AVAILABILITY}
        onChange={() => {}}
        onClearAll={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Clear all \(1\)/ })).toBeInTheDocument();
  });

  it('calls onClearAll when Clear all is clicked', async () => {
    const { onClearAll } = renderPanel({ ...EMPTY, category: 'Electronics' });
    await userEvent.click(screen.getByRole('button', { name: /Clear all/ }));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('marks active filter buttons with aria-pressed', () => {
    renderPanel({ ...EMPTY, category: 'Electronics' });
    const active = screen.getByRole('button', { name: /Electronics/ });
    expect(active).toHaveAttribute('aria-pressed', 'true');
  });
});
