import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from './popover';

describe('Popover', () => {
  it('renders the trigger always', () => {
    render(
      <Popover open={false} onClose={() => {}} trigger={<button type="button">Open</button>}>
        <p>panel content</p>
      </Popover>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    expect(screen.queryByText('panel content')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(
      <Popover open onClose={() => {}} trigger={<button type="button">Open</button>}>
        <p>panel content</p>
      </Popover>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('panel content')).toBeInTheDocument();
  });

  it('calls onClose on outside click', async () => {
    const onClose = vi.fn();
    render(
      <div>
        <Popover open onClose={onClose} trigger={<button type="button">Open</button>}>
          <p>panel content</p>
        </Popover>
        <button type="button">Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Popover open onClose={onClose} trigger={<button type="button">Open</button>}>
        <p>panel content</p>
      </Popover>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
