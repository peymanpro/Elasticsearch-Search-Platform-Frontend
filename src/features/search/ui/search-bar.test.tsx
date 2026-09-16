import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  it('renders the initial query in the input', () => {
    render(<SearchBar query="headphones" onSubmit={() => {}} />);
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue('headphones');
  });

  it('does not submit when the draft matches the query', async () => {
    const onSubmit = vi.fn();
    render(<SearchBar query="headphones" onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the trimmed draft on form submit', async () => {
    const onSubmit = vi.fn();
    render(<SearchBar query="" onSubmit={onSubmit} />);
    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search products' }),
      '  wireless headphones  ',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSubmit).toHaveBeenCalledWith('wireless headphones');
  });

  it('disables the submit button when the draft is empty', () => {
    render(<SearchBar query="" onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('disables the submit button when the draft equals the query', () => {
    render(<SearchBar query="existing" onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('enables the submit button once the user changes the draft', async () => {
    render(<SearchBar query="existing" onSubmit={() => {}} />);
    const input = screen.getByRole('searchbox', { name: 'Search products' });
    await userEvent.clear(input);
    await userEvent.type(input, 'new query');
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('resyncs the draft when the query prop changes', () => {
    const { rerender } = render(<SearchBar query="first" onSubmit={() => {}} />);
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue('first');
    rerender(<SearchBar query="second" onSubmit={() => {}} />);
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue('second');
  });

  it('submits on Enter', async () => {
    const onSubmit = vi.fn();
    render(<SearchBar query="" onSubmit={onSubmit} />);
    const input = screen.getByRole('searchbox', { name: 'Search products' });
    await userEvent.type(input, 'query{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('query');
  });
});
