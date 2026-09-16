import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from './chip';

describe('Chip', () => {
  it('renders its children', () => {
    render(<Chip>Electronics</Chip>);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('has no remove button by default', () => {
    render(<Chip>Electronics</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a remove button when onRemove is provided', () => {
    render(<Chip onRemove={() => {}}>Electronics</Chip>);
    expect(screen.getByRole('button', { name: 'Remove filter' })).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Electronics</Chip>);
    await userEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('uses a custom removeLabel when provided', () => {
    render(
      <Chip onRemove={() => {}} removeLabel="Clear category">
        Electronics
      </Chip>,
    );
    expect(screen.getByRole('button', { name: 'Clear category' })).toBeInTheDocument();
  });
});
