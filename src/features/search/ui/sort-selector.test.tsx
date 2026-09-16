import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SortSelector } from './sort-selector';

describe('SortSelector', () => {
  it('renders a labelled select', () => {
    render(<SortSelector value={undefined} onChange={() => {}} />);
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('shows the default option when value is undefined', () => {
    render(<SortSelector value={undefined} onChange={() => {}} />);
    expect(screen.getByLabelText('Sort by')).toHaveValue('');
  });

  it('shows the current selection', () => {
    render(<SortSelector value={{ field: 'price', direction: 'asc' }} onChange={() => {}} />);
    expect(screen.getByLabelText('Sort by')).toHaveValue('price.asc');
  });

  it('treats score.desc as the default', () => {
    render(<SortSelector value={{ field: 'score', direction: 'desc' }} onChange={() => {}} />);
    expect(screen.getByLabelText('Sort by')).toHaveValue('');
  });

  it('calls onChange with the parsed selection when an option is picked', async () => {
    const onChange = vi.fn();
    render(<SortSelector value={undefined} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'price.asc');
    expect(onChange).toHaveBeenCalledWith({ field: 'price', direction: 'asc' });
  });

  it('calls onChange with undefined when the default option is picked', async () => {
    const onChange = vi.fn();
    render(<SortSelector value={{ field: 'price', direction: 'asc' }} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Sort by'), '');
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('renders all the expected options', () => {
    render(<SortSelector value={undefined} onChange={() => {}} />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(6);
    expect(screen.getByRole('option', { name: 'Price: low to high' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rating: high to low' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Newest first' })).toBeInTheDocument();
  });
});
