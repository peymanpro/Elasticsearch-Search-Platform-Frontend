import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Switch } from './switch';

describe('Switch', () => {
  it('renders with role=switch', () => {
    render(<Switch label="Dark mode" />);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('toggles when clicked', async () => {
    render(<Switch label="Dark mode" />);
    const sw = screen.getByRole('switch');
    expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    expect(sw).toBeChecked();
  });

  it('is disabled when set', () => {
    render(<Switch label="Dark mode" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
