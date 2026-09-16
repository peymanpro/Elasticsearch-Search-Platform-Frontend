import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AutoSuggest } from './auto-suggest';

describe('AutoSuggest', () => {
  it('renders nothing when there are no suggestions and not loading', () => {
    const { container } = render(<AutoSuggest suggestions={[]} onSelect={() => {}} />);
    expect(container.querySelector('[role=listbox]')).toBeNull();
  });

  it('shows a loading indicator when loading with no suggestions', () => {
    render(<AutoSuggest suggestions={[]} loading onSelect={() => {}} />);
    expect(screen.getByText('…')).toBeInTheDocument();
  });

  it('renders suggestions as options', () => {
    render(
      <AutoSuggest suggestions={['Wireless Headphones', 'Wired Headphones']} onSelect={() => {}} />,
    );
    const list = screen.getByRole('listbox', { name: 'Search suggestions' });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('calls onSelect when an option is clicked', async () => {
    const onSelect = vi.fn();
    render(<AutoSuggest suggestions={['First', 'Second']} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Second'));
    expect(onSelect).toHaveBeenCalledWith('Second');
  });

  it('calls onDismiss when Escape is pressed', async () => {
    const onDismiss = vi.fn();
    render(<AutoSuggest suggestions={['First']} onSelect={() => {}} onDismiss={onDismiss} />);
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('moves focus with ArrowDown and selects on Enter', async () => {
    const onSelect = vi.fn();
    render(<AutoSuggest suggestions={['First', 'Second', 'Third']} onSelect={onSelect} />);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('Second');
  });
});
