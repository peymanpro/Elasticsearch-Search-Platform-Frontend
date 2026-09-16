import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a labelled textbox', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('accepts multi-line input', async () => {
    render(<Textarea label="Description" />);
    const area = screen.getByLabelText('Description');
    await userEvent.type(area, 'line one');
    expect(area).toHaveValue('line one');
  });

  it('defaults to 4 rows', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '4');
  });

  it('respects an explicit rows value', () => {
    render(<Textarea label="Description" rows={8} />);
    expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '8');
  });

  it('shows an error and marks the textarea invalid', () => {
    render(<Textarea label="Description" error="Too long" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Too long');
    expect(screen.getByLabelText('Description')).toHaveAttribute('aria-invalid', 'true');
  });
});
