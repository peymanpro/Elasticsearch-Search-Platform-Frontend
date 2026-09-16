import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByRole('heading', { level: 2, name: 'No results' })).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<EmptyState title="No results" description="Try a different query." />);
    expect(screen.getByText('Try a different query.')).toBeInTheDocument();
  });

  it('renders the action when provided', () => {
    render(<EmptyState title="No results" action={<button type="button">Clear</button>} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('omits description and action when not provided', () => {
    render(<EmptyState title="No results" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
