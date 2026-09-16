import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  InfoIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from './icons';

const ALL = {
  SearchIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  AlertTriangleIcon,
  InfoIcon,
  SunIcon,
  MoonIcon,
};

describe('icons', () => {
  for (const [name, Icon] of Object.entries(ALL)) {
    it(`${name} renders an aria-hidden svg`, () => {
      const { container } = render(<Icon />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
    });

    it(`${name} accepts a custom size`, () => {
      const { container } = render(<Icon width={24} height={24} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });
  }
});
