import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { ScoreExplanation } from '@/shared/api/schemas/explain';

import { ExplanationTree } from './explanation-tree';

const LEAF: ScoreExplanation = {
  value: 1.5,
  description: 'weight(name:wireless)',
  details: [],
};

const SMALL: ScoreExplanation = {
  value: 12.5,
  description: 'sum of:',
  details: [
    { value: 7.5, description: 'weight(name:wireless)', details: [] },
    { value: 5.0, description: 'weight(description:headphones)', details: [] },
  ],
};

const DEEP: ScoreExplanation = {
  value: 20,
  description: 'root',
  details: [
    {
      value: 10,
      description: 'level 1',
      details: [
        {
          value: 5,
          description: 'level 2',
          details: [{ value: 2, description: 'level 3', details: [] }],
        },
      ],
    },
  ],
};

describe('ExplanationTree', () => {
  it('renders the root node with its score and description', () => {
    render(<ExplanationTree root={SMALL} />);
    expect(screen.getByText('sum of:')).toBeInTheDocument();
    expect(screen.getByText('12.50')).toBeInTheDocument();
  });

  it('shows direct children by default (depth < 1)', () => {
    render(<ExplanationTree root={SMALL} />);
    expect(screen.getByText('weight(name:wireless)')).toBeInTheDocument();
    expect(screen.getByText('weight(description:headphones)')).toBeInTheDocument();
  });

  it('renders a leaf without an expand button', () => {
    render(<ExplanationTree root={LEAF} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('weight(name:wireless)')).toBeInTheDocument();
  });

  it('opens deeper levels only when expanded', async () => {
    render(<ExplanationTree root={DEEP} />);
    // depth 0 root is open, depth 1 child is open, depth 2 grandchild is collapsed
    expect(screen.getByText('level 1')).toBeInTheDocument();
    expect(screen.queryByText('level 2')).not.toBeInTheDocument();

    const expandButtons = screen.getAllByRole('button', { name: 'Expand' });
    const first = expandButtons[0];
    if (!first) throw new Error('expand button missing');
    await userEvent.click(first);

    expect(screen.getByText('level 2')).toBeInTheDocument();
    expect(screen.queryByText('level 3')).not.toBeInTheDocument();
  });

  it('collapses a node when its toggle is clicked', async () => {
    render(<ExplanationTree root={DEEP} />);
    const collapseButtons = screen.getAllByRole('button', { name: 'Collapse' });
    const first = collapseButtons[0];
    if (!first) throw new Error('collapse button missing');
    await userEvent.click(first);
    expect(screen.queryByText('level 1')).not.toBeInTheDocument();
  });

  it('formats integer scores with two decimals', () => {
    render(<ExplanationTree root={{ value: 5, description: 'x', details: [] }} />);
    expect(screen.getByText('5.00')).toBeInTheDocument();
  });

  it('formats fractional scores by trimming trailing zeros but keeping two', () => {
    render(<ExplanationTree root={{ value: 5.123456, description: 'x', details: [] }} />);
    expect(screen.getByText('5.12')).toBeInTheDocument();
  });
});
