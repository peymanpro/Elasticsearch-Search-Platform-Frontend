import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Select } from './select';

const OPTIONS = [
  { value: 'score.desc', label: 'Relevance' },
  { value: 'price.asc', label: 'Price (low to high)' },
  { value: 'price.desc', label: 'Price (high to low)' },
];

describe('Select', () => {
  it('renders a labelled combobox', () => {
    render(<Select label="Sort by" options={OPTIONS} />);
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select label="Sort by" options={OPTIONS} />);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('changes value when a different option is selected', async () => {
    render(<Select label="Sort by" options={OPTIONS} defaultValue="score.desc" />);
    const select = screen.getByLabelText('Sort by');
    await userEvent.selectOptions(select, 'price.asc');
    expect(select).toHaveValue('price.asc');
  });

  it('renders an optional hint', () => {
    render(<Select label="Sort by" options={OPTIONS} hint="Applies to the current results" />);
    expect(screen.getByText('Applies to the current results')).toBeInTheDocument();
  });

  it('is disabled when set', () => {
    render(<Select label="Sort by" options={OPTIONS} disabled />);
    expect(screen.getByLabelText('Sort by')).toBeDisabled();
  });
});
