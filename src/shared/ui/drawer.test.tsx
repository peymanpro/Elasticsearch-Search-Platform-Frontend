import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from './drawer';

describe('Drawer', () => {
  it('shows title and children when open', () => {
    render(
      <Drawer open onClose={() => {}} title="Explain">
        <p>drawer body</p>
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Explain' })).toBeInTheDocument();
    expect(screen.getByText('drawer body')).toBeInTheDocument();
  });

  it('has an accessible close button', () => {
    render(
      <Drawer open onClose={() => {}} title="Explain">
        <p>body</p>
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Explain">
        <p>body</p>
      </Drawer>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not render as open when the open prop is false', () => {
    render(
      <Drawer open={false} onClose={() => {}} title="Explain">
        <p>body</p>
      </Drawer>,
    );
    const dialog = screen.queryByRole('dialog', { name: 'Explain' });
    // <dialog> stays in the DOM but is not "open"
    if (dialog) {
      expect(dialog).not.toHaveAttribute('open');
    }
  });
});
