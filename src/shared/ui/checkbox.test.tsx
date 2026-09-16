import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders a labelled checkbox', () => {
    render(<Checkbox label="Include out of stock" />);
    expect(screen.getByLabelText('Include out of stock')).toBeInTheDocument();
  });

  it('toggles when clicked', async () => {
    render(<Checkbox label="Include out of stock" />);
    const box = screen.getByRole('checkbox');
    expect(box).not.toBeChecked();
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it('renders an optional hint', () => {
    render(<Checkbox label="Include out of stock" hint="May ship later" />);
    expect(screen.getByText('May ship later')).toBeInTheDocument();
  });

  it('is disabled when set', () => {
    render(<Checkbox label="Include out of stock" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
