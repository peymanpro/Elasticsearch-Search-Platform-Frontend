import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('renders a labelled textbox', () => {
    render(<Input label="Query" />);
    expect(screen.getByLabelText('Query')).toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    render(<Input label="Query" />);
    const input = screen.getByLabelText('Query');
    await userEvent.type(input, 'headphones');
    expect(input).toHaveValue('headphones');
  });

  it('shows a hint when provided', () => {
    render(<Input label="Query" hint="Try a product name" />);
    expect(screen.getByText('Try a product name')).toBeInTheDocument();
  });

  it('shows an error and marks the input invalid', () => {
    render(<Input label="Query" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Query')).toHaveAttribute('aria-invalid', 'true');
  });

  it('prefers error over hint when both are given', () => {
    render(<Input label="Query" hint="hint text" error="error text" />);
    expect(screen.queryByText('hint text')).not.toBeInTheDocument();
    expect(screen.getByText('error text')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Input label="Query" disabled />);
    expect(screen.getByLabelText('Query')).toBeDisabled();
  });
});
