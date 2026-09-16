import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/helpers/render-with-providers';
import { server } from '@/test/msw/server';

import { AutoSuggest } from './auto-suggest';

function mockSuggestions(list: string[]) {
  server.use(
    http.get('*/api/suggest/', ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get('q') ?? '';
      return HttpResponse.json({ prefix: q, suggestions: list });
    }),
  );
}

describe('AutoSuggest', () => {
  it('renders nothing when there are no suggestions', async () => {
    mockSuggestions([]);
    const { container } = renderWithProviders(<AutoSuggest query="zzz" onSelect={() => {}} />);
    await waitFor(() => {
      expect(container.querySelector('[role=listbox]')).toBeNull();
    });
  });

  it('renders suggestions as options', async () => {
    mockSuggestions(['Wireless Headphones', 'Wired Headphones']);
    renderWithProviders(<AutoSuggest query="headph" onSelect={() => {}} />);
    const list = await screen.findByRole('listbox', { name: 'Search suggestions' });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('calls onSelect when an option is clicked', async () => {
    mockSuggestions(['Wireless Headphones', 'Wired Headphones']);
    const onSelect = vi.fn();
    renderWithProviders(<AutoSuggest query="headph" onSelect={onSelect} />);
    await userEvent.click(await screen.findByText('Wired Headphones'));
    expect(onSelect).toHaveBeenCalledWith('Wired Headphones');
  });

  it('calls onDismiss when Escape is pressed', async () => {
    mockSuggestions(['Wireless Headphones']);
    const onDismiss = vi.fn();
    renderWithProviders(<AutoSuggest query="headph" onSelect={() => {}} onDismiss={onDismiss} />);
    await screen.findByRole('listbox');
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('moves focus with ArrowDown and selects on Enter', async () => {
    mockSuggestions(['First', 'Second', 'Third']);
    const onSelect = vi.fn();
    renderWithProviders(<AutoSuggest query="x" onSelect={onSelect} />);
    await screen.findByRole('listbox');

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('Second');
  });
});
