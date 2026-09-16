import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Radio } from './radio';

describe('Radio', () => {
  it('renders a labelled radio', () => {
    render(<Radio label="In stock" name="availability" value="in_stock" />);
    expect(screen.getByLabelText('In stock')).toBeInTheDocument();
  });

  it('selects when clicked', async () => {
    render(<Radio label="In stock" name="availability" value="in_stock" />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it('is unchecked by default', () => {
    render(<Radio label="In stock" name="availability" value="in_stock" />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Radio label="In stock" name="availability" value="in_stock" defaultChecked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });
});
