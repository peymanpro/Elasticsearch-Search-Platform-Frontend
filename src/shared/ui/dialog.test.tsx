import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './dialog';

describe('Dialog', () => {
  it('shows title and children when open', () => {
    render(
      <Dialog open onClose={() => {}} title="Confirm">
        <p>dialog body</p>
      </Dialog>,
    );
    expect(screen.getByRole('dialog', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByText('dialog body')).toBeInTheDocument();
  });

  it('has a close button', () => {
    render(
      <Dialog open onClose={() => {}} title="Confirm">
        <p>body</p>
      </Dialog>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when close is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Confirm">
        <p>body</p>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders a footer when provided', () => {
    render(
      <Dialog open onClose={() => {}} title="Confirm" footer={<button type="button">OK</button>}>
        <p>body</p>
      </Dialog>,
    );
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('does not have the open attribute when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Confirm">
        <p>body</p>
      </Dialog>,
    );
    const dialog = screen.queryByRole('dialog', { name: 'Confirm' });
    if (dialog) {
      expect(dialog).not.toHaveAttribute('open');
    }
  });
});
