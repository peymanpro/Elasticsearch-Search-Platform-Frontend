import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>In stock</Badge>);
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('renders each tone without throwing', () => {
    const tones = ['neutral', 'success', 'warning', 'danger', 'accent'] as const;
    for (const tone of tones) {
      const { unmount } = render(<Badge tone={tone}>x</Badge>);
      expect(screen.getByText('x')).toBeInTheDocument();
      unmount();
    }
  });
});
