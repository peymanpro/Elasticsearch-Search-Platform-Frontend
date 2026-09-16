import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SearchHit } from '@/shared/api/schemas/search';

import { ResultList } from './result-list';

function buildHit(id: string): SearchHit {
  return {
    id,
    score: 1.0,
    source: { sku: id, name: `Product ${id}` },
    highlights: {},
  };
}

describe('ResultList', () => {
  it('renders a card per hit', () => {
    const hits = [buildHit('SKU-1'), buildHit('SKU-2'), buildHit('SKU-3')];
    render(<ResultList hits={hits} onExplain={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Product SKU-1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product SKU-2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product SKU-3' })).toBeInTheDocument();
  });

  it('shows skeletons while loading and there are no hits yet', () => {
    render(<ResultList hits={[]} loading onExplain={() => {}} />);
    expect(screen.getByLabelText('Loading results')).toHaveAttribute('aria-busy', 'true');
  });

  it('keeps existing hits visible while reloading', () => {
    const hits = [buildHit('SKU-1')];
    render(<ResultList hits={hits} loading onExplain={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Product SKU-1' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading results')).not.toBeInTheDocument();
  });

  it('renders an empty list without error', () => {
    render(<ResultList hits={[]} onExplain={() => {}} />);
    expect(screen.getByLabelText('Search results')).toBeInTheDocument();
  });
});
