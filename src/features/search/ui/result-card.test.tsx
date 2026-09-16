import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SearchHit } from '@/shared/api/schemas/search';

import { mapSearchHit } from '../lib/map-search-hit';
import { ResultCard } from './result-card';

function buildHit(overrides: Partial<SearchHit> = {}): SearchHit {
  return {
    id: 'SKU-1',
    score: 4.5,
    source: {
      sku: 'SKU-1',
      name: 'Wireless Headphones',
      brand: 'Acme',
      category: 'Electronics',
      description: 'Great sound.',
      price: 129.99,
      currency: 'USD',
      rating: 4.5,
      availability: 'in_stock',
      tags: ['wireless', 'anc'],
    },
    highlights: {},
    ...overrides,
  };
}

describe('ResultCard', () => {
  it('renders the product name from source', () => {
    render(<ResultCard hit={mapSearchHit(buildHit())} onExplain={() => {}} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Wireless Headphones');
  });

  it('renders a price element when price is present', () => {
    render(<ResultCard hit={mapSearchHit(buildHit())} onExplain={() => {}} />);
    // The card pins its number format to en-US so this assertion is
    // deterministic regardless of the host machine's locale.
    const price = screen.getByTestId('result-price');
    expect(price).toHaveTextContent('$129.99');
  });

  it('does not render a price when price is missing', () => {
    const hit = buildHit({ source: { sku: 'SKU-1', name: 'No price' } });
    render(<ResultCard hit={mapSearchHit(hit)} onExplain={() => {}} />);
    expect(screen.queryByTestId('result-price')).not.toBeInTheDocument();
  });

  it('renders the availability badge', () => {
    render(<ResultCard hit={mapSearchHit(buildHit())} onExplain={() => {}} />);
    expect(screen.getByText('in_stock')).toBeInTheDocument();
  });

  it('renders the rating', () => {
    render(<ResultCard hit={mapSearchHit(buildHit())} onExplain={() => {}} />);
    expect(screen.getByLabelText('Rating')).toHaveTextContent('4.5');
  });

  it('renders up to 6 tags', () => {
    const hit = buildHit({
      source: { tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
    });
    render(<ResultCard hit={mapSearchHit(hit)} onExplain={() => {}} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
  });

  it('renders highlights with <mark> when present', () => {
    const hit = buildHit({
      highlights: { name: ['<em>Wireless</em> Headphones'] },
    });
    const { container } = render(<ResultCard hit={mapSearchHit(hit)} onExplain={() => {}} />);
    const mark = container.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark).toHaveTextContent('Wireless');
  });

  it('calls onExplain with the document id when the button is clicked', async () => {
    const onExplain = vi.fn();
    render(<ResultCard hit={mapSearchHit(buildHit())} onExplain={onExplain} />);
    await userEvent.click(screen.getByRole('button', { name: 'Why this result?' }));
    expect(onExplain).toHaveBeenCalledWith('SKU-1');
  });

  it('falls back to sku when name is missing', () => {
    const hit = buildHit({ source: { sku: 'SKU-9' } });
    render(<ResultCard hit={mapSearchHit(hit)} onExplain={() => {}} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('SKU-9');
  });
});
